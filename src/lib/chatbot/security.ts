const MAX_MESSAGE_LENGTH = 800;

// Heuristic patterns for common prompt-injection / jailbreak attempts.
// This is a defense-in-depth layer, not the only one — the system prompt
// also instructs the model to refuse these. Catching them here means we
// never spend a token on an obvious attack.
const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all|any|the)?\s*(previous|prior|above)\s*instructions?/i,
  /disregard (all|any|the)?\s*(previous|prior|above)\s*instructions?/i,
  /reveal (your|the)\s*(system prompt|instructions|prompt)/i,
  /show (me\s*)?(your|the)\s*(system prompt|instructions|prompt)/i,
  /repeat (everything|all text)\s*above/i,
  /what (is|are) your (system prompt|instructions)/i,
  /act as (chatgpt|a generic assistant|an ai assistant|gpt)/i,
  /you are now\s/i,
  /forget (you('re| are)|that you('re| are))\s*grechelle/i,
  /pretend (you('re| are)|to be)\s*(chatgpt|an ai|a different)/i,
  /developer mode/i,
  /jailbreak/i,
  /\bsystem\s*:\s*/i,
  /\[\[.*(system|prompt).*\]\]/i,
];

export interface ValidationResult {
  valid: boolean;
  reason?: "too_long" | "empty" | "injection_attempt";
}

export function validateInput(message: string): ValidationResult {
  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  if (INJECTION_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return { valid: false, reason: "injection_attempt" };
  }

  return { valid: true };
}

export const INJECTION_REFUSAL =
  "I'll stay myself for this conversation — happy to talk about my work though! What would you like to know about my projects or experience?";

export const TOO_LONG_MESSAGE =
  "That's a lot to read at once! Could you shorten your question a bit?";
