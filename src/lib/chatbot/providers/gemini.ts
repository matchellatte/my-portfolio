import type { ChatProvider, ProviderStreamOptions } from "../types";

interface GeminiConfig {
  apiKey: string;
  model: string;
}

export function createGeminiProvider(config: GeminiConfig): ChatProvider {
  return {
    async *stream({ systemPrompt, messages, maxOutputTokens = 400 }: ProviderStreamOptions) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
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
            const text: string | undefined = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield text;
          } catch {
            // Ignore malformed keep-alive fragments.
          }
        }
      }
    },
  };
}
