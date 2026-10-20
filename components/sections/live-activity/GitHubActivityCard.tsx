"use client";

import { memo, type ReactNode } from "react";
import { Lock } from "lucide-react";
import type { ActivityResponse, GitHubActivity } from "@/lib/activity/types";
import { clampText, formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";
import GitHubHeatmap, { HeatmapPlaceholder, getHeatmapSummary } from "./WeeklyActivityBars";
import LiveCardHeader from "./LiveCardHeader";
import { LIVE_LABEL, SKELETON_BAR } from "./labels";

type GitHubActivityProps = {
  payload: ActivityResponse<GitHubActivity> | null;
  loading?: boolean;
  revealed?: boolean;
};

const BIG_NUMBER = "font-[family-name:var(--font-display)] text-[clamp(4.5rem,13vw,10rem)] font-black leading-[0.82] tracking-[-0.02em] text-[color:var(--cs-text-primary)]";
const STREAK_NUMBER = "font-[family-name:var(--font-display)] text-4xl md:text-5xl font-black leading-none text-[color:var(--cs-text-primary)]";

function BandFrame({ children, updatedAt }: { children: ReactNode; updatedAt?: string }) {
  return (
    <section className="relative border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] p-6 shadow-xl md:p-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className={LIVE_LABEL}>
          <span className="text-[color:var(--cs-text-primary)]">GitHub</span> · last 12 months
        </p>
        {updatedAt && (
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            Updated {formatClockTime(updatedAt)}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Streaks({ current, longest }: { current: ReactNode; longest: ReactNode }) {
  return (
    <dl className="flex gap-8 md:gap-12 lg:justify-end">
      <div>
        <dt className={LIVE_LABEL}>Current streak</dt>
        <dd className="mt-2 flex items-baseline gap-1.5">
          <span className={STREAK_NUMBER}>{current}</span>
          <span className="text-sm text-[color:var(--cs-text-secondary)]">days</span>
        </dd>
      </div>
      <div className="border-l border-[color:var(--cs-structural-line)] pl-8 md:pl-12">
        <dt className={LIVE_LABEL}>Longest streak</dt>
        <dd className="mt-2 flex items-baseline gap-1.5">
          <span className={STREAK_NUMBER}>{longest}</span>
          <span className="text-sm text-[color:var(--cs-text-secondary)]">days</span>
        </dd>
      </div>
    </dl>
  );
}

/** Full-width year of contributions: the expressive moment of the live scene. */
function GitHubContributionBandComponent({ payload, loading = false, revealed = false }: GitHubActivityProps) {
  if (loading) {
    return (
      <div aria-busy="true" className="motion-safe:animate-pulse">
        <span className="sr-only">Loading GitHub activity</span>
        <div aria-hidden="true">
          <BandFrame>
            <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className={BIG_NUMBER}><span className={`${SKELETON_BAR} w-[3.5ch]`}>&nbsp;</span></p>
                <p className="mt-3 text-sm">&nbsp;</p>
              </div>
              <div className="lg:col-span-5">
                <Streaks current={<span className={`${SKELETON_BAR} w-10`}>&nbsp;</span>} longest={<span className={`${SKELETON_BAR} w-10`}>&nbsp;</span>} />
              </div>
            </div>
            <div className="mt-10"><HeatmapPlaceholder /></div>
          </BandFrame>
        </div>
      </div>
    );
  }

  const data = payload?.data;
  if (!payload?.ok || !data) {
    return (
      <BandFrame>
        <p className="py-12 text-sm text-[color:var(--cs-text-secondary)]">GitHub activity is unavailable right now.</p>
      </BandFrame>
    );
  }

  const { total } = getHeatmapSummary(data.calendar);

  return (
    <BandFrame updatedAt={payload.updatedAt}>
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className={BIG_NUMBER}>{total.toLocaleString("en-US")}</p>
          <p className="mt-3 text-sm text-[color:var(--cs-text-secondary)]">contributions, private repositories included</p>
        </div>
        <div className="lg:col-span-5">
          <Streaks current={data.stats.currentStreak} longest={data.stats.longestStreak} />
        </div>
      </div>
      {data.calendar.length > 0 && (
        <div className="mt-10">
          <GitHubHeatmap data={data.calendar} revealed={revealed} />
        </div>
      )}
    </BandFrame>
  );
}

const SKELETON_COUNTS = ["PRs opened", "PRs merged", "Issues"];

/** Same frame and line heights as the loaded card, so the region doesn't shift (R2-5). */
function GitHubActivitySkeleton() {
  return (
    <article aria-busy="true" className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] shadow-xl motion-safe:animate-pulse">
      <LiveCardHeader label="Recent work" />
      <span className="sr-only">Loading GitHub activity</span>
      <div aria-hidden="true" className="p-4 md:p-6 flex flex-col gap-8">
        <div className="grid grid-cols-3 divide-x divide-[color:var(--cs-structural-line)]">
          {SKELETON_COUNTS.map((label, index) => (
            <div key={label} className={index === 0 ? "px-0 pr-4" : "px-4"}>
              <p className={LIVE_LABEL}>{label}</p>
              <p className="mt-1 text-xl font-medium">
                <span className={`${SKELETON_BAR} w-8`}>&nbsp;</span>
              </p>
            </div>
          ))}
        </div>
        <div className="h-52 border-t border-[color:var(--cs-structural-line)] pt-6">
          <p className={`mb-4 ${LIVE_LABEL}`}>Recent commits</p>
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((row) => (
              <div key={row} className="border-l-2 border-[color:var(--cs-structural-line)] pl-3">
                <p className="text-sm leading-relaxed"><span className={`${SKELETON_BAR} w-3/4`}>&nbsp;</span></p>
                <p className="mt-0.5 text-[10px]"><span className={`${SKELETON_BAR} w-24`}>&nbsp;</span></p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className={`mb-3 ${LIVE_LABEL}`}>Top languages</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2].map((chip) => (
              <span key={chip} className="inline-flex min-h-9 w-28 border border-[color:var(--cs-structural-line)]" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full mt-auto border-t border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-6 py-4">
        <p className="text-xs">&nbsp;</p>
      </div>
    </article>
  );
}

function GitHubActivityCard({ payload, loading = false }: GitHubActivityProps) {
  if (loading) return <GitHubActivitySkeleton />;

  const data = payload?.data;
  // The band above already says GitHub is unavailable; don't repeat it.
  if (!payload?.ok || !data) return null;

  return (
    <article className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] shadow-xl">
      <LiveCardHeader label="Recent work" />

      <div className="p-4 md:p-6 flex flex-col gap-8">
        <div className="grid grid-cols-3 divide-x divide-[color:var(--cs-structural-line)]">
          <div className="px-0 pr-4">
            <p className={LIVE_LABEL}>PRs opened</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.prOpened}</p>
          </div>
          <div className="px-4">
            <p className={LIVE_LABEL}>PRs merged</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.prMerged}</p>
          </div>
          <div className="px-4">
            <p className={LIVE_LABEL}>Issues</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.issuesOpened}</p>
          </div>
        </div>

        {data.commits.length > 0 && (
          <div data-lenis-prevent className="max-h-52 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-[color:var(--cs-structural-line)] pt-6">
            <p className={`mb-4 ${LIVE_LABEL}`}>Recent commits</p>
            <ul className="grid grid-cols-1 gap-y-4">
              {data.commits.slice(0, 6).map((commit, index) => (
                <li key={`${commit.url ?? commit.repo}-${commit.committedAt}-${index}`}>
                  {commit.isPrivate ? (
                    <div className="border-l-2 border-[color:var(--cs-structural-line)] pl-3">
                      <p className="text-sm font-bold leading-relaxed text-[color:var(--cs-text-primary)]">
                        {clampText(commit.message, 100)}
                      </p>
                      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                        Private · {formatRelativeTime(commit.committedAt)}
                      </p>
                    </div>
                  ) : (
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block border-l-2 border-transparent pl-3 transition-colors hover:border-[color:var(--cs-signal)]"
                    >
                      <p className="text-sm font-bold leading-relaxed text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                        {clampText(commit.message, 100)}
                      </p>
                      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                        {commit.repo} · {formatRelativeTime(commit.committedAt)}
                      </p>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.topLanguages.length > 0 && (
          <div>
            <p className={`mb-3 ${LIVE_LABEL}`}>Top languages</p>
            <div className="flex flex-wrap gap-2">
              {data.topLanguages.map((lang) => (
                <span
                  key={lang.name}
                  className="inline-flex min-h-9 items-center gap-2 border border-[color:var(--cs-structural-line)] px-3 text-xs text-[color:var(--cs-text-primary)]"
                >
                  {lang.name}
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">{lang.ratio}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full mt-auto border-t border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-6 py-4">
        <p className="flex items-center gap-2 text-xs text-[color:var(--cs-text-secondary)]">
          <Lock size={12} aria-hidden="true" />
          Counts include private repositories
        </p>
      </div>
    </article>
  );
}

export const GitHubContributionBand = memo(GitHubContributionBandComponent);
export default memo(GitHubActivityCard);
