import { siteConfig } from "../lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline">
      <div className="section-shell flex flex-col items-center justify-between gap-3 py-8 text-xs text-fg-subtle sm:flex-row">
        <p>
          {siteConfig.name} © {year}
        </p>
        <p className="font-mono">
          Built with Next.js, TypeScript &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
