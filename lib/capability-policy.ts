// lib/capability-policy.ts

/**
 * Centralized capability-policy module.
 *
 * ONE authority for runtime facts → named enhancement decisions.
 * Consumers request named decisions; they do NOT independently query
 * matchMedia, user-agent, or viewport.
 *
 * INVARIANTS:
 * - Reduced motion overrides all richer tiers.
 * - Capability uncertainty → simplest tier.
 * - Pending/failed initialization → simplest static/native tier.
 * - Width alone never grants motion eligibility.
 * - Policy enables enhancement; never removes content, actions, or recovery.
 * - CSS remains authoritative for layout.
 */

import type { MotionTier } from "./motion-budget";

// ─── Runtime Facts ───────────────────────────────────────────────────

export interface CapabilityFacts {
  /** User prefers reduced motion */
  reducedMotion: boolean;
  /** Pointer is coarse (touch-primary) */
  coarsePointer: boolean;
  /** Touch-dominant input (even at wide widths) */
  touchDominant: boolean;
  /** Usable viewport height (px) — excludes browser chrome estimate */
  viewportHeight: number;
  /** Viewport width (px) */
  viewportWidth: number;
  /** Likely webview or constrained in-app browser */
  isWebview: boolean;
  /** Browser-restoration navigation detected */
  isRestoration: boolean;
}

/**
 * Resolve runtime facts from the current environment.
 * MUST be called client-side only (guards with typeof window).
 * Returns the simplest-tier assumptions when called on server.
 */
export function resolveCapabilityFacts(): CapabilityFacts {
  if (typeof window === "undefined") {
    return {
      reducedMotion: true,
      coarsePointer: false,
      touchDominant: false,
      viewportHeight: 0,
      viewportWidth: 0,
      isWebview: false,
      isRestoration: false,
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const touchDominant = coarsePointer && !window.matchMedia("(pointer: fine)").matches;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const ua = navigator.userAgent || "";
  const isWebview =
    /FBAN|FBAV|Instagram|TikTok|musically|Twitter|LinkedInApp|Snapchat|Discord/i.test(ua) ||
    (/(iPhone|iPad|iPod)/.test(ua) && !/Safari/.test(ua)) ||
    (/Android/.test(ua) && /Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua));

  let isRestoration = false;
  if ("navigation" in window && (window as Window & { navigation?: { currentEntry?: { navigationType?: string } } }).navigation?.currentEntry?.navigationType === "traverse") {
    isRestoration = true;
  } else if (performance?.getEntriesByType) {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "back_forward") isRestoration = true;
  }

  return {
    reducedMotion,
    coarsePointer,
    touchDominant,
    viewportHeight,
    viewportWidth,
    isWebview,
    isRestoration,
  };
}

// ─── Tier Resolution ─────────────────────────────────────────────────

/** Minimum usable height for sticky eligibility */
const MIN_HEIGHT_FOR_DEPTH = 700;

export function resolveMotionTier(facts: CapabilityFacts): MotionTier {
  if (facts.reducedMotion) return "reduced-motion";
  if (facts.isWebview) return "webview-constrained";
  if (facts.touchDominant || facts.coarsePointer) return "mobile-touch";
  if (facts.viewportHeight < MIN_HEIGHT_FOR_DEPTH) return "short-height";
  return "full-desktop";
}

// ─── Named Decisions ─────────────────────────────────────────────────

export interface CapabilityDecisions {
  /** Current motion tier */
  tier: MotionTier;
  /** Branded full-load arrival eligible */
  brandedArrival: boolean;
  /** Route handoff eligible */
  routeHandoff: boolean;
  /** Lenis scroll enhancement eligible */
  lenisEligible: boolean;
  /** Scroll-linked parallax eligible */
  parallaxEligible: boolean;
  /** Sticky evidence/orientation relationships eligible */
  stickyEligible: boolean;
  /** Structured reveal animations eligible */
  structuredReveal: boolean;
  /** Magnetic CTA response eligible */
  magneticEligible: boolean;
}

export function getCapabilityDecisions(facts: CapabilityFacts): CapabilityDecisions {
  const tier = resolveMotionTier(facts);

  if (tier === "reduced-motion") {
    return {
      tier,
      brandedArrival: false,
      routeHandoff: false,
      lenisEligible: false,
      parallaxEligible: false,
      stickyEligible: false,
      structuredReveal: false,
      magneticEligible: false,
    };
  }

  if (tier === "webview-constrained") {
    return {
      tier,
      brandedArrival: false,
      routeHandoff: false,
      lenisEligible: false,
      parallaxEligible: false,
      stickyEligible: false,
      structuredReveal: false,
      magneticEligible: false,
    };
  }

  if (tier === "mobile-touch") {
    return {
      tier,
      brandedArrival: true,
      routeHandoff: true,
      lenisEligible: false,
      parallaxEligible: false,
      stickyEligible: false,
      structuredReveal: true,
      magneticEligible: false,
    };
  }

  if (tier === "short-height") {
    return {
      tier,
      brandedArrival: true,
      routeHandoff: true,
      lenisEligible: true,
      // Bounded parallax (≤18px) is safe on a short viewport — it consumes no
      // layout height. Sticky stays off: that is what actually eats the screen.
      parallaxEligible: true,
      stickyEligible: false,
      structuredReveal: true,
      magneticEligible: true,
    };
  }

  return {
    tier,
    brandedArrival: true,
    routeHandoff: true,
    lenisEligible: true,
    parallaxEligible: true,
    stickyEligible: true,
    structuredReveal: true,
    magneticEligible: true,
  };
}
