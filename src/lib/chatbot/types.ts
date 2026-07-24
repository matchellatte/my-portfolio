export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type Intent =
  | "greeting"
  | "faq"
  | "about"
  | "contact"
  | "resume"
  | "tech_stack"
  | "project"
  | "experience"
  | "education"
  | "availability"
  | "off_topic"
  | "prompt_injection"
  | "unknown";

export interface IntentResult {
  intent: Intent;
  /** For "project" intent: matched project slugs, if any */
  projectSlugs?: string[];
  /** Deterministic answer, if one exists — skips the LLM entirely */
  deterministicAnswer?: string;
}

export interface RetrievedContext {
  /** Short, human-readable label of what was retrieved, for logging/debugging */
  label: string;
  /** The actual JSON payload to inject into the LLM context — kept minimal */
  data: unknown;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

export interface ProviderStreamOptions {
  systemPrompt: string;
  messages: ChatMessage[];
  maxOutputTokens?: number;
}

export interface ChatProvider {
  /** Streams response text chunks as they arrive from the model. */
  stream(options: ProviderStreamOptions): AsyncGenerator<string, void, unknown>;
}
