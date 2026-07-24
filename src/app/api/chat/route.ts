import { NextRequest } from "next/server";
import { detectIntent, findRecentProjectSlug } from "../../../lib/chatbot/intent";
import { retrieveContext } from "../../../lib/chatbot/retrieval";
import { trimHistory } from "../../../lib/chatbot/memory";
import { getCachedResponse, setCachedResponse } from "../../../lib/chatbot/cache";
import { checkRateLimit, getClientIdentifier } from "../../../lib/chatbot/rateLimit";
import { validateInput, INJECTION_REFUSAL, TOO_LONG_MESSAGE } from "../../../lib/chatbot/security";
import { SYSTEM_PROMPT } from "../../../lib/chatbot/system-prompt";
import { getProvider } from "../../../lib/chatbot/providers";
import { guessLanguageHint } from "../../../lib/chatbot/language";
import projectsData from "../../../data/projects.json";
import contactData from "../../../data/contact.json";
import {
  trackMessage,
  trackFallback,
  trackResponseTime,
} from "../../../lib/chatbot/analytics";
import type { ChatMessage, ChatRequestBody } from "../../../lib/chatbot/types";

export const runtime = "nodejs";

// Every real URL that exists anywhere in the portfolio data. Used purely as
// a monitoring check after a response completes — if the model ever
// outputs a URL that isn't one of these, it was fabricated, and we log it
// loudly so it's easy to catch in server logs even though the two
// grounding fixes above (system prompt rule + real context injection)
// should prevent it from happening in the first place.
const KNOWN_URLS = new Set(
  [
    contactData.github,
    contactData.linkedin,
    contactData.resumeUrl,
    ...projectsData.projects.flatMap((p) => [p.liveUrl, p.githubUrl]),
  ].filter((url): url is string => Boolean(url))
);

function checkForFabricatedLinks(responseText: string) {
  const urls = responseText.match(/https?:\/\/[^\s)\]"'>]+/g) ?? [];
  for (const url of urls) {
    const cleaned = url.replace(/[.,;!?]+$/, "");
    if (!KNOWN_URLS.has(cleaned)) {
      console.warn(
        `[chatbot] Model output a URL not found in portfolio data — possible hallucination: ${cleaned}`
      );
    }
  }
}

function textStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

function streamResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const message = (body.message ?? "").toString();
  const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

  // 1. Rate limiting
  const identifier = getClientIdentifier(req.headers);
  const rateLimit = checkRateLimit(identifier);
  if (!rateLimit.allowed) {
    return new Response(
      "I'm getting a lot of messages right now — please try again in a moment.",
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 1000) / 1000)) } }
    );
  }

  // 2. Input validation + prompt-injection guard (deterministic, zero AI cost)
  const validation = validateInput(message);
  if (!validation.valid) {
    if (validation.reason === "empty") {
      return new Response("Say something and I'll take it from there!", { status: 400 });
    }
    if (validation.reason === "too_long") {
      return streamResponse(textStream(TOO_LONG_MESSAGE));
    }
    // injection_attempt
    trackMessage("prompt_injection", guessLanguageHint(message));
    return streamResponse(textStream(INJECTION_REFUSAL));
  }

  // 3. Deterministic intent classification
  const intentResult = detectIntent(message);
  const language = guessLanguageHint(message);
  trackMessage(intentResult.intent, language);

  // 4. Pure factual FAQ lookups — answered with zero AI cost. Everything
  // else (greetings, identity questions, contact, off-topic, etc.) always
  // gets a real, generated reply from the model so it's natural and never
  // repeats the same canned line.
  if (intentResult.deterministicAnswer) {
    trackResponseTime(Date.now() - startedAt);
    return streamResponse(textStream(intentResult.deterministicAnswer));
  }

  if (intentResult.intent === "off_topic") trackFallback(intentResult.intent);

  const trimmedHistory = trimHistory(history);

  // A bare follow-up like "link" or "demo" doesn't name a project on its
  // own — pull the project that was actually just discussed from recent
  // history instead of leaving the model with no grounding (which is what
  // previously let it invent a fake URL rather than using the real one).
  if (intentResult.intent === "project" && (!intentResult.projectSlugs || intentResult.projectSlugs.length === 0)) {
    const recentSlug = findRecentProjectSlug(trimmedHistory);
    if (recentSlug) intentResult.projectSlugs = [recentSlug];
  }
  const cacheScope =
    intentResult.intent === "project" ? (intentResult.projectSlugs ?? []).join(",") : undefined;

  // 5. Cache check — repeated questions never re-hit the model
  const cached = getCachedResponse(intentResult.intent, message, cacheScope);
  if (cached) {
    trackResponseTime(Date.now() - startedAt);
    return streamResponse(textStream(cached));
  }

  // 6. Build the smallest relevant context and call the model
  const context = retrieveContext(intentResult);

  const userTurn: ChatMessage = {
    role: "user",
    content: `CONTEXT (${context.label}):\n${JSON.stringify(context.data)}\n\nVisitor question: ${message}`,
  };

  let provider;
  try {
    provider = getProvider();
  } catch (err) {
    console.error("Provider configuration error:", err);
    return new Response(
      "I'm having trouble connecting to my model provider right now — please try again shortly.",
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of provider.stream({
          systemPrompt: SYSTEM_PROMPT,
          messages: [...trimmedHistory, userTurn],
          maxOutputTokens: 220,
        })) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        setCachedResponse(intentResult.intent, message, fullResponse, cacheScope);
        checkForFabricatedLinks(fullResponse);
        trackResponseTime(Date.now() - startedAt);
      } catch (err) {
        console.error("Model stream error:", err);
        trackFallback(intentResult.intent);
        const fallback =
          "I'm not sure based on the information available in my portfolio — feel free to email me at grechelleab@gmail.com and ask directly.";
        controller.enqueue(encoder.encode(fullResponse ? "" : fallback));
      } finally {
        controller.close();
      }
    },
  });

  return streamResponse(stream);
}