import Link from "next/link";
import type { ReactNode } from "react";

interface CompactMastheadProps {
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
  parentLabel,
  parentHref,
  index,
  title,
  subtitle,
  metadata,
  actions,
}: CompactMastheadProps) {
  return (
    <div className="relative pb-12 pt-8 md:pb-16 md:pt-12">
      {/* Signal rule — controlled structural break */}
      <div
        className="absolute left-0 top-0 h-0.5 w-16 bg-[color:var(--cs-signal)] md:w-24"
        aria-hidden="true"
      />

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

      {/* Title (h1 for the page) */}
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,4rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">
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
