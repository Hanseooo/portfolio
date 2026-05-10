"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useClientReady } from "@/components/utils/useClientReady";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useClientReady();

  if (!isClient) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background/85 text-foreground backdrop-blur transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
    </button>
  );
}
