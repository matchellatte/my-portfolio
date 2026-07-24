"use client";

import { motion } from "framer-motion";
import { experience } from "../lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Experience() {
  return (
    <section id="experience" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          Experience
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.05}
          className="max-w-xl text-display-sm font-medium text-fg"
        >
          Where I&apos;ve worked.
        </motion.h2>

        <div className="relative mt-16 max-w-2xl">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[5px] top-2 w-px bg-line"
          />
          <ol className="space-y-12">
            {experience.map((item, i) => (
              <motion.li
                key={item.role + item.period}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                custom={0.05 + i * 0.08}
                className="relative pl-8"
              >
                <span className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-medium text-fg">
                    {item.role}
                  </h3>
                  <span className="font-mono text-xs text-fg-subtle">
                    {item.period}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
