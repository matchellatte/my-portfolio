export const siteConfig = {
  name: "Grechelle",
  role: "Software Engineer",
  tagline:
    "Building software with an engineer's mindset and a designer's attention to detail.",
  description:
    "Grechelle is a full-stack software developer specializing in Next.js, TypeScript, and AI-powered applications — bridging product thinking, engineering, and intelligent automation.",
  url: "https://grechelle.dev",
  email: "grechelleab@gmail.com",
  github: "https://github.com/matchellatte",
  linkedin: "https://www.linkedin.com/in/grechelle-ann-boneo/",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Tech Events", href: "#tech-events" },
  { label: "Contact", href: "#contact" },
] as const;

export type TechCategory = {
  category: string;
  items: string[];
};

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["ASP.NET Core", "Node.js", "Express"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MS SQL Server", "Neon", "MongoDB", "Prisma ORM"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS S3", "Docker", "Vercel", "Git", "GitHub"],
  },
  {
    category: "AI",
    items: ["OpenAI", "Anthropic", "LLM Integration"],
  },
  {
    category: "Design",
    items: ["Figma", "UI/UX Design"],
  },
];

export type Project = {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  coverImage?: string;
  hoverImage?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "internship-system",
    name: "Internship System",
    description:
      "AI-assisted internship management system with secure e-signatures, analytics, resume building, and document handling.",
    technologies: ["TypeScript", "C#", "ASP.NET Core", "OpenAI API"],
    features: [
      "Secure e-signatures",
      "Data analytics with AI",
      "AI resume builder & Chatbot",
      "Document management",
    ],
    coverImage: "/projects/cover/internship-cover.png",
    liveUrl: "https://unitern.vercel.app/student/login",
    featured: true,
  },
  {
    slug: "erp-system",
    name: "Enterprise Resource Planning",
    description:
      "Comprehensive ERP system for managing business operations and workflows.",
    technologies: ["Next.js", "React", "TypeScript", "AWS S3", "Neon", "Prisma ORM"],
    features: [
      "Modular architecture",
      "Role-based authentication",
      "Cloud file storage",
      "Database-driven workflows",
    ],
    featured: true,
  },
  {
    slug: "gown-rental",
    name: "Gown Rental",
    description:
      "E-commerce platform for browsing and renting formal gowns.",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    features: ["Product catalog", "Availability calendar", "Booking flow", "Customer accounts"],
    coverImage: "/projects/cover/gown-rental-cover.png",
    hoverImage: "/projects/hover/gown-rental.gif",
    liveUrl: "https://jielas-gown-rental.vercel.app",
    featured: true,
  },
  {
    slug: "cobeep",
    name: "Cobeep",
    description: "Vaccination tracker application.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "JWT"],
    features: [
      "Digital vaccination records",
      "Automated reminders",
      "Family profiles",
      "Schedule tracking",
    ],
    featured: false,
  },
  {
    slug: "helpr",
    name: "Helpr",
    description:
      "Home service application connecting customers with trusted providers using blockchain.",
    technologies: ["React Native", "Node.js", "Blockchain", "MongoDB"],
    features: [
      "Provider booking",
      "Blockchain transactions",
      "Ratings & reviews",
      "Service history",
    ],
    featured: false,
  },
];

export type ExperienceItem = {
  role: string;
  org?: string;
  period: string;
  description: string;
  location?: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Full Stack Software Developer Intern",
    period: "Jan 2026 - May 2026",
    description:
      "Built enterprise web applications using Next.js and TypeScript while collaborating on backend development, database design, cloud storage integration, QA documentation, and UI/UX improvements.",
    location: "Hybrid",
      highlights: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "AWS S3",
      "UI/UX",
      "Documentation",
      "Agile",
    ],
  },
    {
    role: "Web Developer",
    org: "Freelance",
    location: "Remote",
    period: "Jan 2024 - Jan 2026",
    description:
      "Built responsive websites and web applications for freelance clients, translating design requirements into polished production-ready interfaces.",
    highlights: ["Next.js", "TypeScript", "Responsive UI", "Frontend Development"],
  },
    {
    role: "UI/UX Designer",
    org: "Freelance",
    location: "Remote",
    period: "Mar 2021 - Jan 2026",
    description:
      "Designed user-focused interfaces and polished digital experiences for freelance clients across web and mobile projects.",
    highlights: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
  },
];
