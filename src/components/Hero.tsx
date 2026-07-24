"use client";

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

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* Signature background: hairline grid + traveling trace */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mask-fade-b bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:64px_64px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(var(--accent)/0.15),transparent)]"
      />
      <div className="absolute left-0 top-[38%] h-px w-full overflow-hidden" aria-hidden="true">
        <div className="h-px w-1/3 animate-trace-x bg-gradient-to-r from-transparent via-accent to-transparent" />
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
            Available for select opportunities
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
