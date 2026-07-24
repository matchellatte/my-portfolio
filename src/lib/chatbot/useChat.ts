"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "./types";

export interface UiMessage extends ChatMessage {
  id: string;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function useChat() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);

    const userMessage: UiMessage = { id: makeId(), role: "user", content: trimmed };
    const assistantId = makeId();

    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyRef.current.slice(-6),
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text().catch(() => "Something went wrong. Please try again.");
        throw new Error(text || "Something went wrong. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m))
        );
      }

      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: trimmed },
        { role: "assistant", content: full },
      ].slice(-8);
    } catch (err) {
      const messageText =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(messageText);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong on my end — please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming]);

  return { messages, sendMessage, isStreaming, error };
}
