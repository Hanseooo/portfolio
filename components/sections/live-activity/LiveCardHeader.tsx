import { formatClockTime } from "@/lib/activity/formatters";

/** Neutral header for the live cards: live data is a reading zone, so no red field; a black strip instead. */
export default function LiveCardHeader({ label, updatedAt }: { label: string; updatedAt?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-zinc-900 px-4 py-3 dark:bg-zinc-800">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
        <span className="h-1.5 w-1.5 bg-[color:var(--cs-signal)]" aria-hidden="true" />
        {label}
      </p>
      {updatedAt && (
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-zinc-400">
          Updated {formatClockTime(updatedAt)}
        </span>
      )}
    </div>
  );
}
