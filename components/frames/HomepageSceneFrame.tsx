import type { ReactNode } from "react";

/**
 * Surface role for the scene — determines background treatment.
 */
type SceneSurface = "foundation" | "reading" | "signal" | "raised";

interface HomepageSceneFrameProps {
  /** Stable section ID — must match SECTION_IDS from lib/anchor-navigation */
  id: string;
  /** Semantic scene number (01–06) for indexing */
  sceneNumber: string;
  /** Accessible heading text for the scene */
  heading: string;
  /** Surface role — mapped to CSS variable backgrounds */
  surface?: SceneSurface;
  /** Whether this is the hero (first scene, may receive special spacing) */
  isHero?: boolean;
  /** Optional className for scene-specific overrides */
  className?: string;
  children: ReactNode;
}

const SURFACE_MAP: Record<SceneSurface, string> = {
  foundation: "bg-[color:var(--cs-foundation)]",
  reading: "bg-[color:var(--cs-reading-surface)]",
  signal: "bg-[color:var(--cs-signal)]",
  raised: "bg-[color:var(--cs-raised-neutral)]",
};

/**
 * Homepage scene frame — S6 §6.3.
 *
 * Owns:
 * - Section landmark and stable ID (for anchor navigation)
 * - Semantic scene number and heading association
 * - Surface role
 * - Chapter-navigation registration boundary (ID used by observer)
 * - Standard scene boundary and reading-order guarantees
 * - Optional structured-reveal boundary (mounting point for Plan 4)
 *
 * Each of the six S3 scenes owns its internal composition.
 * The frame does NOT dictate internal layout.
 */
export default function HomepageSceneFrame({
  id,
  sceneNumber,
  heading,
  surface = "foundation",
  isHero = false,
  className = "",
  children,
}: HomepageSceneFrameProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative ${SURFACE_MAP[surface]} ${isHero ? "" : "py-16 md:py-24 lg:py-32"} ${className}`}
    >
      {/* Hero scenes provide their own visible h1 with this ID; suppress the redundant h2. */}
      {!isHero && (
        <h2
          id={`${id}-heading`}
          className="sr-only"
        >
          {sceneNumber} {heading}
        </h2>
      )}
      {children}
    </section>
  );
}
