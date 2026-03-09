"use client";

import type { ActivityResponse, DiscordActivity } from "@/lib/activity/types";
import { formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";

type DiscordStatusCardProps = {
  payload: ActivityResponse<DiscordActivity> | null;
  loading?: boolean;
  now: Date;
};

const statusClassMap: Record<DiscordActivity["status"], string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
};

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-full bg-foreground/10" />
      <div className="h-3 w-2/3 bg-foreground/10" />
    </div>
  );
}

export default function DiscordStatusCard({
  payload,
  loading = false,
  now,
}: DiscordStatusCardProps) {
  const data = payload?.data;
  const spotifyHasLink = Boolean(data?.live.spotify?.trackUrl);

  return (
    <article className="rounded-xl border border-foreground/20 bg-background/90 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/70">Live Signals</p>
          <h3 className="mt-2 text-lg font-semibold text-primary sm:text-xl">Discord Presence</h3>
        </div>
        <span className="text-xs text-foreground/70">
          {payload?.updatedAt ? `Updated ${formatClockTime(payload.updatedAt)}` : "Not updated"}
        </span>
      </div>

      {loading ? <LoadingState /> : null}

      {!loading && payload && !payload.ok ? (
        <p className="text-sm text-foreground/75">
          {payload.error?.message ?? "Discord presence is temporarily unavailable."}
        </p>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 border border-foreground/15 bg-background/70 p-3">
            {data.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.user.avatarUrl}
                alt={`${data.user.displayName ?? data.user.username} avatar`}
                className="h-12 w-12 shrink-0 rounded-full border border-foreground/20 object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-full border border-foreground/20 bg-background/60" />
            )}

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium text-foreground/90">
                {data.user.displayName ?? data.user.username}
              </p>
              <p className="line-clamp-1 text-xs text-foreground/70">@{data.user.username}</p>
              <div className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-foreground/75">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusClassMap[data.status]}`}
                  aria-hidden="true"
                />
                <span>{data.status}</span>
              </div>
            </div>
          </div>

          {data.listeningToSpotify ? (
            <p className="text-sm text-foreground/80">Currently listening to Spotify via Discord.</p>
          ) : null}

          {data.live.spotify ? (
            <div
              className={`border border-foreground/15 bg-background/70 p-3 ${
                spotifyHasLink ? "transition hover:border-primary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {data.live.spotify.albumArtUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.live.spotify.albumArtUrl}
                    alt={`${data.live.spotify.album} cover`}
                    className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 bg-background/60" />
                )}

                <div className="min-w-0">
                  <p className="text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                    Spotify on Discord
                  </p>
                  {spotifyHasLink ? (
                    <a
                      href={data.live.spotify.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block line-clamp-1 text-sm text-foreground/85 hover:text-primary"
                    >
                      {data.live.spotify.title}
                    </a>
                  ) : (
                    <p className="mt-1 line-clamp-1 text-sm text-foreground/85">{data.live.spotify.title}</p>
                  )}
                  <p className="line-clamp-1 text-xs text-foreground/70">
                    {data.live.spotify.artist} · {data.live.spotify.album}
                  </p>
                  {data.live.spotify.startedAt ? (
                    <p className="mt-1 text-[0.68rem] text-foreground/65">
                      Started {formatRelativeTime(new Date(data.live.spotify.startedAt), now)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {data.live.gaming ? (
            <div className="border border-foreground/15 bg-background/70 p-3">
              <div className="flex items-center gap-3">
                {data.live.gaming.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.live.gaming.imageUrl}
                    alt={`${data.live.gaming.name} cover`}
                    className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 bg-background/60" />
                )}

                <div className="min-w-0">
                  <p className="text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">Playing</p>
                  <p className="mt-1 line-clamp-1 text-sm text-foreground/85">{data.live.gaming.name}</p>
                  {data.live.gaming.details ? (
                    <p className="line-clamp-1 text-xs text-foreground/70">{data.live.gaming.details}</p>
                  ) : null}
                  {data.live.gaming.state ? (
                    <p className="line-clamp-1 text-xs text-foreground/70">{data.live.gaming.state}</p>
                  ) : null}
                  {data.live.gaming.startedAt ? (
                    <p className="mt-1 text-[0.68rem] text-foreground/65">
                      Started {formatRelativeTime(new Date(data.live.gaming.startedAt), now)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {data.live.otherActivities.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">Other Activities</p>
              {data.live.otherActivities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.name}-${activity.startedAt ?? "na"}`}
                  className="border border-foreground/15 bg-background/70 p-3"
                >
                  <div className="flex items-center gap-3">
                    {activity.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activity.imageUrl}
                        alt={`${activity.name} artwork`}
                        className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-md border border-foreground/20 bg-background/60" />
                    )}

                    <div className="min-w-0">
                      <p className="text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                        {activity.typeLabel}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-foreground/85">{activity.name}</p>
                      {activity.details ? (
                        <p className="line-clamp-1 text-xs text-foreground/70">{activity.details}</p>
                      ) : null}
                      {activity.state ? (
                        <p className="line-clamp-1 text-xs text-foreground/70">{activity.state}</p>
                      ) : null}
                      {activity.platform ? (
                        <p className="line-clamp-1 text-xs uppercase tracking-[0.1em] text-foreground/65">
                          {activity.platform}
                        </p>
                      ) : null}
                      {activity.startedAt ? (
                        <p className="mt-1 text-[0.68rem] text-foreground/65">
                          Started {formatRelativeTime(new Date(activity.startedAt), now)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
