import { NextRequest } from "next/server";
import { detectIntent } from "../../../lib/chatbot/intent";
import { retrieveContext } from "../../../lib/chatbot/retrieval";
import { trimHistory } from "../../../lib/chatbot/memory";
import { getCachedResponse, setCachedResponse } from "../../../lib/chatbot/cache";
import { checkRateLimit, getClientIdentifier } from "../../../lib/chatbot/rateLimit";
import { validateInput, INJECTION_REFUSAL, TOO_LONG_MESSAGE } from "../../../lib/chatbot/security";
import { SYSTEM_PROMPT } from "../../../lib/chatbot/system-prompt";
import { getProvider } from "../../../lib/chatbot/providers";
import { guessLanguageHint } from "../../../lib/chatbot/language";
import {
  trackMessage,
  trackFallback,
  trackResponseTime,
} from "../../../lib/chatbot/analytics";
import type { ChatMessage, ChatRequestBody } from "../../../lib/chatbot/types";

export const runtime = "nodejs";

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

  // 4. FAQ / greeting / about / off-topic — answered with zero AI cost
  if (intentResult.deterministicAnswer) {
    if (intentResult.intent === "off_topic") trackFallback(intentResult.intent);
    trackResponseTime(Date.now() - startedAt);
    return streamResponse(textStream(intentResult.deterministicAnswer));
  }

  // 5. Cache check — repeated questions never re-hit the model
  const cached = getCachedResponse(intentResult.intent, message);
  if (cached) {
    trackResponseTime(Date.now() - startedAt);
    return streamResponse(textStream(cached));
  }

  // 6. Build the smallest relevant context and call the model
  const context = retrieveContext(intentResult);
  const trimmedHistory = trimHistory(history);

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
          maxOutputTokens: 400,
        })) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        setCachedResponse(intentResult.intent, message, fullResponse);
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
