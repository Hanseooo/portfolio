"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ActivityResponse, GitHubActivity } from "@/lib/activity/types";
import { clampText, formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";
import WeeklyActivityBars from "./WeeklyActivityBars";

type GitHubActivityCardProps = {
  payload: ActivityResponse<GitHubActivity> | null;
  loading?: boolean;
};

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-44 bg-foreground/10" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-foreground/10" />
        <div className="h-3 w-11/12 bg-foreground/10" />
        <div className="h-3 w-10/12 bg-foreground/10" />
      </div>
      <div className="h-16 w-full bg-foreground/10" />
    </div>
  );
}

export default function GitHubActivityCard({
  payload,
  loading = false,
}: GitHubActivityCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const data = payload?.data;
  const weekly = data?.weeklyActivity ?? [];

  return (
    <article className="rounded-xl border border-foreground/20 bg-background/90 p-5 shadow-primary-sharp sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/70">Live Signals</p>
          <h3 className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
            GitHub Activity ({currentYear})
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-foreground/65">Year-to-date metrics</p>
        </div>
        <span className="text-xs text-foreground/70">
          {payload?.updatedAt ? `Updated ${formatClockTime(payload.updatedAt)}` : "Not updated"}
        </span>
      </div>

      {loading ? <LoadingState /> : null}

      {!loading && payload && !payload.ok ? (
        <p className="text-sm text-foreground/75">
          {payload.error?.message ?? "GitHub activity is temporarily unavailable."}
        </p>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-2 min-[500px]:grid-cols-2 lg:grid-cols-3">
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:p-3">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">Current Streak</p>
              <p className="mt-1 text-lg font-semibold text-foreground/90">{data.stats.currentStreak}</p>
            </div>
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:p-3">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">Longest Streak</p>
              <p className="mt-1 text-lg font-semibold text-foreground/90">{data.stats.longestStreak}</p>
            </div>
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:col-span-2 min-[500px]:p-3 lg:col-span-1">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">Total Contributions</p>
              <p className="mt-1 text-lg font-semibold text-foreground/90">{data.stats.totalContributions}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 min-[500px]:grid-cols-3">
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:p-3">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">PR Opened</p>
              <p className="mt-1 text-base font-semibold text-foreground/90">{data.stats.prOpened}</p>
            </div>
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:p-3">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">PR Merged</p>
              <p className="mt-1 text-base font-semibold text-foreground/90">{data.stats.prMerged}</p>
            </div>
            <div className="border border-foreground/15 bg-background/70 p-2.5 min-[500px]:p-3">
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-foreground/70">Issues Opened</p>
              <p className="mt-1 text-base font-semibold text-foreground/90">{data.stats.issuesOpened}</p>
            </div>
          </div>

          {weekly.length > 0 ? (
            <div className="border border-foreground/15 bg-background/70 p-3">
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.16em] text-foreground/70">
                Weekly Activity
              </p>
              <WeeklyActivityBars data={weekly} />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-1">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-foreground/70">
              <Lock size={13} aria-hidden="true" />
              Includes private activity
            </p>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center border border-foreground/25 px-4 text-xs uppercase tracking-[0.12em] text-foreground/85 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View details
                </button>
              </DialogTrigger>
              <DialogContent className="flex h-[min(82vh,44rem)] w-[min(92vw,48rem)] max-w-3xl flex-col overflow-hidden p-0">
                <DialogHeader>
                  <DialogTitle className="border-b border-foreground/15 px-6 pb-4 pt-6 text-sm uppercase tracking-[0.2em] text-foreground/75">
                    GitHub Activity Details
                  </DialogTitle>
                </DialogHeader>

                <div className="scrollbar-live min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-6 pt-1">
                  <div>
                    <p className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                      Top Languages
                    </p>
                    {data.topLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.topLanguages.map((language) => (
                          <span
                            key={language.name}
                            className="inline-flex min-h-9 items-center rounded-full border border-foreground/20 bg-background/65 px-3 text-xs uppercase tracking-[0.08em] text-foreground/80"
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
                    <p className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                      Recent Commits
                    </p>
                    {data.commits.length > 0 ? (
                      <ul className="space-y-3">
                        {data.commits.slice(0, 8).map((commit, index) => (
                          <li key={`${commit.url || commit.repo}-${commit.committedAt}-${index}`} className="border-l border-foreground/20 pl-3">
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

                  <div>
                    <p className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                      Active Repositories
                    </p>
                    {data.activeRepos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.activeRepos.map((repo, index) => (
                          repo.isPrivate ? (
                            <span
                              key={`${repo.name}-${repo.recentCommitCount}-${index}`}
                              className="inline-flex min-h-9 items-center rounded-full border border-foreground/20 bg-background/65 px-3 text-xs uppercase tracking-[0.08em] text-foreground/80"
                            >
                              Private repo
                            </span>
                          ) : (
                            <a
                              key={`${repo.name}-${repo.recentCommitCount}-${index}`}
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-9 items-center rounded-full border border-foreground/20 bg-background/65 px-3 text-xs uppercase tracking-[0.08em] text-foreground/80 transition hover:border-primary hover:text-primary"
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
