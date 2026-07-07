"use client";

import { memo, useState } from "react";
import { ArrowRight, Lock, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ActivityResponse, GitHubActivity } from "@/lib/activity/types";
import { clampText, formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";
import GitHubHeatmap from "./WeeklyActivityBars";

type GitHubActivityCardProps = {
  payload: ActivityResponse<GitHubActivity> | null;
  loading?: boolean;
};

function LoadingState() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`py-2 lg:px-4 lg:py-0 ${i === 3 ? 'min-[500px]:col-span-2 lg:col-span-1 border-t lg:border-t-0 border-border' : ''}`}>
            <div className="h-3 w-24 bg-foreground/10 mb-3" />
            <div className="h-8 w-16 bg-foreground/10" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-3 divide-y min-[500px]:divide-y-0 min-[500px]:divide-x divide-border mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-2 lg:px-4 lg:py-0">
            <div className="h-3 w-20 bg-foreground/10 mb-3" />
            <div className="h-7 w-12 bg-foreground/10" />
          </div>
        ))}
      </div>
      <div className="py-4 mt-2">
        <div className="h-3 w-32 bg-foreground/10 mb-4" />
        <div className="h-32 w-full bg-foreground/10 rounded-md" />
      </div>
    </div>
  );
}

function GitHubActivityCard({
  payload,
  loading = false,
}: GitHubActivityCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const data = payload?.data;
  const calendar = data?.calendar ?? [];

  return (
    <article className="border-t border-white/10 bg-transparent py-6">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            GitHub Activity
          </h3>
          <p className="mt-1 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
            {currentYear} Year-To-Date
          </p>
        </div>
        <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      {loading ? <LoadingState /> : null}

      {!loading && payload && !payload.ok ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{payload.error?.message ?? "GitHub activity is temporarily unavailable."}</p>
        </div>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="py-2 lg:px-4 lg:py-0">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Current Streak</p>
              <p className="mt-2 text-2xl font-black text-foreground">{data.stats.currentStreak}</p>
            </div>
            <div className="py-2 lg:px-4 lg:py-0">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Longest Streak</p>
              <p className="mt-2 text-2xl font-black text-foreground">{data.stats.longestStreak}</p>
            </div>
            <div className="py-2 lg:px-4 lg:py-0 min-[500px]:col-span-2 lg:col-span-1 border-t lg:border-t-0 border-border">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Total Contributions</p>
              <p className="mt-2 text-2xl font-black text-primary">{data.stats.totalContributions}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-3 divide-y min-[500px]:divide-y-0 min-[500px]:divide-x divide-border mt-8">
            <div className="py-2 lg:px-4 lg:py-0">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">PR Opened</p>
              <p className="mt-2 text-xl font-bold text-foreground">{data.stats.prOpened}</p>
            </div>
            <div className="py-2 lg:px-4 lg:py-0">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">PR Merged</p>
              <p className="mt-2 text-xl font-bold text-foreground">{data.stats.prMerged}</p>
            </div>
            <div className="py-2 lg:px-4 lg:py-0">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Issues Opened</p>
              <p className="mt-2 text-xl font-bold text-foreground">{data.stats.issuesOpened}</p>
            </div>
          </div>

          {calendar.length > 0 ? (
            <div className="py-4">
              <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                140-Day Heatmap
              </p>
              <GitHubHeatmap data={calendar} />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6">
            <p className="inline-flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              <Lock size={12} aria-hidden="true" />
              Includes private activity
            </p>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group inline-flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:text-primary focus-visible:outline-none"
                >
                  View details
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </DialogTrigger>
              <DialogContent className="flex h-[min(82vh,44rem)] w-[min(92vw,48rem)] max-w-3xl flex-col overflow-hidden p-0">
                <DialogHeader>
                  <DialogTitle className="px-6 pb-4 pt-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    GitHub Activity Details
                  </DialogTitle>
                </DialogHeader>

                <div data-lenis-prevent className="scrollbar-live min-h-0 flex-1 space-y-8 overflow-y-auto px-6 pb-6 pt-1">
                  <div>
                    <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                      Top Languages
                    </p>
                    {data.topLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.topLanguages.map((language) => (
                          <span
                            key={language.name}
                            className="inline-flex min-h-9 items-center rounded-none border border-border bg-transparent px-3 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80 transition-all duration-300 hover:border-primary grayscale hover:grayscale-0"
                          >
                            {language.name} ({language.ratio}%)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/75">No language data available.</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                      Recent Commits
                    </p>
                    {data.commits.length > 0 ? (
                      <ul className="space-y-4">
                        {data.commits.slice(0, 8).map((commit, index) => (
                          <li key={`${commit.url || commit.repo}-${commit.committedAt}-${index}`} className="pl-0">
                            {commit.isPrivate ? (
                              <div className="block">
                                <p className="text-sm leading-relaxed text-foreground/85">
                                  {clampText(commit.message, 110)}
                                </p>
                                <p className="mt-1 text-xs text-foreground/70">
                                  Private repo · {formatRelativeTime(commit.committedAt)}
                                </p>
                              </div>
                            ) : (
                              <a
                                href={commit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                              >
                                <p className="text-sm leading-relaxed text-foreground/85 group-hover:text-primary">
                                  {clampText(commit.message, 110)}
                                </p>
                                <p className="mt-1 text-xs text-foreground/70">
                                  {commit.repo} · {formatRelativeTime(commit.committedAt)}
                                </p>
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/75">No recent commits found.</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                      Active Repositories
                    </p>
                    {data.activeRepos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.activeRepos.map((repo, index) => (
                          repo.isPrivate ? (
                            <span
                              key={`${repo.name}-${repo.recentCommitCount}-${index}`}
                              className="inline-flex min-h-9 items-center border border-border px-3 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80 grayscale opacity-60"
                            >
                              Private repo
                            </span>
                          ) : (
                            <a
                              key={`${repo.name}-${repo.recentCommitCount}-${index}`}
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-9 items-center border border-border px-3 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80 transition-all duration-300 hover:border-primary hover:text-primary grayscale hover:grayscale-0"
                            >
                              {repo.name}
                            </a>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/75">No active repositories found.</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default memo(GitHubActivityCard);
