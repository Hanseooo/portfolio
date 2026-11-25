// components/routes/ExperienceCareerRecord.tsx
import type { CSSProperties } from "react";
import StructuredReveal from "@/components/motion/StructuredReveal";
import ScreenshotFrame from "@/components/evidence/ScreenshotFrame";
import { ScreenshotViewer, ShotThumb } from "@/components/evidence/ScreenshotViewer";
import { IndexMark } from "@/components/geometry";
import type { ExperienceLedgerRecord } from "@/lib/content/collection-projections";

interface ExperienceCareerRecordProps {
  record: ExperienceLedgerRecord;
}

/**
 * Single career record — S4 §8.2.
 *
 * Metadata rail beside evidence column (desktop).
 * Every source bullet preserved as separately numbered evidence unit.
 * No ornamental timeline, no decorative dots, no invented chronology.
 * Freelance record omits period because source has none — no placeholder.
 */
export default function ExperienceCareerRecord({
  record,
}: ExperienceCareerRecordProps) {
  return (
    <StructuredReveal recipe="career-record">
    <div
      id={record.id}
      className="ruled-band"
      data-motion-target="career-record"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        {/* Metadata rail — 4 columns on desktop; stays in view while its evidence scrolls */}
        <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
          {/* Record index */}
          <IndexMark position={record.position} className="mb-4" />

          {/* Role */}
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.25rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">
            {record.role}
          </h2>

          {/* Company + Period */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            <span>{record.company}</span>
            {/* Period — truthful omission: Freelance has empty string */}
            {record.period && (
              <>
                <span aria-hidden="true" className="h-px w-4 bg-[color:var(--cs-structural-line-strong)]" />
                <span>{record.period}</span>
              </>
            )}
          </div>
        </div>

        {/* Evidence column — 8 columns on desktop */}
        <div className="md:col-span-8">
          <ol className="space-y-4" role="list">
            {record.points.map((point, i) => (
              <li key={i} className="flex items-baseline gap-4">
                <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="readable-measure text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
                  {point}
                </p>
              </li>
            ))}
          </ol>
          {record.links && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" aria-label={`${record.company} evidence`}>
              {record.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-[color:var(--cs-signal-text)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {/* First screenshot open; the rest of the same tool's walkthrough collapsed.
              Any of them opens the viewer, which steps through all of them. */}
          {record.gallery && record.gallery.length > 0 && (
            <ScreenshotViewer
              shots={record.gallery.map((item) => ({ src: item.image, alt: item.alt }))}
              label={`${record.role} screenshots`}
            >
            <div className="mt-8">
              <GalleryItem item={record.gallery[0]} index={0} />
              {record.gallery.length > 1 && (
                <details className="shot-disclosure group mt-4">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none select-none items-center [-webkit-tap-highlight-color:transparent] gap-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] [&::-webkit-details-marker]:hidden">
                    {/* 1px plus; its stem folds away to a minus when open */}
                    <span aria-hidden="true" className="relative h-2.5 w-2.5 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span className="shot-disclosure-stem absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                    </span>
                    <span className="group-open:hidden">{record.gallery.length - 1} more {record.gallery.length === 2 ? "screenshot" : "screenshots"}</span>
                    <span className="hidden group-open:inline">Hide screenshots</span>
                  </summary>
                  <div className="space-y-8 pt-4">
                    {record.gallery.slice(1).map((item, i) => (
                      <div key={item.image.src} className="shot-disclosure-item" style={{ "--i": i } as CSSProperties}>
                        <GalleryItem item={item} index={i + 1} />
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
            </ScreenshotViewer>
          )}
        </div>
      </div>
    </div>
    </StructuredReveal>
  );
}

function GalleryItem({ item, index }: { item: NonNullable<ExperienceLedgerRecord["gallery"]>[number]; index: number }) {
  return (
    <div>
      <ShotThumb index={index}>
        <ScreenshotFrame src={item.image} alt={item.alt} wide />
      </ShotThumb>
      <p className="mt-2 text-sm text-[color:var(--cs-text-secondary)]">{item.caption}</p>
    </div>
  );
}
