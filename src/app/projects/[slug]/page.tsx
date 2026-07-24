import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects, siteConfig, type Project } from "../../../lib/data";

const projectStories: Record<
  string,
  {
    summary: string;
    challenge: string;
    outcome: string;
  }
> = {
  "internship-system": {
    summary:
      "An AI-assisted internship platform that centralizes document workflows, approvals, and student-facing tools in one place.",
    challenge:
      "The main goal was to reduce manual coordination across documents, signatures, and evaluation steps while keeping the experience usable for students and admins.",
    outcome:
      "The platform combines secure e-signatures, analytics, AI resume assistance, and document management into a single workflow.",
  },
  "erp-system": {
    summary:
      "A modular ERP foundation built for business operations, role-based access, and cloud-backed file handling.",
    challenge:
      "The system needed to support multiple business workflows without turning into a monolith.",
    outcome:
      "The implementation focuses on database-driven workflows, access control, and storage-backed document handling.",
  },
  "gown-rental": {
    summary:
      "A storefront for browsing formal gowns, checking availability, and moving users toward a clean booking flow.",
    challenge:
      "The interface had to present products clearly while still feeling premium and simple on mobile.",
    outcome:
      "The cover image and hover GIF highlight the browsing experience and the rental flow from a buyer's perspective.",
  },
  cobeep: {
    summary:
      "A vaccination tracking app designed to keep records organized and reminders easy to follow.",
    challenge:
      "The product needed to make health records quick to find while keeping the experience approachable for families.",
    outcome:
      "The project emphasizes digital records, reminder workflows, and family profile management.",
  },
  helpr: {
    summary:
      "A service marketplace that connects customers with trusted providers and uses blockchain for transaction history.",
    challenge:
      "The experience needed to balance booking simplicity with trust and transaction transparency.",
    outcome:
      "The build centers on provider booking, ratings, service history, and blockchain-backed transactions.",
  },
};

function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

function renderProjectImage(project: Project) {
  if (!project.coverImage) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
        >
          <circle cx="200" cy="120" r="44" fill="rgb(var(--accent) / 0.18)" />
          <circle cx="200" cy="120" r="16" fill="rgb(var(--accent))" fillOpacity="0.8" />
        </svg>
      </div>
    );
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

  const story = projectStories[project.slug] ?? {
    summary: project.description,
    challenge: "This project was built to solve a practical product problem with a clean, maintainable experience.",
    outcome: "The result is a focused build that highlights the core workflow and the technology behind it.",
  };

  return (
    <main className="section-shell py-24 sm:py-32">
      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          <ArrowLeft size={14} />
          Back to projects
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <section>
          <p className="eyebrow mb-4">Project details</p>
          <h1 className="text-display-md font-medium text-fg sm:text-display-lg">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted sm:text-base">
            {story.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
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

          <div className="mt-10 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xl font-medium text-fg">Challenge and outcome</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
              {story.challenge}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
              {story.outcome}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
            {renderProjectImage(project)}
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-lg font-medium text-fg">Key features</h2>
            <ul className="mt-4 space-y-3">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-fg-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-lg font-medium text-fg">Tech stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-fg-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}