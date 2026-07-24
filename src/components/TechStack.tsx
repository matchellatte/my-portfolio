"use client";

import { motion } from "framer-motion";
import { techStack } from "../lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function TechStack() {
  return (
    <section id="stack" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          Tech Stack
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.05}
          className="max-w-xl text-display-sm font-medium text-fg"
        >
          Tools I reach for, across the stack.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group, i) => (
            <motion.div
              key={group.category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.05 + i * 0.05}
              className="group relative bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle transition-colors duration-300 group-hover:text-accent">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line px-2.5 py-1 text-sm text-fg-muted transition-colors duration-200 group-hover:border-line-strong"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
