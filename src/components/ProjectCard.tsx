"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "../lib/data";

function CoverPlaceholder({ seed }: { seed: string }) {
  // Deterministic pseudo-random pattern per project so each cover feels distinct
  // without using stock photography or illustration.
  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const lines = Array.from({ length: 5 }, (_, i) => {
    const offset = ((hash * (i + 3)) % 60) - 30;
    return offset;
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:28px_28px]"
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
      >
        {lines.map((offset, i) => (
          <line
            key={i}
            x1={0}
            y1={40 + i * 40 + offset * 0.3}
            x2={400}
            y2={40 + i * 40 - offset * 0.3}
            stroke="rgb(var(--accent) / 0.18)"
            strokeWidth="1"
          />
        ))}
        <circle
          cx={80 + (hash % 240)}
          cy={120}
          r="3"
          fill="rgb(var(--accent))"
          fillOpacity="0.7"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
    </div>
  );
}

function ProjectMedia({
  project,
}: {
  project: Project;
}) {
  if (!project.coverImage) {
    return <CoverPlaceholder seed={project.slug} />;
  }

  return (
    <div className="group relative h-full w-full overflow-hidden bg-surface">
      <Image
        src={project.coverImage}
        alt={`${project.name} cover image`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={`object-cover transition-opacity duration-500 ${
          project.hoverImage ? "group-hover:opacity-0" : "opacity-100"
        }`}
      />

      {project.hoverImage ? (
        <Image
          src={project.hoverImage}
          alt={`${project.name} hover preview`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reversed = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-1 gap-8 border-b border-line py-14 first:pt-0 last:border-b-0 lg:grid-cols-2 lg:gap-16"
    >
      <div className={reversed ? "lg:order-2" : ""}>
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`View details for ${project.name}`}
          className="relative z-10 block aspect-[16/10] overflow-hidden rounded-lg border border-line transition-colors duration-300 group-hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ProjectMedia project={project} />
        </Link>
      </div>

      <div className={`relative z-10 flex flex-col justify-center ${reversed ? "lg:order-1" : ""}`}>
        <span className="font-mono text-xs text-fg-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-2xl font-medium text-fg">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
          {project.description}
        </p>

        <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-fg-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-fg-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Live Demo
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-line-strong px-4 py-2 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-surface"
            >
              <Github size={14} />
              GitHub
            </a>
          ) : (
            <span className="flex items-center gap-1.5 rounded-md border border-line px-4 py-2 text-sm font-medium text-fg-subtle">
              <Github size={14} />
              Private repository
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
