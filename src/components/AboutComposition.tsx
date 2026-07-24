"use client";

import { motion } from "framer-motion";

/**
 * Abstract geometric mark: a wireframe artboard (design) resolving into
 * a bracketed code block (engineering) along a single connecting line —
 * a visual metaphor for the Figma-to-full-stack path described in About.
 *
 * Uses `currentColor` + per-element opacity for the neutral linework (so it
 * adapts automatically to light/dark via the wrapping `text-fg` class) and
 * `rgb(var(--accent))` for the two accent touches — both follow the same
 * theme variables as the rest of the site.
 */
export default function AboutComposition() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm text-fg">
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect x="0.5" y="0.5" width="319" height="319" rx="7.5" stroke="currentColor" opacity="0.08" />

        {/* Design artboard, top-left */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="40" y="44" width="120" height="84" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.16" />
          <line x1="40" y1="66" x2="160" y2="66" stroke="currentColor" strokeWidth="1" opacity="0.12" />
          <circle cx="50" cy="55" r="2.5" fill="currentColor" opacity="0.2" />
          <circle cx="60" cy="55" r="2.5" fill="currentColor" opacity="0.2" />
          <circle cx="70" cy="55" r="2.5" fill="currentColor" opacity="0.2" />
          <rect x="52" y="78" width="40" height="28" rx="2" stroke="rgb(var(--accent))" strokeWidth="1" opacity="0.55" />
          <line x1="100" y1="80" x2="148" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.14" />
          <line x1="100" y1="88" x2="140" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          <line x1="100" y1="96" x2="144" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        </motion.g>

        {/* Connecting path */}
        <motion.path
          d="M110 128 C 110 180, 210 140, 210 196"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.14"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.14 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />

        {/* Engineering block, bottom-right */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <rect x="160" y="196" width="120" height="80" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.16" />
          <text
            x="176"
            y="222"
            fill="rgb(var(--accent))"
            opacity="0.85"
            fontSize="13"
            fontFamily="var(--font-geist-mono)"
          >
            {"{"}
          </text>
          <line x1="192" y1="216" x2="240" y2="216" stroke="currentColor" strokeWidth="1" opacity="0.14" />
          <line x1="192" y1="228" x2="256" y2="228" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          <line x1="192" y1="240" x2="232" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          <text
            x="176"
            y="260"
            fill="rgb(var(--accent))"
            opacity="0.85"
            fontSize="13"
            fontFamily="var(--font-geist-mono)"
          >
            {"}"}
          </text>
        </motion.g>

        {/* Node markers */}
        <circle cx="110" cy="128" r="3" fill="rgb(var(--accent))" />
        <circle cx="210" cy="196" r="3" fill="rgb(var(--accent))" />
      </svg>
    </div>
  );
}
