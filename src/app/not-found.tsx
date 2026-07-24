import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-display-sm font-medium text-fg">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-3 max-w-sm text-[15px] text-fg-muted">
        The page you&rsquo;re looking for may have moved or was never built.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
