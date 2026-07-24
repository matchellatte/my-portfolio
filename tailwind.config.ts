import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All of these read from CSS variables defined in globals.css.
        // Changing the whole site's palette — including switching the
        // accent color, or retuning light/dark mode — is a one-place edit
        // in the `:root` / `.dark` blocks there. Nothing here needs to change.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          muted: "rgb(var(--accent) / 0.12)",
          soft: "rgb(var(--accent) / 0.06)",
        },
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          hover: "rgb(var(--surface-hover) / <alpha-value>)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          subtle: "rgb(var(--fg-subtle) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["4.25rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        prose: "42rem",
        content: "72rem",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "trace-x": {
          "0%": { transform: "translateX(-10%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(110%)", opacity: "0" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "trace-x": "trace-x 8s ease-in-out infinite",
        blink: "blink 1.1s step-end infinite",
      },
      transitionTimingFunction: {
        expensive: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
