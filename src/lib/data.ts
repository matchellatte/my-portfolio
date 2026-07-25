export const siteConfig = {
  name: "Grechelle",
  role: "Software Engineer",
  tagline:
    "Building software with an engineer's mindset and a designer's attention to detail.",
  description:
    "Grechelle is a full-stack software developer specializing in Next.js, TypeScript, and AI-powered applications — bridging product thinking, engineering, and intelligent automation.",
  url: "https://grechelleboneo.com",
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
      "A full-stack internship and document management platform with AI support, role-based dashboards, document workflows, and secure e-signatures.",
    technologies: ["TypeScript", "C#", "ASP.NET Core", "OpenAI API"],
    features: [
      "AI-powered chatbot support",
      "Evaluation summaries and insights",
      "Role-based dashboards",
      "Secure magic-link e-signatures",
      "Document upload, review, and approval",
      "Task and internship tracking",
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
      "A simple storefront for browsing formal gowns and showcasing available pieces on a limited budget.",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    features: [
      "Product catalog",
      "Available gowns display",
      "Responsive browsing UI",
      "Lightweight Vercel deployment",
    ],
    coverImage: "/projects/cover/gown-rental-cover.png",
    hoverImage: "/projects/hover/gown-rental.gif",
    liveUrl: "https://jielas-gown-rental.vercel.app",
    featured: true,
  },
  {
    slug: "helpr",
    name: "Helpr",
    description:
      "A user-centered design case study for an on-demand home service app using blockchain technology.",
    technologies: ["Figma", "UX Research", "User-Centered Design", "Blockchain"],
    features: [
      "User research and usability testing",
      "High-fidelity UI/UX prototyping",
      "Blockchain-focused security and transparency",
      "Academic case study presentation",
    ],
    coverImage: "/projects/cover/helpr-cover.png",
    hoverImage: "/projects/hover/helpr-web.png",
    liveUrl:
      "https://www.figma.com/proto/tUoxq4TePrwwkLeVzzk871/On-Demand-Home-Service-App?page-id=0%3A1&node-id=80-130&viewport=-1001%2C-302%2C0.5&t=A9oa4HRvZRaLQ1KA-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=80%3A129&show-proto-sidebar=1",
    featured: false,
  },
  {
    slug: "linkod-app",
    name: "Linkod App",
    description:
      "An AI-powered mobile platform that connects Filipino households with trusted barangay-verified home service providers.",
    technologies: ["Figma", "UX Research", "User-Centered Design", "Mobile UI/UX"],
    features: [
      "AI-powered ID verification and fraud detection",
      "Multi-level verification for system, barangay, and PWD users",
      "Smart location-based service matching",
      "Real-time in-app messaging",
      "Secure digital payments with GCash and Maya",
      "Ratings and reviews for trust and reliability",
      "Voice-assisted booking for accessibility",
      "Reward points for active users",
    ],
    coverImage: "/projects/cover/linkod-cover.png",
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
