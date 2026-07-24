import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects, siteConfig, type Project } from "../../../lib/data";
import { getProjectImages, getProjectStory } from "./data";
import { ProjectGallery } from "./project-gallery";

function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);

  if (!project) {
    return {};
  }

  const canonical = `/projects/${project.slug}`;
  const imageUrl = project.coverImage ?? "/opengraph-image";

  return {
    title: `${project.name} — Projects`,
    description: project.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}${canonical}`,
      title: `${project.name} — ${siteConfig.name}`,
      description: project.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} — ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${siteConfig.name}`,
      description: project.description,
      images: [imageUrl],
    },
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const story = getProjectStory(project);
  const images = getProjectImages(project);

  return (
    <main className="section-shell py-24 sm:py-32">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={14} />
        Back to projects
      </Link>

      {/* Hero */}
      <div className="mt-8 flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3">Project details</p>
          <h1 className="text-display-md font-medium text-fg sm:text-display-lg">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted sm:text-base">
            {story.summary}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Live demo
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
              className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-4 py-2 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-surface"
            >
              <Github size={14} />
              GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-4 py-2 text-sm font-medium text-fg-subtle">
              <Github size={14} />
              Private repository
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="lg:order-2">
          <ProjectGallery images={images} name={project.name} />
        </div>

        <div className="space-y-10 lg:order-1">
          <section>
            <h2 className="text-lg font-medium text-fg">Challenge</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
              {story.challenge}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-fg">Outcome</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
              {story.outcome}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-fg">Key features</h2>
            <ul className="mt-3 space-y-2.5">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-fg-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-fg">Tech stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-fg-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}