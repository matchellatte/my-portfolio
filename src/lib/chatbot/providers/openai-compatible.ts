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
      const isReasoningModel = /^(gpt-5|o1|o3|o4)/i.test(config.model);

      // Reasoning models (gpt-5 family, o1/o3/o4) spend invisible "reasoning
      // tokens" out of the SAME max_completion_tokens budget as the visible
      // reply. With a low cap and default (medium) reasoning effort, the
      // model can burn the whole budget on reasoning and return an empty
      // completion with finish_reason "length" — no error, just silence.
      // For a short, conversational chatbot reply we don't need deep
      // reasoning, so pin it to minimal effort and give the budget enough
      // headroom to cover reasoning + the actual answer.
      const body: Record<string, unknown> = {
        model: config.model,
        stream: true,
        max_completion_tokens: isReasoningModel
          ? Math.max(maxOutputTokens, 450)
          : maxOutputTokens,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      };
      if (isReasoningModel) {
        body.reasoning_effort = "minimal";
      }

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`Model request failed (${response.status}): ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedAnyContent = false;
      let finishReason: string | null = null;

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
          if (payload === "[DONE]") {
            if (!receivedAnyContent) {
              throw new Error(
                finishReason === "length"
                  ? "Model returned no visible content (ran out of tokens, possibly on internal reasoning)."
                  : "Model returned an empty response."
              );
            }
            return;
          }

          try {
            const json = JSON.parse(payload);
            const choice = json.choices?.[0];
            const delta: string | undefined = choice?.delta?.content;
            if (choice?.finish_reason) finishReason = choice.finish_reason;
            if (delta) {
              receivedAnyContent = true;
              yield delta;
            }
          } catch {
            // Ignore malformed keep-alive fragments.
          }
        }
      }

      if (!receivedAnyContent) {
        throw new Error("Model stream ended without returning any content.");
      }
    },
  };
}