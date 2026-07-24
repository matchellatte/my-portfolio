"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readThemeFromDom(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage can throw in private-browsing / disabled-storage contexts;
    // the toggle still works for the current page load, just isn't persisted.
  }
}

/**
 * Wraps the app once (in the root layout) so every ThemeToggle instance —
 * desktop nav, mobile drawer, anywhere else — shares one source of truth
 * instead of drifting out of sync with each other.
 *
 * The initial render always assumes "dark" to match the server-rendered
 * HTML (see the blocking script in layout.tsx, which sets the real class
 * before paint). This effect immediately corrects it from the DOM, so any
 * mismatch is invisible — a single, imperceptible frame at most.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readThemeFromDom());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
