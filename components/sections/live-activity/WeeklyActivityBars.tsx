"use client";

import { useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import type { GitHubActivity } from "@/lib/activity/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type GitHubHeatmapProps = {
  data: GitHubActivity["calendar"];
  /** Set once the scene is in view; plays the column stagger. */
  revealed?: boolean;
};

type Day = NonNullable<GitHubActivity["calendar"][number]["days"][number]>;

// Weeks shown per breakpoint. Must match the --hm-weeks values in globals.css.
const VISIBLE_WEEKS = { base: 18, sm: 30 } as const;

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function formatDate(date: string, withYear = true) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

/** Hides older weeks on narrow screens so cells keep a readable size. */
function ageClass(age: number) {
  return cn(age >= VISIBLE_WEEKS.base && "hm-old-base", age >= VISIBLE_WEEKS.sm && "hm-old-sm");
}

function WeekSpanLabel({ total }: { total: number }) {
  return (
    <>
      <span className="sm:hidden">{Math.min(total, VISIBLE_WEEKS.base)} weeks</span>
      <span className="hidden sm:inline lg:hidden">{Math.min(total, VISIBLE_WEEKS.sm)} weeks</span>
      <span className="hidden lg:inline">{total} weeks</span>
    </>
  );
}

export function getHeatmapSummary(data: GitHubHeatmapProps["data"]) {
  const days = data.flatMap((week) => week.days).filter((day): day is Day => day !== null);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const busiest = days.reduce<Day | null>((best, day) => (!best || day.count > best.count ? day : best), null);
  return { total, busiest: busiest && busiest.count > 0 ? busiest : null };
}

export default function GitHubHeatmap({ data, revealed = false }: GitHubHeatmapProps) {
  const [active, setActive] = useState<{ date: string; count: string; x: number; y: number; size: number } | null>(null);
  if (data.length === 0) return null;

  const { total, busiest } = getHeatmapSummary(data);
  const busiestWeekday = busiest ? new Date(`${busiest.date}T00:00:00Z`).getUTCDay() : -1;
  const summary = `${total.toLocaleString()} contributions in the last ${data.length} weeks.${busiest ? ` Busiest day ${formatDate(busiest.date)}, ${busiest.count} contributions.` : ""}`;

  function showDay(event: PointerEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (!cell?.dataset.date) { setActive(null); return; }
    const rect = cell.getBoundingClientRect();
    const grid = event.currentTarget.getBoundingClientRect();
    setActive({ date: cell.dataset.date, count: cell.dataset.count ?? "0", x: rect.left - grid.left, y: rect.top - grid.top, size: rect.width });
  }

  return (
    <figure className="github-heatmap text-[color:var(--cs-text-secondary)]" data-reveal={revealed ? "on" : undefined}>
      <div className="relative overflow-hidden px-1 pt-1 pb-2">
        <div
          className="hm-weeks"
          role="img"
          aria-label={summary}
          onPointerOver={showDay}
          onClick={showDay}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setActive(null); }}
        >
          <div className="hm-week hm-weekday-col" aria-hidden="true">
            <span />
            {WEEKDAY_LABELS.map((label, index) => <span key={index} className="hm-weekday">{label}</span>)}
          </div>
          {data.map((week, index) => {
            const monthChanged = index === 0 || week.start.slice(0, 7) !== data[index - 1].start.slice(0, 7);
            const hasBusiest = busiest !== null && week.days.some((day) => day?.date === busiest.date);
            return (
              <div
                key={week.start}
                aria-hidden="true"
                className={cn("hm-week", ageClass(data.length - 1 - index))}
                style={{ "--w": index } as CSSProperties}
              >
                <span className="hm-month">
                  {monthChanged && index > 0 ? formatDate(week.start, false).split(" ")[0] : ""}
                </span>
                {week.days.map((day, dayIndex) => {
                  const isBusiest = day !== null && day.date === busiest?.date;
                  return (
                    <span
                      key={dayIndex}
                      data-date={day?.date}
                      data-count={day?.count}
                      data-busiest={isBusiest ? "" : undefined}
                      data-row-mark={!isBusiest && dayIndex === busiestWeekday ? "" : undefined}
                      data-col-mark={!isBusiest && hasBusiest ? "" : undefined}
                      className="hm-cell"
                      style={{ backgroundColor: day ? `var(--hm-${day.level})` : "transparent" }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <Tooltip open={active !== null} onOpenChange={(open) => { if (!open) setActive(null); }}>
          <TooltipTrigger asChild>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ left: (active?.x ?? 0) + 4, top: (active?.y ?? 0) + 4, width: active?.size ?? 0, height: active?.size ?? 0 }}
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-reading-surface)] px-2 py-1 text-xs text-[color:var(--cs-text-primary)]">
            {active && `${active.count} contributions · ${formatDate(active.date)}`}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Dimension line: spans exactly the visible weeks. */}
      <div className="hm-dimension mt-3 font-[family-name:var(--font-mono)] text-[10px]" aria-hidden="true">
        <span className="hm-dimension-rule" />
        <span className="px-3"><WeekSpanLabel total={data.length} /></span>
        <span className="hm-dimension-rule" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-xs">
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map((level) => <span key={level} className="h-[11px] w-[11px] rounded-[1px]" style={{ backgroundColor: `var(--hm-${level})` }} />)}
          <span className="ml-1">More</span>
        </div>
        <figcaption className="flex items-center gap-2">
          {busiest && <span className="hm-busiest-key" aria-hidden="true" />}
          <span className="sr-only">{summary}</span>
          {busiest && (
            <span aria-hidden="true">
              Busiest day{" "}
              <span className="font-[family-name:var(--font-mono)] text-[color:var(--cs-text-primary)]">
                {formatDate(busiest.date)} · {busiest.count}
              </span>
            </span>
          )}
        </figcaption>
      </div>
    </figure>
  );
}

/** Same week structure, dimension line, and legend as the loaded heatmap (R2-5). */
export function HeatmapPlaceholder({ weeks = 53 }: { weeks?: number }) {
  return (
    <div className="github-heatmap" aria-hidden="true">
      <div className="relative overflow-hidden px-1 pt-1 pb-2">
        <div className="hm-weeks">
          <div className="hm-week hm-weekday-col">
            <span />
            {WEEKDAY_LABELS.map((label, index) => <span key={index} className="hm-weekday">{label ? " " : ""}</span>)}
          </div>
          {Array.from({ length: weeks }, (_, index) => (
            <div key={index} className={cn("hm-week", ageClass(weeks - 1 - index))}>
              <span className="hm-month">&nbsp;</span>
              {Array.from({ length: 7 }, (_, day) => (
                <span key={day} className="hm-cell" style={{ backgroundColor: "var(--hm-0)" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="hm-dimension mt-3 font-[family-name:var(--font-mono)] text-[10px]">
        <span className="hm-dimension-rule" />
        <span className="px-3">&nbsp;</span>
        <span className="hm-dimension-rule" />
      </div>
      {/* Invisible copy of the loaded legend so it wraps the same way on narrow screens. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-xs text-transparent select-none">
        <div className="flex items-center gap-1">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map((level) => <span key={level} className="h-[11px] w-[11px]" />)}
          <span className="ml-1">More</span>
        </div>
        <span className="flex items-center gap-2">
          <span className="hm-busiest-key invisible" />
          Busiest day <span className="font-[family-name:var(--font-mono)]">Mmm 00, 0000 · 00</span>
        </span>
      </div>
    </div>
  );
}
