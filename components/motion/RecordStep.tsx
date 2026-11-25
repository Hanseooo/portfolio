"use client";

import { useLayoutEffect, useRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

type Direction = "prev" | "next";

/** The last Previous/Next click, consumed by the next RecordStep to mount. */
let pending: { direction: Direction; at: number } | null = null;
/** A click older than this never reached a RecordStep (another route took it). */
const PENDING_TTL_MS = 2000;

/** Previous/Next record link that tells the next record which way it was reached. */
export function StepLink({ direction, ...props }: ComponentProps<typeof Link> & { direction: Direction }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        // A new tab or window never mounts a RecordStep here; only a plain click steps.
        const plain = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if (plain) pending = { direction, at: performance.now() };
        props.onClick?.(event);
      }}
    />
  );
}

/**
 * Record body that slides 24px in from the side it was reached from: from the right after Next,
 * from the left after Previous. Any other arrival renders still.
 */
export function RecordStep({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Layout effect: the first painted frame is already the offset one.
  useLayoutEffect(() => {
    const step = pending;
    pending = null;
    if (!step || reducedMotion || performance.now() - step.at > PENDING_TTL_MS) return;
    const dx = step.direction === "next" ? 24 : -24;
    ref.current?.animate(
      [
        { opacity: 0, transform: `translateX(${dx}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    // Mount only: a later reduced-motion change must not replay the step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}>{children}</div>;
}
