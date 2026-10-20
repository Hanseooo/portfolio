import { formatClockTime } from "@/lib/activity/formatters";

/** Neutral header for the live cards: live data is a reading zone (R3 §3), so no red field. */
export default function LiveCardHeader({ label, updatedAt }: { label: string; updatedAt?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[color:var(--cs-structural-line-strong)] px-4 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--cs-text-primary)]">
        <span className="h-1.5 w-1.5 bg-[color:var(--cs-signal)]" aria-hidden="true" />
        {label}
      </p>
      {updatedAt && (
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          Updated {formatClockTime(updatedAt)}
        </span>
      )}
    </div>
  );
}
