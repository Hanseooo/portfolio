import type { ReactNode } from "react";
import StructuredReveal from "@/components/motion/StructuredReveal";

interface PageFamilyFrameProps {
  /** Masthead content (CompactMasthead) */
  masthead: ReactNode;
  /** Optional local contents/navigation region (project detail only) */
  localNav?: ReactNode;
  /** Main evidence body */
  children: ReactNode;
  /** Record continuation (prev/next + parent) */
  continuation?: ReactNode;
}

/**
 * Page-family frame — S4 §5, S6 §6.2.
 *
 * Shared editorial spine for all non-home routes.
 * Provides consistent orientation, reading alignment,
 * and structural rhythm without forcing identical bodies.
 *
 * Does NOT own internal evidence composition — that belongs
 * to the route-specific page component.
 */
export default function PageFamilyFrame({
  masthead,
  localNav,
  children,
  continuation,
}: PageFamilyFrameProps) {
  return (
    <article className="mx-auto max-w-[1400px] px-[var(--cs-gutter-portfolio)]">
      {/* Masthead region */}
      <StructuredReveal recipe="hero-proof">
        {masthead}
      </StructuredReveal>

      {/* Optional local section navigation (project detail) */}
      {localNav && (
        <StructuredReveal recipe="evidence-section">
          <nav
            aria-label="Page sections"
            className="mb-8 border-b border-[color:var(--cs-structural-line)] pb-4 md:mb-12"
          >
            {localNav}
          </nav>
        </StructuredReveal>
      )}

      {/* Evidence body */}
      <div className="pb-16 md:pb-24">
        {children}
      </div>

      {/* Record continuation */}
      {continuation && (
        <div className="border-t border-[color:var(--cs-structural-line)] py-12 md:py-16">
          {continuation}
        </div>
      )}
    </article>
  );
}
