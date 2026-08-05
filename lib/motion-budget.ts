// lib/motion-budget.ts

/**
 * Motion budgets as pure data contracts — no effects, no runtime.
 * These define timing, easing, distance, density, and concurrency limits.
 * Motion recipes (Plan 4) consume these budgets.
 */

/** Capability tiers */
export type MotionTier =
  | "full-desktop"
  | "mobile-touch"
  | "short-height"
  | "webview-constrained"
  | "reduced-motion";

/** Named motion families */
export type MotionFamily =
  | "branded-arrival"
  | "route-handoff"
  | "menu-presence"
  | "structured-reveal"
  | "scroll-linked-depth"
  | "sticky-relationship"
  | "section-tracking"
  | "direct-interaction"
  | "loading-provider-state"
  | "theme-state";

/** Timing budget ranges (seconds) */
export const TIMING_BUDGET = {
  directInteraction: { min: 0.12, max: 0.24 },
  editorialEntrance: { min: 0.35, max: 0.7 },
  brandedArrival: { min: 0.8, max: 1.2 },
  routeHandoffDesktop: { min: 0.6, max: 0.9 },
  routeHandoffMobile: { min: 0.35, max: 0.5 },
} as const;

/** Easing presets */
export const EASING_BUDGET = {
  /** Hover, focus, pressed, controls */
  fastGraphic: {
    framer: [0.22, 0.61, 0.36, 1] as const,
    css: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    gsap: "power2.out",
  },
  /** Headings, rules, evidence-region entrances */
  decisiveEditorial: {
    framer: [0.16, 1, 0.3, 1] as const,
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    gsap: "power3.out",
  },
  /** Route planes, portraits, bounded parallax */
  fluidCinematic: {
    framer: [0.4, 0, 0.2, 1] as const,
    css: "cubic-bezier(0.4, 0, 0.2, 1)",
    gsap: "power2.inOut",
  },
  /** Exit — controlled deceleration */
  exit: {
    framer: [0.55, 0.08, 0.68, 0.53] as const,
    css: "cubic-bezier(0.55, 0.08, 0.68, 0.53)",
    gsap: "power3.in",
  },
} as const;

/** Distance budgets by tier (px) */
export const DISTANCE_BUDGET = {
  subtle: { "full-desktop": 24, "mobile-touch": 16, "short-height": 16, "webview-constrained": 0, "reduced-motion": 0 },
  accent: { "full-desktop": 48, "mobile-touch": 24, "short-height": 32, "webview-constrained": 0, "reduced-motion": 0 },
  parallax: { "full-desktop": 18, "mobile-touch": 0, "short-height": 14, "webview-constrained": 0, "reduced-motion": 0 },
  // Hero-only. The identity scene layers depth across a full section height, so
  // 18px reads as no movement at all. Deliberately larger than `parallax`.
  heroParallax: { "full-desktop": 72, "mobile-touch": 0, "short-height": 60, "webview-constrained": 0, "reduced-motion": 0 },
} as const;

export type DistanceToken = keyof typeof DISTANCE_BUDGET;

/** Density and concurrency limits */
export const DENSITY_BUDGET = {
  maxConcurrentScrollEffects: 3,
  maxStaggerItems: 8,
} as const;

/** Aggregate budget export */
export const MOTION_BUDGET = {
  timing: TIMING_BUDGET,
  easing: EASING_BUDGET,
  distance: DISTANCE_BUDGET,
  density: DENSITY_BUDGET,
} as const;

export type MotionBudget = typeof MOTION_BUDGET;
