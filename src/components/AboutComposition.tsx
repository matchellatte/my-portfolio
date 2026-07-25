"use client";

import { motion } from "framer-motion";
import { useCallback, useRef } from "react";

// A loosely "typed" arrangement — not a literal QWERTY layout, just enough
// keyboard-ness to read clearly, staggered like real rows.
const ROWS: string[][] = [
  ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
  ["1", "2", "3", "4", "5", "6", "7"],
  ["1", "Q", "W", "E", "R", "T", "Y"],
  ["A", "S", "D", "F", "G", "H", "J"],
  ["Z", "X", "{", "}", "C", "V", "B"],
  ["<", "/", ">", "*", "-", "+", "="],
  ["⌘", "⇧", "⌥", "esc", "fn", "␣", "↵"],
];

interface AboutCompositionProps {
  // Path to a short click sound, served from /public — e.g. a file at
  // public/sounds/key-click.mp3 would be "/sounds/key-click.mp3".
  soundUrl?: string;
  soundVolume?: number;
}

export default function AboutComposition({
  soundUrl = "/sounds/key-click-3.mp3",
  soundVolume = 0.5,
}: AboutCompositionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef("");
  const lastTickRef = useRef(0);

  // Same pattern as OptionWheel's playTick: reuse one <audio> element,
  // rebuild it only if the soundUrl changes, throttle so fast hovers
  // across keys can't overlap/spam playback, and swallow autoplay
  // rejections instead of throwing.
  const playClick = useCallback((): void => {
    if (!soundUrl) return;

    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;

    if (!audioRef.current || audioUrlRef.current !== soundUrl) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.preload = "auto";
      audioUrlRef.current = soundUrl;
    }

    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(soundVolume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, [soundUrl, soundVolume]);

  return (
    <div className="relative flex w-[300px] flex-col items-center gap-5 sm:w-[360px]">
      {/* Corner brackets — frames the piece like a design artboard, a
          quiet nod to the Figma-first part of the journey. */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-3.5 w-3.5 border-l border-t border-line" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 border-r border-t border-line" />
      <span className="pointer-events-none absolute -left-1 -bottom-1 h-3.5 w-3.5 border-b border-l border-line" />
      <span className="pointer-events-none absolute -right-1 -bottom-1 h-3.5 w-3.5 border-b border-r border-line" />

      {/* Top: status label with a slow pulsing dot */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-fg-subtle"
        />
        
      </div>

      {/* Keyboard grid, faded to a square via the mask */}
      <div
        className="flex h-[300px] w-full select-none items-center justify-center sm:h-[360px]"
        style={{
          maskImage: `
            linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)
          `,
          maskComposite: "intersect",
          WebkitMaskImage: `
            linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)
          `,
          WebkitMaskComposite: "source-in",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {ROWS.map((row, ri) => (
            <div
              key={ri}
              className="flex gap-2"
              style={{ marginLeft: ri % 2 === 1 ? 10 : 0 }}
            >
              {row.map((label, ki) => (
                <motion.div
                  key={`${ri}-${ki}`}
                  onHoverStart={playClick}
                  initial={{ y: 0, scale: 1 }}
                  whileHover={{ y: 3, scale: 0.94 }}
                  transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-9 min-w-9 shrink-0 cursor-default items-center justify-center whitespace-nowrap rounded-md border border-line px-1.5 font-mono text-[10px] text-fg-subtle shadow-[0_2px_0_rgba(0,0,0,0.08)] transition-colors duration-150 hover:border-fg-subtle hover:text-fg hover:shadow-none sm:h-10 sm:min-w-10 sm:text-[11px]"
                >
                  {label}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: terminal-style prompt with a blinking cursor */}
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-subtle">
        <span>grechelle@dev ~ %</span>
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block h-3 w-[6px] bg-fg-subtle"
        />
      </div>
    </div>
  );
}