"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "../lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          Contact
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.05}
          className="max-w-2xl text-display-sm font-medium text-fg sm:text-display-md"
        >
          Let&rsquo;s build something meaningful.
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.1}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-fg-muted"
        >
          Open to full-stack and AI-integration roles, freelance builds, and
          conversations about interesting problems. I usually reply within a
          day or two.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.16}
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3"
        >
          <button
            onClick={copyEmail}
            className="group flex items-center justify-between gap-3 bg-surface p-6 text-left transition-colors duration-300 hover:bg-surface-hover"
          >
            <span className="flex items-center gap-3">
              <Mail size={16} className="text-fg-subtle group-hover:text-accent" />
              <span>
                <span className="block text-sm font-medium text-fg">
                  Email
                </span>
                <span className="mt-0.5 block font-mono text-xs text-fg-subtle">
                  {siteConfig.email}
                </span>
              </span>
            </span>
            {copied ? (
              <Check size={15} className="text-accent" />
            ) : (
              <Copy size={15} className="text-fg-subtle group-hover:text-fg-muted" />
            )}
          </button>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover"
          >
            <span className="flex items-center gap-3">
              <Github size={16} className="text-fg-subtle group-hover:text-accent" />
              <span>
                <span className="block text-sm font-medium text-fg">
                  GitHub
                </span>
                <span className="mt-0.5 block font-mono text-xs text-fg-subtle">
                  @matchellatte
                </span>
              </span>
            </span>
            <ArrowUpRight
              size={15}
              className="text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg-muted"
            />
          </a>

          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover"
          >
            <span className="flex items-center gap-3">
              <Linkedin size={16} className="text-fg-subtle group-hover:text-accent" />
              <span>
                <span className="block text-sm font-medium text-fg">
                  LinkedIn
                </span>
                <span className="mt-0.5 block font-mono text-xs text-fg-subtle">
                  Grechelle Ann Boneo
                </span>
              </span>
            </span>
            <ArrowUpRight
              size={15}
              className="text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg-muted"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
