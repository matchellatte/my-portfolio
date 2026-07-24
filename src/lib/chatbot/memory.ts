import type { ChatMessage } from "./types";

const MAX_TURNS = 3; // last 3 user+assistant pairs = 6 messages
const MAX_MESSAGE_CHARS = 500;

/**
 * Keeps only the most recent exchanges and trims any oversized messages.
 * This is intentionally simple truncation rather than an LLM-generated
 * summary — summarizing would itself cost tokens. If richer memory is
 * needed later, this is the single place to add a summarization step.
 */
export function trimHistory(history: ChatMessage[] = []): ChatMessage[] {
  const trimmed = history.slice(-MAX_TURNS * 2);
  return trimmed.map((m) => ({
    role: m.role,
    content: m.content.length > MAX_MESSAGE_CHARS ? m.content.slice(0, MAX_MESSAGE_CHARS) + "…" : m.content,
  }));
}
