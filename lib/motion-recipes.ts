// lib/motion-recipes.ts

/**
 * Named Framer Motion structured-reveal recipes.
 * S5 §9, S6 §8.2
 *
 * Each recipe is a pure data declaration — no runtime effects.
 * The StructuredReveal component consumes these by name.
 *
 * INVARIANTS:
 * - All `final` states match the CSS baseline (opacity:1, transform:none)
 * - Reduced-motion tier returns immediate final state (no animation)
 * - Interruption (focus, anchor, input) resolves to final instantly
 * - Runs once per route visit; does not replay on scroll-back
 * - Properties listed here are EXCLUSIVELY owned by Framer on that target
 */

import { TIMING_BUDGET, EASING_BUDGET, DISTANCE_BUDGET, type MotionTier } from "./motion-budget";

export type RevealRecipeName =
  | "hero-proof"
  | "flagship-record"
  | "experience-record"
  | "supporting-record"
  | "credential-artifact"
  | "presence-region"
  | "contact-close"
  | "catalogue-record"
  | "career-record"
  | "register-record"
  | "evidence-section"
  | "arrival-exit";

export interface RevealRecipe {
  name: RevealRecipeName;
  engine: "framer";
  /** Properties this recipe mutates — no other engine may touch these on the same node */
  properties: string[];
  /** Trigger: "in-view" for scroll-reveals, "mount" for arrival */
  trigger: "in-view" | "mount";
  /** Only fire once per route visit */
  once: boolean;
  /** Viewport intersection amount (0-1) for in-view trigger */
  viewportAmount: number;
  /** Get animation variants for a given tier */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVariants: (tier: MotionTier) => { initial: Record<string, any>; animate: Record<string, any>; transition: Record<string, any> } | null; // null = no animation (reduced-motion)
}

/** Shared editorial entrance: opacity + translateY with decisive easing */
function editorialEntrance(
  tier: MotionTier,
  options?: { delay?: number; staggerChildren?: number }
): ReturnType<RevealRecipe["getVariants"]> {
  if (tier === "reduced-motion" || tier === "webview-constrained") return null;

  const distance = tier === "mobile-touch"
    ? DISTANCE_BUDGET.subtle["mobile-touch"]
    : DISTANCE_BUDGET.subtle["full-desktop"];

  const duration = tier === "mobile-touch"
    ? TIMING_BUDGET.editorialEntrance.min
    : TIMING_BUDGET.editorialEntrance.max;

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration,
      ease: EASING_BUDGET.decisiveEditorial.framer,
      ...(options?.delay ? { delay: options.delay } : {}),
      ...(options?.staggerChildren
        ? { staggerChildren: options.staggerChildren, delayChildren: options?.delay ?? 0 }
        : {}),
    },
  };
}

/** Accent entrance: slightly larger distance for emphasis items */
function accentEntrance(
  tier: MotionTier,
  options?: { delay?: number; staggerChildren?: number }
): ReturnType<RevealRecipe["getVariants"]> {
  if (tier === "reduced-motion" || tier === "webview-constrained") return null;

  const distance = tier === "mobile-touch"
    ? DISTANCE_BUDGET.accent["mobile-touch"]
    : DISTANCE_BUDGET.accent["full-desktop"];

  const duration = tier === "mobile-touch"
    ? TIMING_BUDGET.editorialEntrance.min + 0.1
    : TIMING_BUDGET.editorialEntrance.max;

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration,
      ease: EASING_BUDGET.decisiveEditorial.framer,
      ...(options?.delay ? { delay: options.delay } : {}),
      ...(options?.staggerChildren
        ? { staggerChildren: options.staggerChildren, delayChildren: options?.delay ?? 0 }
        : {}),
    },
  };
}

export const REVEAL_RECIPES: Record<RevealRecipeName, RevealRecipe> = {
  "hero-proof": {
    name: "hero-proof",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.3,
    getVariants: (tier) => accentEntrance(tier, { delay: 0.1, staggerChildren: 0.15 }),
  },

  "flagship-record": {
    name: "flagship-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.2,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "experience-record": {
    name: "experience-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.3,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "supporting-record": {
    name: "supporting-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.2,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "credential-artifact": {
    name: "credential-artifact",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.4,
    getVariants: (tier) => editorialEntrance(tier, { delay: 0.15 }),
  },

  "presence-region": {
    name: "presence-region",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.2,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "contact-close": {
    name: "contact-close",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.3,
    getVariants: (tier) => accentEntrance(tier),
  },

  "catalogue-record": {
    name: "catalogue-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.15,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "career-record": {
    name: "career-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.2,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "register-record": {
    name: "register-record",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.2,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "evidence-section": {
    name: "evidence-section",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "in-view",
    once: true,
    viewportAmount: 0.15,
    getVariants: (tier) => editorialEntrance(tier),
  },

  "arrival-exit": {
    name: "arrival-exit",
    engine: "framer",
    properties: ["opacity", "transform"],
    trigger: "mount",
    once: true,
    viewportAmount: 0,
    getVariants: (tier) => {
      if (tier === "reduced-motion" || tier === "webview-constrained") return null;
      return {
        initial: { y: "0%" },
        animate: { y: "-100%" },
        transition: {
          duration: 0.75,
          ease: EASING_BUDGET.fluidCinematic.framer,
        },
      };
    },
  },
};
