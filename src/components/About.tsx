"use client";

import { motion } from "framer-motion";
import AboutComposition from "./AboutComposition";

const paragraphs = [
  "Hi, I'm Grechelle. I started my journey in tech with UI/UX design using Figma, focusing on layouts, user flows, and creating interfaces that are intuitive and easy to use. While designing, I became curious about how those interfaces actually worked behind the scenes, which led me to learn web development and eventually build the applications myself.",
  "That transition from design to development changed how I approach technology. I began building full-stack web applications, working across frontend and backend, designing databases, developing APIs, and solving real-world problems through software. Along the way, I discovered that I enjoy the engineering side of development the most — thinking through system architecture, writing maintainable code, and building solutions that are scalable and reliable.",
  "Today, I'm focused on growing as a full-stack software engineer while expanding into AI-powered applications. I'm particularly interested in integrating large language models (LLMs), intelligent automation, and modern AI technologies into real-world products, combining strong software engineering principles with practical AI solutions.",
  "I enjoy solving meaningful problems, continuously learning new technologies, and collaborating with teams that value clean engineering, thoughtful design, and building products that create real impact.",
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

            <div className="mt-8 space-y-5">
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                  custom={0.1 + i * 0.06}
                  className="text-[15px] leading-relaxed text-fg-muted"
                >
                  {p}
                </motion.p>
              ))}
            </div>
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
