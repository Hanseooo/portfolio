import { ActivityConfigError, getGitHubEnv } from "@/lib/activity/env";
import type {
  ActivityErrorCode,
  ActivityResponse,
  GitHubActivity,
} from "@/lib/activity/types";

type GraphqlError = {
  message: string;
};

type QueryAResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              weekday: number;
              contributionCount: number;
            }>;
          }>;
        };
        commitContributionsByRepository?: Array<{
          repository: {
            nameWithOwner: string;
            url: string;
            isPrivate: boolean;
          };
          contributions: {
            totalCount: number;
          };
        }>;
        pullRequestContributionsByRepository?: Array<{
          contributions: {
            totalCount: number;
          };
        }>;
        issueContributionsByRepository?: Array<{
          contributions: {
            totalCount: number;
          };
        }>;
      };
    };
    mergedPullRequests?: {
      issueCount: number;
    };
  };
  errors?: GraphqlError[];
};

type QueryBResponse = {
  data?: {
    user?: {
      repositories?: {
        nodes?: Array<{
          nameWithOwner: string;
          url: string;
          isPrivate: boolean;
          defaultBranchRef?: {
            target?: {
              history?: {
                nodes?: Array<{
                  messageHeadline: string;
                  url: string;
                  committedDate: string;
                  author?: {
                    user?: {
                      login?: string | null;
                    } | null;
                  };
                } | null>;
              };
            } | null;
          } | null;
          languages?: {
            edges?: Array<{
              size: number;
              node: {
                name: string;
              };
            }>;
          };
        } | null>;
      };
    };
  };
  errors?: GraphqlError[];
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const weekDayMap: Record<number, GitHubActivity["weeklyActivity"][number]["day"]> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
const weekOrder: GitHubActivity["weeklyActivity"][number]["day"][] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];
const activityTimezone = "Asia/Manila";

const statsQuery = `
  query GitHubActivityStats($username: String!, $from: DateTime!, $mergedQuery: String!) {
    user(login: $username) {
      contributionsCollection(from: $from) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 8) {
          repository {
            nameWithOwner
            url
            isPrivate
          }
          contributions(first: 1) {
            totalCount
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 25) {
          contributions(first: 1) {
            totalCount
          }
        }
        issueContributionsByRepository(maxRepositories: 25) {
          contributions(first: 1) {
            totalCount
          }
        }
      }
    }
    mergedPullRequests: search(type: ISSUE, query: $mergedQuery, first: 1) {
      issueCount
    }
  }
`;

