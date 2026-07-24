import faqData from "../../data/faq.json";
import projectsData from "../../data/projects.json";
import type { Intent, IntentResult } from "./types";

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

// Patterns for questions that are clearly outside the portfolio's scope.
// This is a cost-saving pre-filter, not the only safeguard — the system
// prompt also instructs the model to refuse anything off-topic that slips
// through, so false negatives here are not a safety issue, just a cost one.
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

export const OFF_TOPIC_REFUSAL =
  "I'm here to answer questions about my experience, projects, and software engineering journey. For general questions like that, a general AI assistant like ChatGPT would be a better fit.";

const EDUCATION_KEYWORDS = ["education", "degree", "university", "college", "school", "studied"];
const EXPERIENCE_KEYWORDS = ["experience", "intern", "internship", "job history", "work history", "worked at"];
const TECH_KEYWORDS = ["tech stack", "technologies", "framework", "programming language", "do you know", "familiar with"];
const PROJECT_KEYWORDS = ["project", "built", "portfolio piece", "case study", "app you made", "worked on"];
const AVAILABILITY_KEYWORDS = ["hire", "available", "freelance", "open to work", "collaborate"];

export function detectIntent(rawMessage: string): IntentResult {
  const message = normalize(rawMessage);

  // 1. Static FAQ — exact-feel keyword matches, zero AI cost.
  for (const entry of faqData.entries) {
    if (entry.keywords.some((kw) => matchesKeyword(message, kw))) {
      const intent: Intent = entry.id === "about" ? "about" : "faq";
      return { intent, deterministicAnswer: entry.answer };
    }
  }

  // 2. Off-topic pre-filter.
  if (OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(message))) {
    return { intent: "off_topic", deterministicAnswer: OFF_TOPIC_REFUSAL };
  }

  // 3. Project match — collect any project whose name/alias appears.
  const matchedSlugs = projectsData.projects
    .filter((project) =>
      project.aliases.some((alias) => matchesKeyword(message, alias)) ||
      matchesKeyword(message, project.name.toLowerCase())
    )
    .map((project) => project.slug);

  if (matchedSlugs.length > 0) {
    return { intent: "project", projectSlugs: matchedSlugs };
  }

  if (PROJECT_KEYWORDS.some((kw) => matchesKeyword(message, kw))) {
    return { intent: "project", projectSlugs: [] }; // no specific match → send all project summaries
  }

  // 4. Other in-scope categories that need a nuanced (LLM) answer.
  if (EDUCATION_KEYWORDS.some((kw) => matchesKeyword(message, kw))) {
    return { intent: "education" };
  }
  if (EXPERIENCE_KEYWORDS.some((kw) => matchesKeyword(message, kw))) {
    return { intent: "experience" };
  }
  if (TECH_KEYWORDS.some((kw) => matchesKeyword(message, kw))) {
    return { intent: "tech_stack" };
  }
  if (AVAILABILITY_KEYWORDS.some((kw) => matchesKeyword(message, kw))) {
    return { intent: "availability" };
  }

  // 5. Fall through to a general, in-scope answer grounded in the profile.
  return { intent: "unknown" };
}
