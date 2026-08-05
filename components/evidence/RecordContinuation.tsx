import Link from "next/link";

interface ContinuationTarget {
  label: string;
  href: string;
}

interface RecordContinuationProps {
  /** Parent collection destination */
  parent: ContinuationTarget;
  /** Previous record — null if first (no misleading disabled control) */
  prev?: ContinuationTarget | null;
  /** Next record — null if last (no misleading disabled control) */
  next?: ContinuationTarget | null;
}

/**
 * Parent + linear prev/next record continuation — S4 §11, S6 §6.4.
 *
 * Deterministic rather than history-dependent.
 * Missing adjacency does NOT leave a disabled control.
 * Controls name destinations truthfully.
 */
export default function RecordContinuation({
  parent,
  prev,
  next,
}: RecordContinuationProps) {
  return (
    <nav aria-label="Record navigation" className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Parent */}
      <Link
        href={parent.href}
        className="inline-flex h-11 items-center font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      >
        {parent.label}
      </Link>

      {/* Prev / Next */}
      <div className="flex items-center gap-4">
        {prev && (
          <Link
            href={prev.href}
            className="inline-flex h-11 items-center gap-1 font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            aria-label={`Previous: ${prev.label}`}
          >
            ← <span className="hidden sm:inline">{prev.label}</span><span className="sm:hidden">Prev</span>
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="inline-flex h-11 items-center gap-1 font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            aria-label={`Next: ${next.label}`}
          >
            <span className="hidden sm:inline">{next.label}</span><span className="sm:hidden">Next</span> →
          </Link>
        )}
      </div>
    </nav>
  );
}
