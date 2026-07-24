import faqData from "../../data/faq.json";
import projectsData from "../../data/projects.json";
import type { ChatMessage, IntentResult } from "./types";

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Matches a keyword/phrase against the message on word boundaries rather
 * than raw substring — `message.includes("hi")` would otherwise false-match
 * inside "history" or "this", and `includes("yo")` inside "your". Multi-word
 * phrases (e.g. "tech stack") naturally have boundaries at both ends, so
 * this is safe for single words and phrases alike.
 */
function matchesKeyword(message: string, keyword: string): boolean {
  const pattern = new RegExp(`(?:^|\\W)${escapeRegExp(keyword)}(?:$|\\W)`, "i");
  return pattern.test(message);
}

function matchesAny(message: string, keywords: string[]): boolean {
  return keywords.some((kw) => matchesKeyword(message, kw));
}

function matchProjectSlugs(message: string): string[] {
  return projectsData.projects
    .filter((project) =>
      project.aliases.some((alias) => matchesKeyword(message, alias)) ||
      matchesKeyword(message, project.name.toLowerCase())
    )
    .map((project) => project.slug);
}

// Signals a message is clearly outside the portfolio's scope (trivia,
// homework, unrelated coding help, etc). This is only used to skip
// attaching irrelevant portfolio context and to label analytics — the
// actual refusal is written by the model itself (see system-prompt.ts),
// so the wording varies naturally instead of repeating one fixed line.
// False negatives here aren't a safety issue: the system prompt's scope
// rule is the real backstop for anything that slips past this filter.
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /capital of/i,
  /who won (the )?(nba|nfl|world cup|super bowl|election|oscar)/i,
  /write (my|our) (homework|essay|assignment)/i,
  /solve (this|the following)?\s*(equation|for x|math)/i,
  /what('s| is) the weather/i,
  /translate (this|the following)/i,
  /who is the (president|prime minister) of/i,
  /quantum (physics|mechanics)/i,
  /(generate|write) (a |an )?(poem|song|story|essay) about (?!.*(grechelle|my|your|this project))/i,
  /what year did .* (happen|occur)/i,
  /how do i (cook|bake)/i,
  /stock price/i,
  /generate code for (?!.*(grechelle|my|your|this project))/i,
];

// Broad, casual matches on purpose — these only decide which JSON slice to
// attach as context. The model does the actual understanding, so a phrase
// that isn't listed here still gets a sensible answer via the "unknown"
// fallback context rather than a dead end.
const GREETING_KEYWORDS = [
  "hi", "hello", "hey", "yo", "sup",
  "good morning", "good afternoon", "good evening",
  "how are you", "how're you", "how you doing", "how's it going", "hows it going",
  "what's up", "whats up",
  "kumusta", "kamusta", "musta", "kamusta ka", "kumusta ka",
];
const ABOUT_KEYWORDS = [
  "tell me about yourself", "who are you", "sino ka", "sino ka ba",
  "about you", "introduce yourself", "your background", "what do you do",
  "who is grechelle", "tungkol saan", "tungkol kanino",
];
const CONTACT_KEYWORDS = [
  "contact", "reach you", "get in touch", "how can i contact",
  "message you", "connect with you", "email you", "hire you",
  "paano kita", "pwede ba kitang", "pwede kitang", "makontak",
];
const RESUME_KEYWORDS = ["resume", "cv", "curriculum vitae"];
const EDUCATION_KEYWORDS = ["education", "degree", "university", "college", "school", "studied"];
const EXPERIENCE_KEYWORDS = ["experience", "intern", "internship", "job history", "work history", "worked at"];
const TECH_KEYWORDS = ["tech stack", "technologies", "framework", "programming language", "do you know", "familiar with", "ano ginagamit"];
const PROJECT_KEYWORDS = ["project", "built", "portfolio piece", "case study", "app you made", "worked on"];
const AVAILABILITY_KEYWORDS = ["hire", "available", "availability", "freelance", "open to work", "collaborate"];

// Short follow-ups that only make sense in the context of whatever project
// was just being discussed — "link", "demo", "repo", etc, asked on their
// own. These alone don't identify a project, so detectIntent() flags them
// as "project" with no slug, and route.ts falls back to
// findRecentProjectSlug() to pull the actual project (and its real URLs)
// back into context instead of leaving the model to guess — which is
// exactly what caused it to invent a fake link before.
const FOLLOW_UP_KEYWORDS = [
  "link", "url", "demo", "demo link", "repo", "repository", "source",
  "site", "website", "tour", "more about it", "more details", "show me",
  "open it", "that project", "the project",
];

export function detectIntent(rawMessage: string): IntentResult {
  const message = normalize(rawMessage);

  // 1. Static FAQ — narrow, purely factual lookups where a fixed answer is
  // correct and there's no conversational upside to varying it (email,
  // GitHub, LinkedIn, a quick "thanks"). Everything else below is scoped
  // for retrieval only and always gets a real, generated reply.
  for (const entry of faqData.entries) {
    if (matchesAny(message, entry.keywords)) {
      return { intent: "faq", deterministicAnswer: entry.answer };
    }
  }

  // 2. Off-topic — flagged for context-scoping/analytics only; the model
  // writes the actual (varied, in-character) decline.
  if (OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(message))) {
    return { intent: "off_topic" };
  }

  // 3. Project match — collect any project whose name/alias appears.
  const matchedSlugs = matchProjectSlugs(message);
  if (matchedSlugs.length > 0) {
    return { intent: "project", projectSlugs: matchedSlugs };
  }

  if (matchesAny(message, PROJECT_KEYWORDS) || matchesAny(message, FOLLOW_UP_KEYWORDS)) {
    return { intent: "project", projectSlugs: [] }; // caller resolves via recent history if possible
  }

  // 4. Conversational categories — all routed to the model with scoped
  // context, so replies are natural and never feel like a canned script.
  if (matchesAny(message, GREETING_KEYWORDS)) return { intent: "greeting" };
  if (matchesAny(message, ABOUT_KEYWORDS)) return { intent: "about" };
  if (matchesAny(message, CONTACT_KEYWORDS)) return { intent: "contact" };
  if (matchesAny(message, RESUME_KEYWORDS)) return { intent: "resume" };
  if (matchesAny(message, EDUCATION_KEYWORDS)) return { intent: "education" };
  if (matchesAny(message, EXPERIENCE_KEYWORDS)) return { intent: "experience" };
  if (matchesAny(message, TECH_KEYWORDS)) return { intent: "tech_stack" };
  if (matchesAny(message, AVAILABILITY_KEYWORDS)) return { intent: "availability" };

  // 5. Fall through to a generous, in-scope default context — the local
  // classifier missing a category isn't a dead end, since "unknown" still
  // carries enough about Grechelle for the model to answer well.
  return { intent: "unknown" };
}

/**
 * Scans recent conversation history (most recent first) for the last
 * project that was named, so short follow-ups ("link?", "show me the
 * repo") can pull the real project data back into context instead of
 * getting no grounding at all — which is what let the model invent a
 * fake URL previously.
 */
export function findRecentProjectSlug(history: ChatMessage[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    if (!message) continue;

    const slugs = matchProjectSlugs(normalize(message.content));
    if (slugs.length > 0) return slugs[0] ?? null;
  }
  return null;
}