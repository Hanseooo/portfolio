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
      className="fixed bottom-6 right-6 h-9 w-9 rounded-md border border-border flex items-center justify-center"
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
    </button>
  );
}
