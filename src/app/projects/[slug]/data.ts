import type { Project } from "../../../lib/data";

export type ProjectStory = {
  /** Short summary shown under the title. Falls back to project.description. */
  summary: string;
  /** Role held while building the project. */
  role?: string;
  /** Major tasks and responsibilities completed on the project. */
  tasks?: string[];
  /** Optional case study details for research-heavy projects. */
  caseStudy?: {
    paperTitle?: string;
    overview?: string;
    abstract?: string;
    tags?: string[];
    live?: string;
    teamMembers?: Array<{
      name: string;
      role: string;
      expertise?: string;
      contributions?: string;
      keyLearnings?: string;
      image?: string;
      portfolio?: string;
      linkedin?: string;
      github?: string;
    }>;
  };
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
      "A full-stack internship and document management platform that brings students, faculty, advisers, and admins into one workflow.",
    role:
      "Lead UI/UX Designer, Lead Full-Stack Developer, and Lead AI Integration Developer.",
    tasks: [
      "Planned the system design and user flows for dashboards, documents, approvals, and e-signatures.",
      "Mapped the information architecture so each role could navigate the platform clearly and efficiently.",
      "Designed and implemented the UI/UX for the web and mobile interfaces.",
      "Built full-stack document management, workflow automation, dashboards, and navigation.",
      "Developed the OpenAI API integration for summaries, chatbot features, and insights.",
      "Created the e-signature setup flow, magic-link signing flow, and PDF field placement.",
      "Helped refine the overall platform architecture for a clean, responsive experience.",
    ],
    challenge:
      "The platform needed to replace scattered manual processes with a single system for authentication, role-based dashboards, applications, document handling, approvals, task tracking, notifications, and secure e-signatures.",
    outcome:
      "The result combines responsive web and mobile interfaces, AI-powered support, secure magic-link signing, PDF field placement, and document workflows designed for day-to-day academic operations.",
    images: [],
  },
  "erp-system": {
    summary:
      "A modular ERP foundation built for business operations, role-based access, and cloud-backed file handling.",
    role: "Full-Stack Developer and UI/UX Designer.",
    tasks: [
      "Started the ERP system foundation and set up the core project structure.",
      "Designed the system flow and planned the main business workflows.",
      "Created the UI/UX design for the interface and overall navigation.",
      "Built the frontend and backend features needed for the ERP modules.",
      "Integrated cloud-backed file handling and role-based access patterns.",
    ],
    challenge:
      "The system needed to support multiple business workflows without turning into a monolith.",
    outcome:
      "The implementation focuses on database-driven workflows, access control, and storage-backed document handling.",
    images: [],
  },
  "gown-rental": {
    summary:
      "A simple storefront for browsing formal gowns and making available pieces easier to present on a limited budget.",
    role: "UI/UX Designer and Frontend Developer.",
    tasks: [
      "Started the gown rental project and set up the simple storefront structure.",
      "Designed the UI/UX for browsing formal gowns in a clean and easy-to-scan layout.",
      "Built the responsive frontend to showcase available gowns clearly.",
      "Kept the system lightweight and practical so it could be hosted on Vercel within budget.",
      "Focused the experience on display and browsing instead of a booking flow.",
    ],
    challenge:
      "The client had a limited budget and could not pay for expensive ecommerce services, while also needing a simple way to show available gowns clearly.",
    outcome:
      "The result is a lightweight Vercel-hosted storefront focused on browsing and showcasing gowns without a booking flow.",
    images: [],
  },
  helpr: {
    summary:
      "A user-centered design case study for an on-demand home service app that was developed for Lucena City residents.",
    role: "Lead UI/UX Designer.",
    tasks: [
      "Conducted user research through surveys, interviews, and usability testing.",
      "Created wireframes and high-fidelity prototypes for the service app experience.",
      "Designed the interface to connect service seekers with local providers in a clear and secure flow.",
      "Applied blockchain concepts to support security and transaction transparency in the design.",
      "Co-authored the academic paper and refined the case study based on user feedback.",
    ],
    caseStudy: {
      paperTitle:
        "Helpr: A User-Centered Design Approach for a Secure On-Demand Home Service App Using Blockchain Technology",
      overview:
        "This research project explores the development of a user-centered on-demand home service application for Lucena City residents. The study focuses on applying User-Centered Design (UCD) methodology to create a platform that connects service seekers with local providers while incorporating blockchain technology for enhanced security and transparency.",
      abstract:
        "The on-demand home service app build with a user-centered design (UCD) approach using blockchain technology is beneficial for everyone by providing a variety of services like plumbing, cleaning, electrical, carpentry, and more. This application aims to create a user-friendly and secure platform. There will be two users for this application: the service seekers and the service providers. Blockchain will be used in this application to enhance data security and guarantee transaction transparency, and the UCD approach prioritizes user needs and feedback through surveys, in-depth interviews, and usability testing.",
      tags: [
        "User-Centered Design",
        "UX Research",
        "Blockchain Technology",
        "Mobile App Design",
        "Figma Prototyping",
        "System Usability Scale",
        "Academic Research",
      ],
      live:
        "https://www.figma.com/proto/tUoxq4TePrwwkLeVzzk871/On-Demand-Home-Service-App?page-id=0%3A1&node-id=80-130&viewport=-1001%2C-302%2C0.5&t=A9oa4HRvZRaLQ1KA-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=80%3A129&show-proto-sidebar=1",
      teamMembers: [],
    },
    challenge:
      "The design needed to make local home services easier to discover while improving trust, clarity, and security for both service seekers and providers.",
    outcome:
      "The final case study presents a user-centered concept for a secure on-demand home service app, supported by research, prototyping, and usability testing.",
    images: ["/projects/cover/helpr-cover-2.png", "/projects/cover/helpr-cover.png"],
  },
  "linkod-app": {
    summary:
      "An AI-powered mobile platform that connects Filipino households with trusted barangay-verified home service providers.",
    role: "UI/UX Designer.",
    tasks: [
      "Conducted user research and identified pain points in the local service-booking experience.",
      "Designed user flows, information architecture, and intuitive booking journeys.",
      "Created wireframes, high-fidelity interfaces, and interactive prototypes in Figma.",
      "Designed an accessible mobile experience with voice-assisted interactions for PWDs and senior citizens.",
      "Collaborated with developers and stakeholders to translate user needs into a scalable, user-centered product.",
    ],
    caseStudy: {
      tags: [
        "AI-powered ID verification",
        "Multi-level verification",
        "Smart location-based matching",
        "Accessible voice-assisted booking",
        "Digital payments",
        "Ratings and reviews",
        "Community validation",
      ],
      teamMembers: [],
    },
    challenge:
      "Filipino households needed a safer and more accessible way to find trusted home service providers, with verification, matching, messaging, and booking built around inclusivity.",
    outcome:
      "The final design combines AI-powered ID verification, smart worker matching, barangay-based validation, accessible voice-assisted booking, and transparent community ratings.",
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
