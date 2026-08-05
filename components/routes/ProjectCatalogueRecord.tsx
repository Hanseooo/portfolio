// components/routes/ProjectCatalogueRecord.tsx
"use client";
import Image from "next/image";
import HandoffLink from "@/components/shell/HandoffLink";
import StructuredReveal from "@/components/motion/StructuredReveal";
import type { ProjectCollectionRecord } from "@/lib/content/collection-projections";

interface ProjectCatalogueRecordProps {
  record: ProjectCollectionRecord;
  /** Controlled alternation: even (0-indexed) = image-left, odd = image-right */
  isAlternate: boolean;
}

/**
 * Single project band for /projects collection index — S4 §6.
 *
 * Equal structural weight for all projects.
 * Full-width ruled band with ~7/5 image-to-info split (desktop).
 * No stack chips, no competing exits, no card grid.
 * One clear case-study destination per band.
 */
export default function ProjectCatalogueRecord({
  record,
  isAlternate,
}: ProjectCatalogueRecordProps) {
  return (
    <StructuredReveal recipe="catalogue-record">
    <div
      className="ruled-band"
      data-motion-target="catalogue-record"
    >
      <HandoffLink
        href={record.detailRoute}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--cs-focus-ring)]"
        aria-label={`View case study: ${record.title}`}
      >
        <div
          className={`grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-6 lg:gap-10 ${
            isAlternate ? "md:[direction:rtl]" : ""
          }`}
        >
          {/* Hero Image — 7 columns on desktop */}
          <div className="md:col-span-7 md:[direction:ltr]">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-raised-neutral)]">
              <Image
                src={record.heroImage}
                alt={`${record.title} — project screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 816px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Information — 5 columns on desktop */}
          <div className="flex flex-col gap-3 md:col-span-5 md:[direction:ltr]">
            {/* Record index */}
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              {String(record.position).padStart(2, "0")}
            </span>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,3rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
              {record.title}
            </h2>

            {/* Subtitle */}
            <p className="readable-measure text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
              {record.subtitle}
            </p>

            {/* Metadata row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              <span>{record.year}</span>
              <span aria-hidden="true" className="h-px w-4 bg-[color:var(--cs-structural-line-strong)]" />
              <span>{record.role}</span>
              {record.client && (
                <>
                  <span aria-hidden="true" className="h-px w-4 bg-[color:var(--cs-structural-line-strong)]" />
                  <span>{record.client}</span>
                </>
              )}
            </div>

            {/* Case study destination indicator */}
            <span className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal)] transition-transform duration-200 group-hover:translate-x-1">
              View Case Study →
            </span>
          </div>
        </div>
      </HandoffLink>
    </div>
    </StructuredReveal>
  );
}
