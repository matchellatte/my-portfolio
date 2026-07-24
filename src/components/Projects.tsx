"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "../lib/data";
import ProjectCard from "./ProjectCard";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          Projects
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.05}
          className="max-w-xl text-display-sm font-medium text-fg"
        >
          Selected work.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.1}
          className="mt-4 max-w-xl text-[15px] text-fg-muted"
        >
          A mix of client-facing products and personal builds, spanning web,
          mobile, and applied AI.
        </motion.p>

        <div className="mt-16">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-8 border-t border-line pt-16">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="eyebrow mb-8"
            >
              More builds
            </motion.p>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {rest.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={0.05 + i * 0.06}
                  className="group"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex h-full flex-col bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover"
                    aria-label={`View details for ${project.name}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-fg">{project.name}</h4>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle transition-colors group-hover:text-accent">
                        View details
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
