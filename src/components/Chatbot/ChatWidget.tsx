"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PawPrint, Send, X } from "lucide-react";
import { useChat } from "../../lib/chatbot/useChat";
import ChatBubble from "./ChatBubble";
import SuggestedChips from "./SuggestedChips";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, isStreaming } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleChip = (text: string) => {
    sendMessage(text);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="group fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-sm shadow-black/20 transition-colors hover:bg-accent-hover sm:bottom-6 sm:right-6"
        aria-label={open ? "Close chat" : "Chat with the Catbot"}
      >
        {!open && (
          <>
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-accent/30"
              animate={{ scale: [1, 1.35, 1.65], opacity: [0.55, 0.18, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-bg bg-emerald-500 shadow-sm shadow-emerald-500/40"
            />
          </>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <PawPrint size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close chat overlay"
              className="fixed inset-0 z-30 bg-fg/20 backdrop-blur-[2px] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="presentation"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-4 left-4 right-4 z-40 overflow-visible sm:bottom-24 sm:left-auto sm:right-6 sm:w-[min(420px,calc(100vw-3rem))]"
            >
            <div
              role="dialog"
              aria-modal="false"
              aria-label="Chat with the Catbot"
              className="flex h-[min(600px,75vh)] max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-bg shadow-sm sm:max-h-[min(600px,75vh)]"
            >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3.5 backdrop-blur">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-line/60">
                <img
                  src="/chatbot/catbot-profile.jpg"
                  alt="Catbot"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">Chat with Catbot</p>
                <p className="flex items-center gap-1.5 text-xs text-fg-subtle">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Usually purrs back instantly
                </p>
              </div>
              <PawPrint size={14} className="shrink-0 text-fg-subtle/60" />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-bg px-4 py-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-3 h-14 w-14 overflow-hidden rounded-full ring-1 ring-line/60">
                    <img
                      src="/chatbot/catbot-profile.jpg"
                      alt="Catbot"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-fg-muted">
                    Hi, I'm Catbot!
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    Ask me about my projects, tech stack, or experience.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <ChatBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  isStreaming={isStreaming && i === messages.length - 1}
                />
              ))}
            </div>

            {messages.length === 0 && (
              <SuggestedChips onSelect={handleChip} disabled={isStreaming} />
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-line bg-surface/80 p-3 backdrop-blur"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={isStreaming}
                className="w-full flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-accent/50 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}