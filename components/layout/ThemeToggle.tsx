"use client";

import { useTheme } from "next-themes";
import { useClientReady } from "@/components/utils/useClientReady";

export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const isClient = useClientReady();

  if (!isClient) return null;

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 items-center gap-2.5 border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] px-3.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] shadow-lg backdrop-blur transition-all hover:border-[color:var(--cs-signal)] hover:text-[color:var(--cs-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
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
