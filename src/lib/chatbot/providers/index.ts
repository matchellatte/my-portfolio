import type { ChatProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";
import { createAnthropicProvider } from "./anthropic";
import { createGeminiProvider } from "./gemini";

export type AiProviderName = "openai" | "anthropic" | "gemini" | "deepseek";

/**
 * The single switch for "which model answers the chatbot." Everything
 * upstream (the route handler) just calls `getProvider().stream(...)` and
 * never knows which vendor is behind it.
 *
 * Configure via env vars:
 *   AI_PROVIDER=openai|anthropic|gemini|deepseek   (default: openai)
 *   AI_MODEL=gpt-5-nano                              (provider-specific model id)
 *   OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY / DEEPSEEK_API_KEY
 */
export function getProvider(): ChatProvider {
  const providerName = (process.env.AI_PROVIDER as AiProviderName) || "openai";

  switch (providerName) {
    case "openai": {
      const apiKey = requireEnv("OPENAI_API_KEY");
      const model = process.env.AI_MODEL || "gpt-5-nano";
      return createOpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: "https://api.openai.com/v1",
      });
    }

    case "deepseek": {
      const apiKey = requireEnv("DEEPSEEK_API_KEY");
      const model = process.env.AI_MODEL || "deepseek-chat";
      return createOpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: "https://api.deepseek.com",
      });
    }

    case "anthropic": {
      const apiKey = requireEnv("ANTHROPIC_API_KEY");
      const model = process.env.AI_MODEL || "claude-haiku-4-5-20251001";
      return createAnthropicProvider({ apiKey, model });
    }

    case "gemini": {
      const apiKey = requireEnv("GEMINI_API_KEY");
      const model = process.env.AI_MODEL || "gemini-flash-latest";
      return createGeminiProvider({ apiKey, model });
    }

    default:
      throw new Error(`Unknown AI_PROVIDER: "${providerName}"`);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Set it in .env.local (see .env.example).`
    );
  }
  return value;
}
