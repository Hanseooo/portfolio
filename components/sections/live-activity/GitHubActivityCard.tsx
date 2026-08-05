"use client";

import { memo } from "react";
import { Lock } from "lucide-react";
import type { ActivityResponse, GitHubActivity } from "@/lib/activity/types";
import { clampText, formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";
import GitHubHeatmap from "./WeeklyActivityBars";

type GitHubActivityCardProps = {
  payload: ActivityResponse<GitHubActivity> | null;
  loading?: boolean;
};

function GitHubActivityCard({
  payload,
  loading = false,
}: GitHubActivityCardProps) {
  const currentYear = new Date().getFullYear();
  const data = payload?.data;
  const calendar = data?.calendar ?? [];

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          Loading GitHub activity…
        </p>
      </div>
    );
  }

  if (payload && !payload.ok) {
    return (
      <div className="py-4">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-error)]">
          {payload.error?.message ?? "GitHub activity temporarily unavailable."}
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <article className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-white/5 dark:bg-black/20 backdrop-blur-sm isolate">
      {/* Editorial Header */}
      <div className="flex items-center justify-between gap-2 bg-[color:var(--cs-signal)] dark:bg-zinc-800 px-4 py-3 text-white">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/90">
          LIVE GITHUB FEED · {currentYear}
        </p>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/60">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-8">
        {/* Key stats (Macro Typography) */}
        <div className="grid grid-cols-3 divide-x divide-[color:var(--cs-structural-line)] border-b border-[color:var(--cs-structural-line)] pb-6">
          <div className="px-0 pr-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Current Streak
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-black uppercase text-[color:var(--cs-text-primary)]">
              {data.stats.currentStreak}
            </p>
          </div>
          <div className="px-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Longest
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-black uppercase text-[color:var(--cs-text-primary)]">
              {data.stats.longestStreak}
            </p>
          </div>
          <div className="px-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Commits
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-black uppercase text-[color:var(--cs-signal-text)]">
              {data.stats.totalContributions}
            </p>
          </div>
        </div>

        {/* PR / Issues stats */}
        <div className="grid grid-cols-3 divide-x divide-[color:var(--cs-structural-line)]">
          <div className="px-0 pr-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">PR Opened</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.prOpened}</p>
          </div>
          <div className="px-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">PR Merged</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.prMerged}</p>
          </div>
          <div className="px-4">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">Issues</p>
            <p className="mt-1 text-xl font-medium text-[color:var(--cs-text-primary)]">{data.stats.issuesOpened}</p>
          </div>
        </div>

        {/* Heatmap */}
        {calendar.length > 0 && (
          <div>
            <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Historical Data // 140-Day Activity
            </p>
            <GitHubHeatmap data={calendar} />
          </div>
        )}

        {/* Recent commits */}
        {data.commits.length > 0 && (
          <div data-lenis-prevent className="max-h-52 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-[color:var(--cs-structural-line)] pt-6">
            <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Recent Commits
            </p>
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

        {/* Top languages */}
        {data.topLanguages.length > 0 && (
          <div>
            <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Top Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {data.topLanguages.map((lang) => (
                <span
                  key={lang.name}
                  className="inline-flex min-h-9 items-center border border-[color:var(--cs-structural-line)] px-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:border-[color:var(--cs-signal)] hover:text-[color:var(--cs-signal)]"
                >
                  {lang.name} ({lang.ratio}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full mt-auto border-t border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-6 py-4">
        <p className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          <Lock size={10} aria-hidden="true" />
          Includes private activity
        </p>
      </div>
    </article>
  );
}

export default memo(GitHubActivityCard);
