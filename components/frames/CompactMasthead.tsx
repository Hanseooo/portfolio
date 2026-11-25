import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CompassArc, compassTip } from "@/components/geometry";

/** Each section's compass bearing, turning further in nav order. Records share their collection's. */
const BEARING = { about: 18, projects: 32, experience: 47, certificates: 61, resources: 76 } as const;

interface CompactMastheadProps {
  /** Site section: sets the compass bearing */
  section: keyof typeof BEARING;
  /** Parent destination label, e.g. "Projects", "Certificates", "Home" */
  parentLabel: string;
  /** Parent destination href */
  parentHref: string;
  /** Semantic record index, e.g. "01", "03 of 05" */
  index?: string;
  /** Page title — rendered as h1 */
  title: string;
  /** Optional subtitle or role */
  subtitle?: string;
  /** Optional metadata items (year, issuer, period, etc.) */
  metadata?: ReactNode;
  /** Optional primary actions (GitHub, Live, Credential URL) */
  actions?: ReactNode;
}

/**
 * Compact indexed masthead — S4 §5.1, S6 §6.2.
 *
 * In ordinary document flow (not viewport-locked).
 * Contains only applicable orientation data.
 * Uses one controlled structural break (signal rule).
 * Does NOT invent introductory prose.
 */
export default function CompactMasthead({
  section,
  parentLabel,
  parentHref,
  index,
  title,
  subtitle,
  metadata,
  actions,
}: CompactMastheadProps) {
  const bearing = BEARING[section];
  // From md the arc is turned -90° (origin bottom-right), so its tip lands here in the box.
  const tip = compassTip(bearing);
  const labelStyle = {
    right: `${100 - tip.y}%`,
    bottom: `${tip.x}%`,
    "--crop-x": 1,
    "--crop-y": 1,
  } as CSSProperties;
  // The label settles as the compass sweep (700ms) passes the leg.
  const labelDraw = { "--draw-delay": `${Math.round(100 + (700 * bearing) / 90)}ms` } as CSSProperties;

  return (
    <div className="relative isolate pb-12 pt-8 md:pb-16 md:pt-12">
      {/* Signal rule — controlled structural break */}
      <div
        className="absolute left-0 top-0 h-0.5 w-16 bg-[color:var(--cs-signal)] md:w-24"
        aria-hidden="true"
      />

      {/* Drafting sheet spreading from the compass origin */}
      <div
        className="masthead-sheet pointer-events-none absolute inset-0 -z-10 opacity-[0.15] dark:opacity-[0.07]"
        aria-hidden="true"
      />

      {/* Compass construction: top-right corner on phones, bottom-right from md, never taller
          than the masthead. The leg's bearing is labelled from md. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 aspect-square w-28 md:top-auto md:bottom-0 md:h-full md:max-h-56 md:w-auto lg:max-h-72"
      >
        <CompassArc
          hatch
          bearing={bearing}
          className="absolute inset-0 rotate-180 text-[color:var(--cs-structural-line-strong)] md:-rotate-90"
        />
        <span data-draw="settle" style={labelDraw} className="hidden md:block">
          <span
            style={labelStyle}
            className="absolute pr-2 pb-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[color:var(--cs-text-secondary)]"
          >
            {bearing}°
          </span>
        </span>
      </div>

      {/* Parent navigation */}
      <nav aria-label="Parent route" className="mb-4">
        <Link
          href={parentHref}
          className="inline-flex h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
        >
          ← {parentLabel}
        </Link>
      </nav>

      {/* Index */}
      {index && (
        <p className="mb-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {index}
        </p>
      )}

      {/* Title (h1 for the page). From md it wraps before the compass (max 224px, 288px at lg). */}
      <h1 className="text-balance md:max-w-[calc(100%-15rem)] lg:max-w-[calc(100%-19rem)] font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,4rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 max-w-[45ch] text-lg text-[color:var(--cs-text-secondary)]">
          {subtitle}
        </p>
      )}

      {/* Metadata */}
      {metadata && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {metadata}
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div className="mt-6">
          {actions}
        </div>
      )}
    </div>
  );
}
