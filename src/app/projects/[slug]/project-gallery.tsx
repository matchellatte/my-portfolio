"use client";

import { useState } from "react";
import Image from "next/image";

function EmptyGalleryState() {
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

export function ProjectGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const currentImage = images[active] ?? images[0]!;

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-line">
        <EmptyGalleryState />
      </div>
    );
  }

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          key={currentImage}
          src={currentImage}
          alt={`${name} screenshot ${active + 1}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
          priority={active === 0}
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${name} screenshot ${index + 1}`}
              aria-current={index === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))] ${
                index === active
                  ? "border-[rgb(var(--accent))]"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className={`object-cover transition-opacity duration-200 ${
                  index === active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}