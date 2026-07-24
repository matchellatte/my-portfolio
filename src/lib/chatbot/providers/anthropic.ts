import type { ChatProvider, ProviderStreamOptions } from "../types";

interface AnthropicConfig {
  apiKey: string;
  model: string;
}

export function createAnthropicProvider(config: AnthropicConfig): ChatProvider {
  return {
    async *stream({ systemPrompt, messages, maxOutputTokens = 400 }: ProviderStreamOptions) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.model,
          system: systemPrompt,
          max_tokens: maxOutputTokens,
          stream: true,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
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
          if (!payload) continue;

          try {
            const json = JSON.parse(payload);
            if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
              yield json.delta.text as string;
            }
          } catch {
            // Ignore malformed keep-alive fragments.
          }
        }
      }
    },
  };
}
