// lib/anchor-navigation.ts

/**
 * Semantic anchor-navigation interface.
 *
 * Owns:
 * - Fragment activation semantics
 * - Persistent-navigation offset computation
 * - Focus-transfer target contract
 * - URL-fragment update decision
 *
 * Does NOT own:
 * - Lenis smooth-scroll fulfillment (Plan 4 scroll-enhancement controller)
 * - Visual animation of the scroll (motion plan)
 * - Section-tracking observation (route-local, Plan 3)
 */

import {
  type PortfolioDestination,
  getDestinationHref,
  isRouteChange,
} from "./destinations";
import { NAV_ANCHOR_OFFSET } from "./design-tokens/patterns";

/** Stable section IDs for homepage scenes — used as fragment targets */
export const SECTION_IDS = {
  identity: "identity",
  flagships: "flagships",
  experience: "experience",
  moreWork: "more-work",
  presence: "presence",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * A request to navigate to a semantic anchor.
 * Consumers build this; the scroll-enhancement controller or native fallback fulfills it.
 */
export interface AnchorNavigationRequest {
  /** Target fragment (without #) */
  fragment: string;
  /** Whether this requires a route change first */
  requiresRouteChange: boolean;
  /** Full href for the destination */
  href: string;
  /** Whether to update the URL fragment (user-initiated: yes; passive tracking: no) */
  updateFragment: boolean;
  /** Whether to transfer focus to the target heading */
  transferFocus: boolean;
  /** Offset in px to account for persistent navigation */
  offsetPx: number;
}

/**
 * Build an anchor navigation request from a destination.
 *
 * @param dest - Resolved portfolio destination with a fragment
 * @param currentPathname - Current route pathname
 * @param options.updateFragment - Whether to push fragment to URL (default true)
 * @param options.transferFocus - Whether to move focus to target heading (default true)
 */
export function buildAnchorRequest(
  dest: PortfolioDestination,
  currentPathname: string,
  options: { updateFragment?: boolean; transferFocus?: boolean } = {}
): AnchorNavigationRequest | null {
  if (!dest.fragment) return null;

  const { updateFragment = true, transferFocus = true } = options;

  // ponytail: desktop offset as safe minimum; CSS handles actual responsive value
  const offsetPx = NAV_ANCHOR_OFFSET.desktop;

  return {
    fragment: dest.fragment,
    requiresRouteChange: isRouteChange(dest, currentPathname),
    href: getDestinationHref(dest),
    updateFragment,
    transferFocus,
    offsetPx,
  };
}

/**
 * Compute the scroll target position for a fragment.
 * Used by the scroll-enhancement controller or native fallback.
 * Returns null if the element is not found.
 */
export function computeScrollTarget(
  fragment: string,
  offsetPx: number
): { top: number; element: HTMLElement } | null {
  if (typeof document === "undefined") return null;

  const element = document.getElementById(fragment);
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const top = rect.top + scrollTop - offsetPx;

  return { top: Math.max(0, top), element };
}

/**
 * Native fallback: perform anchor navigation without smooth-scroll enhancement.
 * Moves focus to the target heading and updates the URL fragment.
 */
export function performNativeAnchorNavigation(request: AnchorNavigationRequest): boolean {
  const target = computeScrollTarget(request.fragment, request.offsetPx);
  if (!target) return false;

  window.scrollTo({ top: target.top, behavior: "instant" });

  if (request.transferFocus) {
    if (!target.element.hasAttribute("tabindex")) {
      target.element.setAttribute("tabindex", "-1");
    }
    target.element.focus({ preventScroll: true });
  }

  if (request.updateFragment) {
    history.replaceState(null, "", `#${request.fragment}`);
  }

  return true;
}