const repositoryQuery = `
  query GitHubActivityRepos($username: String!, $from: GitTimestamp!) {
    user(login: $username) {
      repositories(
        first: 12
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          nameWithOwner
          url
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 12, since: $from) {
                  nodes {
                    messageHeadline
                    url
                    committedDate
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

function buildErrorResponse(
  code: ActivityErrorCode,
  message: string
): ActivityResponse<GitHubActivity> {
  return {
    ok: false,
    source: "fallback",
    updatedAt: new Date().toISOString(),
    data: null,
    error: {
      code,
      message,
    },
  };
}

function getErrorCode(message: string): ActivityErrorCode {
  const normalized = message.toLowerCase();
  if (normalized.includes("rate limit")) return "rate_limited";
  if (normalized.includes("bad credentials") || normalized.includes("resource not accessible")) {
    return "auth_failed";
  }
  return "provider_unavailable";
}

async function runQuery<T>(
  token: string,
  query: string,
  variables: Record<string, string>
): Promise<{ ok: true; payload: T } | { ok: false; code: ActivityErrorCode; message: string }> {
  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { ok: false, code: "auth_failed", message: "GitHub token authentication failed." };
      }
      if (response.status === 403 || response.status === 429) {
        return { ok: false, code: "rate_limited", message: "GitHub activity temporarily rate-limited." };
      }
      return {
        ok: false,
        code: "provider_unavailable",
        message: "GitHub activity is temporarily unavailable.",
      };
    }

    const payload = (await response.json()) as { errors?: GraphqlError[] } & T;
    if (payload.errors?.length) {
      const code = getErrorCode(payload.errors[0].message);
      if (code === "auth_failed") {
        return { ok: false, code, message: "GitHub activity access is not authorized." };
      }
      if (code === "rate_limited") {
        return { ok: false, code, message: "GitHub activity temporarily rate-limited." };
      }
      return {
        ok: false,
        code: "provider_unavailable",
        message: "GitHub activity is temporarily unavailable.",
      };
    }

    return { ok: true, payload };
  } catch {
    return {
      ok: false,
      code: "provider_unavailable",
      message: "GitHub activity is temporarily unavailable.",
    };
  }
}

function getCalendarActivity(
  weeks:
    | Array<{
        contributionDays: Array<{
          date?: string;
          weekday: number;
          contributionCount: number;
        }>;
      }>
    | undefined
): GitHubActivity["calendar"] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: activityTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const todayInTimezone = `${year ?? "0000"}-${month ?? "00"}-${day ?? "00"}`;

  const allDays = (weeks ?? [])
    .flatMap((week) => week.contributionDays)
    .filter((day) => typeof day.date === "string")
    .filter((day) => (day.date ?? "") <= todayInTimezone)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  if (allDays.length === 0) {
    return [];
  }

  // Get the last 140 days (20 weeks x 7 days) to fit nicely in a heatmap
  const recentDays = allDays.slice(-140);
  
  return recentDays.map((day) => {
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    const count = day.contributionCount;
    if (count > 0) level = 1;
    if (count >= 3) level = 2;
    if (count >= 6) level = 3;
    if (count >= 10) level = 4;
    
    return {
      date: day.date || "",
      count,
      level,
    };
  });
}

function getStreakStats(
  weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> | undefined
) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: activityTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const todayInTimezone = `${year ?? "0000"}-${month ?? "00"}-${day ?? "00"}`;

  const allDays = (weeks ?? [])
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.date <= todayInTimezone)
    .sort((a, b) => a.date.localeCompare(b.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  allDays.forEach((day) => {
    if (day.contributionCount > 0) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
      return;
    }

    runningStreak = 0;
  });

  let startIndex = allDays.length - 1;
  while (startIndex >= 0 && allDays[startIndex].contributionCount === 0) {
    startIndex -= 1;
  }

  for (let index = startIndex; index >= 0; index -= 1) {
    if (allDays[index].contributionCount > 0) {
      currentStreak += 1;
      continue;
    }
    break;
  }

  return { currentStreak, longestStreak };
}

function getTopLanguages(
  repositories:
    | Array<{
        languages?: {
          edges?: Array<{
            size: number;
            node: { name: string };
          }>;
        };
      } | null>
    | undefined
): GitHubActivity["topLanguages"] {
  const totals = new Map<string, number>();

  (repositories ?? []).forEach((repo) => {
    repo?.languages?.edges?.forEach((entry) => {
      const current = totals.get(entry.node.name) ?? 0;
      totals.set(entry.node.name, current + entry.size);
    });
  });

  const ranked = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const totalSize = ranked.reduce((sum, [, size]) => sum + size, 0);
  if (totalSize === 0) return [];

  return ranked.map(([name, size]) => ({
    name,
    ratio: Number(((size / totalSize) * 100).toFixed(1)),
  }));
}

function emptyData(): GitHubActivity {
  return {
    commits: [],
    activeRepos: [],
    stats: {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      prOpened: 0,
      prMerged: 0,
      issuesOpened: 0,
    },
    topLanguages: [],
    calendar: [],
  };
}

export async function getGitHubActivity(): Promise<ActivityResponse<GitHubActivity>> {
  try {
    const { token, username } = getGitHubEnv();
    const from = new Date(new Date().getFullYear(), 0, 1).toISOString();

    const [statsResult, repoResult] = await Promise.all([
      runQuery<QueryAResponse>(token, statsQuery, {
        username,
        from,
        mergedQuery: `author:${username} is:pr is:merged merged:>=${from.slice(0, 10)}`,
      }),
      runQuery<QueryBResponse>(token, repositoryQuery, {
        username,
        from,
      }),
    ]);

    if (!statsResult.ok && !repoResult.ok) {
      return buildErrorResponse(statsResult.code, statsResult.message);
    }

    const base = emptyData();

    if (statsResult.ok) {
      const user = statsResult.payload.data?.user;
      const calendar = user?.contributionsCollection?.contributionCalendar;
      const streaks = getStreakStats(calendar?.weeks);

      base.calendar = getCalendarActivity(calendar?.weeks);
      base.stats = {
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        totalContributions: calendar?.totalContributions ?? 0,
        prOpened:
          user?.contributionsCollection?.pullRequestContributionsByRepository?.reduce(
            (sum, repo) => sum + repo.contributions.totalCount,
            0
          ) ?? 0,
        prMerged: statsResult.payload.data?.mergedPullRequests?.issueCount ?? 0,
        issuesOpened:
          user?.contributionsCollection?.issueContributionsByRepository?.reduce(
            (sum, repo) => sum + repo.contributions.totalCount,
            0
          ) ?? 0,
      };

      base.activeRepos =
        user?.contributionsCollection?.commitContributionsByRepository
          ?.map((entry) => ({
            name: entry.repository.isPrivate ? "Private repo" : entry.repository.nameWithOwner,
            url: entry.repository.isPrivate ? "" : entry.repository.url,
            isPrivate: entry.repository.isPrivate,
            recentCommitCount: entry.contributions.totalCount,
          }))
          .sort((a, b) => b.recentCommitCount - a.recentCommitCount)
          .slice(0, 6) ?? [];
    }

    if (repoResult.ok) {
      const repos = repoResult.payload.data?.user?.repositories?.nodes ?? [];
      const normalizedLogin = username.toLowerCase();

      base.topLanguages = getTopLanguages(repos);

      base.commits = repos
        .flatMap((repo) => {
          if (!repo) return [];
          const history = repo.defaultBranchRef?.target?.history?.nodes ?? [];

          return history
            .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
            .filter((entry) => {
              const authorLogin = entry.author?.user?.login?.toLowerCase();
              return authorLogin === normalizedLogin;
            })
            .map((entry) => ({
              repo: repo.isPrivate ? "Private repo" : repo.nameWithOwner,
              repoUrl: repo.isPrivate ? "" : repo.url,
              isPrivate: repo.isPrivate,
              message: entry.messageHeadline,
              url: repo.isPrivate ? "" : entry.url,
              committedAt: entry.committedDate,
            }));
        })
        .sort((a, b) => new Date(b.committedAt).getTime() - new Date(a.committedAt).getTime())
        .slice(0, 8);
    }

    return {
      ok: true,
      source: !statsResult.ok || !repoResult.ok ? "fallback" : "live",
      updatedAt: new Date().toISOString(),
      data: base,
      error:
        !statsResult.ok || !repoResult.ok
          ? {
              code: "provider_unavailable",
              message: "Some GitHub activity fields are temporarily unavailable.",
            }
          : undefined,
    };
  } catch (error) {
    if (error instanceof ActivityConfigError) {
      return buildErrorResponse(
        "missing_config",
        `GitHub activity is not configured: ${error.key}`
      );
    }

    return buildErrorResponse("internal_error", "Unexpected GitHub activity error.");
  }
}
