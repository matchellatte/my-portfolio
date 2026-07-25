"use client";

import { motion } from "framer-motion";
import AboutComposition from "./AboutComposition";

const journey = [
  {
    label: "Design",
    detail: "Started in UI/UX with Figma — layouts, user flows, intuitive interfaces.",
  },
  {
    label: "Development",
    detail: "Got curious how it all worked, learned to build it myself — full-stack, APIs, databases.",
  },
  {
    label: "AI Engineering",
    detail: "Now integrating LLMs and intelligent automation into real products.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  return (
    <section id="about" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          About
        </motion.p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-prose">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={0.05}
              className="text-display-sm font-medium text-fg"
            >
              From design to engineering.
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={0.1}
              className="mt-6 text-[15px] leading-relaxed text-fg-muted"
            >
              I'm Grechelle, a full-stack software engineer who started out
              designing interfaces — and got curious enough about how they
              worked to start building them too.
            </motion.p>

            {/* Scannable journey — replaces the old wall-of-text paragraphs */}
            <div className="mt-10 space-y-0">
              {journey.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                  custom={0.16 + i * 0.08}
                  className="group flex gap-4 border-t border-line py-5 first:border-t-0 sm:gap-6"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-fg-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-fg">
                      {step.label}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted">
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={0.4}
              className="mt-8 text-[15px] leading-relaxed text-fg-muted"
            >
              I enjoy solving meaningful problems, learning continuously, and
              working with teams that care about clean engineering and real
              impact.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center lg:pt-6"
          >
            <AboutComposition />
          </motion.div>
        </div>
      </div>
    </section>
  );
}