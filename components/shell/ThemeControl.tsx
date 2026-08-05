"use client";

import { useTheme } from "next-themes";
import { useClientReady } from "@/components/utils/useClientReady";

/**
 * Theme toggle within the navigation bar.
 * Square shape indicator with text beside it ("LIGHT" / "DARK").
 */
export function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  const ready = useClientReady();

  // Render placeholder to avoid layout shift before hydration
  if (!ready) {
    return (
      <div
        className="flex h-11 items-center gap-2 px-2"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 items-center gap-2 px-2.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 border border-current ${
          isDark ? "bg-[color:var(--cs-signal)] border-[color:var(--cs-signal)]" : "bg-current"
        }`}
        aria-hidden="true"
      />
      <span>{isDark ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
