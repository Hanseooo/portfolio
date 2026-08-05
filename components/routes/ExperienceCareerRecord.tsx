// components/routes/ExperienceCareerRecord.tsx
import StructuredReveal from "@/components/motion/StructuredReveal";
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
        </div>
      </div>
    </div>
    </StructuredReveal>
  );
}
