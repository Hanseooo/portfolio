// lib/performance-checks.ts

/**
 * Performance instrumentation for motion runtime — S5 §20, S6 §13.
 *
 * Development-only helpers for validating:
 * - Simultaneous scroll-linked composition count (≤3)
 * - Frame budget adherence
 * - Cleanup completeness
 * - Restoration detection
 *
 * These are NOT shipped to production bundles — use in dev only
 * or behind process.env.NODE_ENV === "development" guards.
 */

import { ScrollTrigger } from "./gsap";

/**
 * Count active scroll-linked compositions in current viewport.
 * Release blocker if > 3 simultaneous (S5 §19).
 */
export function countActiveScrollCompositions(): number {
  if (typeof window === "undefined") return 0;
  return ScrollTrigger.getAll().filter((t) => t.isActive).length;
}

/**
 * Validate that no more than 3 scroll compositions are active.
 * Call this in a requestAnimationFrame loop during dev testing.
 */
export function validateScrollDensity(): { ok: boolean; count: number } {
  const count = countActiveScrollCompositions();
  if (count > 3) {
    console.warn(
      `[PERF] ${count} simultaneous scroll-linked compositions exceed budget of 3.`
    );
  }
  return { ok: count <= 3, count };
}

/**
 * Check if current navigation is a browser restoration.
 * Used by BrandedArrival and structured reveals to bypass.
 */
export function isRestorationNavigation(): boolean {
  if (typeof window === "undefined") return false;

  // Navigation API (modern browsers)
  if ("navigation" in window) {
    const nav = (window as Window & { navigation?: { currentEntry?: { navigationType?: string } } })
      .navigation?.currentEntry;
    if (nav?.navigationType === "traverse") return true;
  }

  // Performance API fallback
  const entry = performance?.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (entry?.type === "back_forward") return true;

  return false;
}

/**
 * Verify all ScrollTrigger instances have been cleaned up.
 * Call after route unmount in development.
 */
export function verifyScrollTriggerCleanup(context: string): boolean {
  const remaining = ScrollTrigger.getAll().length;
  if (remaining > 0 && process.env.NODE_ENV === "development") {
    console.warn(
      `[CLEANUP] ${remaining} ScrollTrigger instances remain after ${context}. Expected 0.`
    );
  }
  return remaining === 0;
}

/**
 * Measure frame budget adherence.
 * Returns a function to stop measurement.
 */
export function measureFrameBudget(label: string): () => void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return () => {};
  }

  let frames = 0;
  let violations = 0;
  let lastTime = performance.now();

  const check = () => {
    const now = performance.now();
    const delta = now - lastTime;
    frames++;
    // 16.67ms = 60fps budget
    if (delta > 20) violations++;
    lastTime = now;
    rafId = requestAnimationFrame(check);
  };

  let rafId = requestAnimationFrame(check);

  return () => {
    cancelAnimationFrame(rafId);
    if (violations > 0) {
      console.warn(
        `[PERF:${label}] ${violations}/${frames} frames exceeded 20ms budget.`
      );
    }
  };
}
