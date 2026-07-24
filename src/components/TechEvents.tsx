"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "../lib/data";

const techEvents: Array<{
  title: string;
  subtitle: string;
  meta: string;
  image: string;
  proofUrl?: string;
  proofLabel?: string;
}> = [
  {
    title: "Google DevFest",
    subtitle: "Community-driven talks and workshops",
    meta: "Developer conference",
    image: "/tech-events/google-devfest.jpg",
    proofUrl:
      "https://gdg.community.dev/events/details/google-gdg-manila-presents-gdg-devfest-manila-2023/",
    proofLabel: "View source",
  },
  {
    title: "WordCamp Asia",
    subtitle: "WordPress and web community sessions",
    meta: "Global creator summit",
    image: "/tech-events/wordcamp-asia.jpg",
    proofUrl: "https://asia.wordcamp.org/2025/",
    proofLabel: "View source",
  },
  {
    title: "DICT Startup",
    subtitle: "Founders, ideas, and early-stage energy",
    meta: "Startup community event",
    image: "/tech-events/startup-challenge.png",
    proofUrl: "https://mseuf.edu.ph/news/2025/11/7/psc-x",
    proofLabel: "View source",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

function EventImageCard({
  src,
  alt,
  title,
  subtitle,
  meta,
  proofUrl,
  proofLabel,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  meta: string;
  proofUrl?: string;
  proofLabel?: string;
}) {
  const Wrapper = proofUrl ? "a" : "div";
  const wrapperProps = proofUrl
    ? {
        href: proofUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${title} — ${proofLabel ?? "view source"}`,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_18px_40px_rgba(194,66,125,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-hover focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 22rem, (min-width: 768px) 18rem, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Link affordance lives on the image as a corner badge, not a floating pill below the copy */}
        {proofUrl && (
          <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface/90 text-fg backdrop-blur-sm transition-all duration-300 group-hover:border-accent/40 group-hover:bg-surface group-hover:text-accent">
            <ArrowUpRight size={14} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5 text-left sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          {meta}
        </p>
        <h4 className="text-base font-medium text-fg sm:text-lg">{title}</h4>
        <p className="text-sm leading-relaxed text-fg-muted">{subtitle}</p>

        {proofUrl && (
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-fg-subtle transition-colors group-hover:text-accent">
            {proofLabel ?? "View source"}
            <ArrowUpRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        )}
      </div>
    </Wrapper>
  );
}

export default function TechEvents() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech events and startup community appearances",
    description:
      "A curated set of developer conferences and startup community events that shaped Grechelle's work.",
    url: siteConfig.url,
    itemListElement: techEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        description: `${event.meta}. ${event.subtitle}`,
        ...(event.proofUrl ? { url: event.proofUrl } : {}),
      },
    })),
  };

  return (
    <motion.section
      id="tech-events"
      aria-labelledby="tech-events-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      custom={0.08}
      className="hairline mt-24 py-24 sm:mt-28 sm:py-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="section-shell">
        <div className="max-w-2xl">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="eyebrow mb-4"
          >
            Tech Events
          </motion.p>
          <motion.h2
            id="tech-events-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0.05}
            className="text-display-sm font-medium text-fg"
          >
            Some of the spaces I&apos;ve been part of.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0.1}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted"
          >
            A small set of conferences and startup spaces that shaped how I
            think about design, development, and product communities.
          </motion.p>
        </div>

        {/* Bento row: all three sit together from tablet up, only stacking on phones */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 xl:gap-8">
          {techEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={0.14 + index * 0.06}
            >
              <EventImageCard
                src={event.image}
                alt={`${event.title} event photo`}
                title={event.title}
                subtitle={event.subtitle}
                meta={event.meta}
                proofUrl={event.proofUrl}
                proofLabel={event.proofLabel}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}