"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { techStack } from "../lib/data";
import { getTechIcon } from "../lib/techIcons";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const allTools: string[] = Array.from(
  new Set(techStack.flatMap((group) => group.items))
);

const marqueeTools = allTools.filter((tool) => getTechIcon(tool));
const minIconsPerCycle = 12;
const cycleRepeatCount = marqueeTools.length
  ? Math.max(1, Math.ceil(minIconsPerCycle / marqueeTools.length))
  : 0;
const cycleTools = Array.from({ length: cycleRepeatCount }, () => marqueeTools).flat();

export default function TechStack() {
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      widthRef.current = (contentRef.current?.scrollWidth ?? 0) / 2;
      if (widthRef.current > 0) {
        setOffset((current) => current % widthRef.current);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();

    const step = (time: number) => {
      const elapsed = time - lastTime;
      lastTime = time;

      if (!paused && widthRef.current > 0) {
        setOffset((current) => {
          const next = current + elapsed * 0.050;
          return next >= widthRef.current ? next - widthRef.current : next;
        });
      }

      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [paused]);

  return (
    <section id="stack" className="hairline py-24 sm:py-32">
      <div className="section-shell">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="eyebrow mb-4"
        >
          Tech Stack
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0.05}
          className="max-w-xl text-display-sm font-medium text-fg"
        >
          Tools I reach for, across the stack.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group, i) => (
            <motion.div
              key={group.category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.05 + i * 0.05}
              className="group relative bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle transition-colors duration-300 group-hover:text-accent">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line px-2.5 py-1 text-sm text-fg-muted transition-colors duration-200 group-hover:border-line-strong"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={0.15}
          className="relative mt-10 overflow-hidden rounded-lg py-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />

          <div
            ref={trackRef}
            className="relative w-full overflow-hidden"
          >
            <div
              ref={contentRef}
              className="flex w-max min-w-max gap-0"
              style={{ transform: `translate3d(-${offset}px, 0, 0)` }}
            >
              {[0, 1].map((loopIndex) => (
                <div
                  key={loopIndex}
                  className="flex shrink-0 items-center gap-10 py-2 pr-4 sm:gap-12 sm:pr-5"
                >
                  {cycleTools.map((tool, toolIndex) => {
                    const Icon = getTechIcon(tool);
                    if (!Icon) {
                      return null;
                    }

                    return (
                      <div
                        key={`${loopIndex}-${tool}-${toolIndex}`}
                        className="group flex shrink-0 items-center justify-center p-1.5 text-fg-subtle transition-colors duration-200"
                        title={tool}
                      >
                        <Icon
                          size={40}
                          aria-hidden="true"
                          className="origin-center transition-all duration-200 group-hover:scale-110"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
