// lib/destinations.ts

/**
 * Portfolio destination resolver — stable site-level destination intent.
 *
 * Global navigation, chapter controls, and route handoff all consume
 * destinations through this interface rather than hardcoding routes.
 *
 * Key semantics:
 * - Global "Contact" resolves to homepage #contact (not a separate route)
 * - Homepage chapter controls resolve to same-route fragments
 * - Collection/detail routes resolve to their canonical paths
 */

/** All stable portfolio destinations */
export type DestinationId =
  | "home"
  | "projects"
  | "experience"
  | "certificates"
  | "contact"
  | "scene-identity"
  | "scene-flagships"
  | "scene-experience"
  | "scene-more-work"
  | "scene-presence"
  | "scene-contact";

export interface PortfolioDestination {
  id: DestinationId;
  /** Canonical pathname */
  pathname: string;
  /** Fragment (without #) — present for same-route anchors */
  fragment?: string;
  /** Human label for navigation */
  label: string;
  /** Accessible name when context-dependent (e.g., global vs chapter) */
  accessibleName?: string;
}

export const DESTINATIONS: Record<DestinationId, PortfolioDestination> = {
  home: {
    id: "home",
    pathname: "/",
    label: "Home",
  },
  projects: {
    id: "projects",
    pathname: "/projects",
    label: "Projects",
  },
  experience: {
    id: "experience",
    pathname: "/experience",
    label: "Experience",
  },
  certificates: {
    id: "certificates",
    pathname: "/certificates",
    label: "Certificates",
  },
  contact: {
    id: "contact",
    pathname: "/",
    fragment: "contact",
    label: "Contact",
    accessibleName: "Contact — site navigation",
  },
  "scene-identity": {
    id: "scene-identity",
    pathname: "/",
    fragment: "identity",
    label: "01 Identity",
    accessibleName: "Go to section 01 Identity",
  },
  "scene-flagships": {
    id: "scene-flagships",
    pathname: "/",
    fragment: "flagships",
    label: "02 Flagships",
    accessibleName: "Go to section 02 Flagships",
  },
  "scene-experience": {
    id: "scene-experience",
    pathname: "/",
    fragment: "experience",
    label: "03 Experience",
    accessibleName: "Go to section 03 Experience",
  },
  "scene-more-work": {
    id: "scene-more-work",
    pathname: "/",
    fragment: "more-work",
    label: "04 More Work",
    accessibleName: "Go to section 04 More Work",
  },
  "scene-presence": {
    id: "scene-presence",
    pathname: "/",
    fragment: "presence",
    label: "05 Presence",
    accessibleName: "Go to section 05 Presence",
  },
  "scene-contact": {
    id: "scene-contact",
    pathname: "/",
    fragment: "contact",
    label: "06 Contact",
    accessibleName: "Go to section 06 Contact",
  },
} as const;

/** Homepage chapter sequence for ordered navigation */
export const HOMEPAGE_CHAPTER_SEQUENCE = [
  "scene-identity",
  "scene-flagships",
  "scene-experience",
  "scene-more-work",
  "scene-presence",
  "scene-contact",
] as const satisfies readonly DestinationId[];

/** Global navigation route sequence */
export const GLOBAL_NAV_SEQUENCE: DestinationId[] = [
  "home",
  "projects",
  "experience",
  "certificates",
  "contact",
];

/** Resolve a destination intent to its full target. Returns null if unknown. */
export function resolveDestination(id: DestinationId): PortfolioDestination | null {
  return DESTINATIONS[id] ?? null;
}

/** Build the full href for a destination (pathname + optional fragment). */
export function getDestinationHref(dest: PortfolioDestination): string {
  if (dest.fragment) return `${dest.pathname}#${dest.fragment}`;
  return dest.pathname;
}

/**
 * Determine whether a destination requires a route change from currentPathname,
 * or is a same-route anchor navigation.
 */
export function isRouteChange(dest: PortfolioDestination, currentPathname: string): boolean {
  return dest.pathname !== currentPathname;
}
