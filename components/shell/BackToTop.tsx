"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { backToTopShown } from "@/lib/back-to-top";

/** Scroll movement smaller than this keeps the current direction (trackpad jitter). */
const DIRECTION_SLOP_PX = 8;

/**
 * Back-to-top control, bottom right: a small hairline circle with an arrow. Shows and hides by
 * `backToTopShown`, so it never sits on the text being read. Scrolls home (instantly under
 * reduced motion) and moves focus to the top of main content so the next Tab starts there.
 */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const lastY = useRef(0);
  const { scrollToPosition } = useScrollEnhancement();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < DIRECTION_SLOP_PX) return;
      lastY.current = y;
      setShown(
        backToTopShown({ y, delta, viewport: window.innerHeight, pageHeight: document.documentElement.scrollHeight })
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      inert={!shown}
      onClick={() => {
        scrollToPosition(0, reducedMotion);
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }}
      className={`group fixed right-[var(--cs-gutter-portfolio)] bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex size-11 items-center justify-center transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] motion-reduce:transition-none md:bottom-5 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span className="flex size-9 items-center justify-center rounded-full border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-foundation)] text-[color:var(--cs-text-secondary)] transition-colors group-hover:text-[color:var(--cs-text-primary)]">
        <ArrowUp size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-px motion-reduce:transition-none" />
      </span>
    </button>
  );
}
