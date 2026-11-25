import { ArrowUpRight } from "lucide-react";
import { formatClockTime } from "@/lib/activity/formatters";

/** Neutral header for the live cards: live data is a reading zone, so no red field; a black strip instead. */
export default function LiveCardHeader({
  label,
  updatedAt,
  link,
}: {
  label: string;
  updatedAt?: string;
  /** External profile link on the right, e.g. the GitHub profile */
  link?: { label: string; href: string };
}) {
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
      {link && (
        // -my-3 keeps the 44px target from growing the strip.
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group -my-3 inline-flex min-h-11 items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
        >
          {link.label}
          <ArrowUpRight size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}
