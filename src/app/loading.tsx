export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-bg">
      <div className="flex items-center gap-3 font-mono text-sm text-fg-subtle">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Loading
      </div>
    </div>
  );
}
