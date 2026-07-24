import type { ChatProvider, ProviderStreamOptions } from "../types";

interface OpenAICompatibleConfig {
  apiKey: string;
  baseUrl: string; // e.g. "https://api.openai.com/v1"
  model: string;
}

/**
 * Streams from any Chat Completions-compatible endpoint (OpenAI, DeepSeek,
 * and most self-hosted OpenAI-compatible gateways). Parses the
 * `data: {...}` SSE stream and yields only the incremental text deltas.
 */
export function createOpenAICompatibleProvider(config: OpenAICompatibleConfig): ChatProvider {
  return {
    async *stream({ systemPrompt, messages, maxOutputTokens = 400 }: ProviderStreamOptions) {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          stream: true,
          max_completion_tokens: maxOutputTokens,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`Model request failed (${response.status}): ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") return;

          try {
            const json = JSON.parse(payload);
            const delta: string | undefined = json.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {
            // Ignore malformed keep-alive fragments.
          }
        }
      }
    },
  };
}
