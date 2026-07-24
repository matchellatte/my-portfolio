"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Command,
  Copy,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { navLinks, projects, siteConfig } from "../lib/data";
import { useTheme } from "../lib/theme";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  action: () => void;
  group: "Navigate" | "Projects" | "Connect" | "Appearance";
};

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const items: CommandItem[] = useMemo(
    () => [
      ...navLinks.map((link) => ({
        id: `nav-${link.href}`,
        label: link.label,
        hint: link.href,
        icon: <ArrowRight size={15} />,
        action: () => {
          document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
          close();
        },
        group: "Navigate" as const,
      })),
      ...projects.map((project) => ({
        id: `project-${project.slug}`,
        label: project.name,
        hint: project.technologies.slice(0, 2).join(", "),
        icon: <ArrowRight size={15} />,
        action: () => {
          document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
          close();
        },
        group: "Projects" as const,
      })),
      {
        id: "copy-email",
        label: `Copy email — ${siteConfig.email}`,
        icon: <Copy size={15} />,
        action: async () => {
          await navigator.clipboard.writeText(siteConfig.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
        group: "Connect" as const,
      },
      {
        id: "github",
        label: "Open GitHub",
        icon: <Github size={15} />,
        action: () => {
          window.open(siteConfig.github, "_blank", "noopener,noreferrer");
          close();
        },
        group: "Connect" as const,
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        icon: <Linkedin size={15} />,
        action: () => {
          window.open(siteConfig.linkedin, "_blank", "noopener,noreferrer");
          close();
        },
        group: "Connect" as const,
      },
      {
        id: "email",
        label: "Send an email",
        icon: <Mail size={15} />,
        action: () => {
          window.location.href = `mailto:${siteConfig.email}`;
          close();
        },
        group: "Connect" as const,
      },
      {
        id: "toggle-theme",
        label: theme === "light" ? "Switch to dark mode" : "Switch to light mode",
        icon: theme === "light" ? <Moon size={15} /> : <Sun size={15} />,
        action: () => {
          toggleTheme();
          close();
        },
        group: "Appearance" as const,
      },
    ],
    [theme, toggleTheme]
  );

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    const openFromButton = () => setOpen(true);

    window.addEventListener("keydown", handler);
    window.addEventListener("open-command-menu", openFromButton);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-command-menu", openFromButton);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  };

  const groups = ["Navigate", "Projects", "Connect", "Appearance"] as const;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[18%] z-[71] w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={16} className="text-fg-subtle" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section, project, or contact link…"
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
              />
              <kbd className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
                esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-fg-subtle">
                  No matches for &ldquo;{query}&rdquo;
                </p>
              )}

              {groups.map((group) => {
                const groupItems = filtered.filter((i) => i.group === group);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group} className="mb-1 last:mb-0">
                    <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
                      {group}
                    </p>
                    {groupItems.map((item) => {
                      const globalIndex = filtered.indexOf(item);
                      const isActive = globalIndex === activeIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => item.action()}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-100 ${
                            isActive
                              ? "bg-accent/15 text-fg"
                              : "text-fg-muted"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={isActive ? "text-accent" : "text-fg-subtle"}>
                              {item.icon}
                            </span>
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="font-mono text-xs text-fg-subtle">
                              {item.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="font-mono text-[11px] text-fg-subtle">
                {copied ? "Copied to clipboard" : "↑↓ to navigate · ↵ to select"}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-fg-subtle">
                <Command size={11} />K
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
