import TypingIndicator from "./TypingIndicator";

export default function ChatBubble({
  role,
  content,
  isStreaming,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}) {
  const isUser = role === "user";
  const showTyping = !isUser && content.length === 0 && isStreaming;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mb-1.5 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-line/60">
          <img
            src="/chatbot/catbot-profile.jpg"
            alt="Catbot"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-accent text-white"
            : "rounded-bl-sm border border-line bg-surface text-fg-muted"
        }`}
      >
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <span className="whitespace-pre-wrap">{content}</span>
        )}
      </div>
    </div>
  );
}
