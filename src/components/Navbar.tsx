"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "../lib/data";
import { useActiveSection } from "../lib/useActiveSection";
import ThemeToggle from "./ThemeToggle";

const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Close on Escape, and auto-close if the viewport grows past the mobile breakpoint
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a
          href="#home"
          className="font-mono text-sm font-medium tracking-tight text-fg"
        >
          {siteConfig.name.toLowerCase()}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-menu"))
            }
            className="flex items-center gap-2 rounded-md border border-line bg-surface/60 px-2.5 py-1.5 text-xs text-fg-subtle transition-colors hover:border-line-strong hover:text-fg-muted"
            aria-label="Open command menu"
          >
            <Command size={13} />
            <span className="font-mono">K</span>
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bg/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-line bg-surface shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
                <span className="font-mono text-sm text-fg">
                  {siteConfig.name.toLowerCase()}
                  <span className="text-accent">.</span>
                </span>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-all duration-200 hover:rotate-90 hover:border-line-strong hover:text-fg"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Links */}
              <motion.ul
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.045, delayChildren: 0.1 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.03, staggerDirection: -1 },
                  },
                }}
                className="flex flex-1 flex-col justify-center gap-1 px-4"
              >
                {navLinks.map((link, i) => {
                  const id = link.href.replace("#", "");
                  const isActive = activeId === id;
                  return (
                    <motion.li
                      key={link.href}
                      variants={{
                        closed: { opacity: 0, x: 24 },
                        open: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors duration-200 ${
                          isActive
                            ? "text-fg"
                            : "text-fg-muted hover:text-fg"
                        }`}
                      >
                        <span
                          className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                            isActive ? "text-accent" : "text-fg-subtle group-hover:text-accent"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-2xl font-medium tracking-tight">
                          {link.label}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="mobile-nav-active-dot"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                          />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Panel footer */}
              <div className="flex shrink-0 items-center justify-between border-t border-line px-6 py-5">
                <button
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("open-command-menu"));
                  }}
                  className="flex items-center gap-2 rounded-md border border-line bg-bg/60 px-2.5 py-1.5 text-xs text-fg-subtle transition-colors hover:border-line-strong hover:text-fg-muted"
                  aria-label="Open command menu"
                >
                  <Command size={13} />
                  <span className="font-mono">K</span>
                </button>
                <span className="font-mono text-xs text-fg-subtle">
                  {String(navLinks.length).padStart(2, "0")} sections
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}