"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { useClientReady } from "@/components/utils/useClientReady";

/**
 * Theme toggle within the navigation bar.
 * Square shape indicator with text beside it ("LIGHT" / "DARK").
 * The new theme grows out of the toggle as a circle (View Transitions API);
 * reduced motion, webviews and unsupported browsers switch instantly.
 */
export function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  const { tier } = useCapability();
  const ready = useClientReady();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    const button = buttonRef.current;
    if (
      !button ||
      typeof document.startViewTransition !== "function" ||
      tier === "reduced-motion" ||
      tier === "webview-constrained"
    ) {
      setTheme(next);
      return;
    }

    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // next-themes applies the class in an effect; flushSync commits it before
    // the browser captures the new snapshot.
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      // A second click before this one finishes skips the transition.
      .catch(() => {});
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
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
