// components/routes/ExperienceCareerRecord.tsx
import StructuredReveal from "@/components/motion/StructuredReveal";
import ScreenshotFrame from "@/components/evidence/ScreenshotFrame";
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
        {/* Metadata rail — 4 columns on desktop */}
        <div className="md:col-span-4">
          {/* Record index */}
          <span className="mb-3 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            {String(record.position).padStart(2, "0")}
          </span>

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
          {record.gallery && (
            <div className="mt-8 space-y-8">
              {record.gallery.map((item) => (
                <div key={item.image.src}>
                  <ScreenshotFrame src={item.image} alt={item.alt} wide />
                  <p className="mt-2 text-sm text-[color:var(--cs-text-secondary)]">{item.caption}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </StructuredReveal>
  );
}
