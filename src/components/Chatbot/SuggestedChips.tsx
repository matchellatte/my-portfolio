const SUGGESTIONS = [
  "Tell me about yourself",
  "Tech stack",
  "Featured projects",
  "Experience",
  "Current focus",
  "AI interests",
  "Contact",
  "Resume",
];

export default function SuggestedChips({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-3">
      {SUGGESTIONS.map((chip) => (
        <button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-fg-muted transition-colors duration-150 hover:border-line-strong hover:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
