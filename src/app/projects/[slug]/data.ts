import type { Project } from "../../../lib/data";

export type ProjectStory = {
  /** Short summary shown under the title. Falls back to project.description. */
  summary: string;
  /** What problem the project was solving. */
  challenge: string;
  /** How it was solved / what shipped. */
  outcome: string;
  /**
   * Gallery images for this project, in display order.
   * Add as many as you want — e.g. "/projects/internship-system/01.png".
   * The first image is the main/large one; the rest become thumbnails.
   * If left empty, the gallery falls back to project.coverImage + project.hoverImage.
   */
  images?: string[];
};

export const projectStories: Record<string, ProjectStory> = {
  "internship-system": {
    summary:
      "An AI-assisted internship platform that centralizes document workflows, approvals, and student-facing tools in one place.",
    challenge:
      "The main goal was to reduce manual coordination across documents, signatures, and evaluation steps while keeping the experience usable for students and admins.",
    outcome:
      "The platform combines secure e-signatures, analytics, AI resume assistance, and document management into a single workflow.",
    images: [
      // "/projects/internship-system/cover.png",
      // "/projects/internship-system/dashboard.png",
      // "/projects/internship-system/signatures.png",
    ],
  },
  "erp-system": {
    summary:
      "A modular ERP foundation built for business operations, role-based access, and cloud-backed file handling.",
    challenge:
      "The system needed to support multiple business workflows without turning into a monolith.",
    outcome:
      "The implementation focuses on database-driven workflows, access control, and storage-backed document handling.",
    images: [],
  },
  "gown-rental": {
    summary:
      "A storefront for browsing formal gowns, checking availability, and moving users toward a clean booking flow.",
    challenge:
      "The interface had to present products clearly while still feeling premium and simple on mobile.",
    outcome:
      "The cover image and hover preview highlight the browsing experience and the rental flow from a buyer's perspective.",
    images: [],
  },
  cobeep: {
    summary:
      "A vaccination tracking app designed to keep records organized and reminders easy to follow.",
    challenge:
      "The product needed to make health records quick to find while keeping the experience approachable for families.",
    outcome:
      "The project emphasizes digital records, reminder workflows, and family profile management.",
    images: [],
  },
  helpr: {
    summary:
      "A service marketplace that connects customers with trusted providers and uses blockchain for transaction history.",
    challenge:
      "The experience needed to balance booking simplicity with trust and transaction transparency.",
    outcome:
      "The build centers on provider booking, ratings, service history, and blockchain-backed transactions.",
    images: [],
  },
};

const defaultStory = (project: Project): ProjectStory => ({
  summary: project.description,
  challenge:
    "This project was built to solve a practical product problem with a clean, maintainable experience.",
  outcome:
    "The result is a focused build that highlights the core workflow and the technology behind it.",
  images: [],
});

export function getProjectStory(project: Project): ProjectStory {
  return projectStories[project.slug] ?? defaultStory(project);
}

/** Resolves the gallery images to show, with a fallback to cover/hover images. */
export function getProjectImages(project: Project): string[] {
  const story = projectStories[project.slug];
  const gallery = story?.images?.filter(Boolean) ?? [];

  if (gallery.length > 0) {
    return gallery;
  }

  return [project.coverImage, project.hoverImage].filter(
    (src): src is string => Boolean(src)
  );
}