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
            className="text-fg-muted"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-bg/98 backdrop-blur-sm md:hidden"
          >
            <div className="section-shell flex h-16 items-center justify-between">
              <span className="font-mono text-sm text-fg">
                {siteConfig.name.toLowerCase()}
                <span className="text-accent">.</span>
              </span>
              <button
                className="text-fg-muted"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <motion.ul
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="section-shell mt-8 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    closed: { opacity: 0, y: 8 },
                    open: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 text-2xl text-fg-muted"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
