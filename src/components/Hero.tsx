"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { siteConfig } from "../lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Fixed (non-random) positions so server/client markup always matches.
// Clustered on the right side, where the layout has the most empty space.
const nodes = [
  { top: "22%", left: "68%", size: 5, duration: 3.2, delay: 0 },
  { top: "38%", left: "86%", size: 3, duration: 2.6, delay: 0.4 },
  { top: "58%", left: "74%", size: 4, duration: 3.6, delay: 1.1 },
  { top: "72%", left: "90%", size: 3, duration: 2.9, delay: 0.7 },
  { top: "48%", left: "60%", size: 3, duration: 3.1, delay: 1.6 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty("--mx", `${x}%`);
      spotlight.style.setProperty("--my", `${y}%`);
      spotlight.style.opacity = "1";
    };
    const handleLeave = () => {
      spotlight.style.opacity = "0";
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* Signature background: dotted grid + traveling trace */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mask-fade-b bg-[radial-gradient(var(--grid-line)_1.75px,transparent_1.75px)] bg-[size:64px_64px] opacity-90"
      />

      {/* Mouse-reactive flashlight: brightens nearby dots only, follows the cursor */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out bg-[radial-gradient(rgb(var(--accent)/0.8)_1.5px,transparent_1.5px)] bg-[size:64px_64px]"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 260px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 70%)",
          maskImage:
            "radial-gradient(circle 260px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(var(--accent)/0.15),transparent)]"
      />

      {/* Soft pulsing nodes — a quiet suggestion of a network, on the empty right side */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {nodes.map((node, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-accent"
            style={{
              top: node.top,
              left: node.left,
              width: node.size,
              height: node.size,
              boxShadow: "0 0 10px 1px rgb(var(--accent) / 0.5)",
            }}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.3, 1] }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="section-shell relative">
        <div className="max-w-3xl">
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="eyebrow mb-6 flex items-center gap-2"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
            className="text-display-sm font-medium text-fg sm:text-display-md md:text-display-lg"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.16}
            variants={fadeUp}
            className="mt-3 font-mono text-sm text-accent sm:text-base"
          >
            {siteConfig.role}
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={fadeUp}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-muted"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.32}
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              View Projects
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#contact"
              className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:bg-surface"
            >
              Contact
            </a>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-fg-subtle transition-colors hover:text-fg-muted sm:flex"
        aria-label="Scroll to About section"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.a>
    </section>
  );
}