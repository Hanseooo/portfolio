"use client";

import { memo } from "react";
import { Activity, Gamepad2, Headphones, PlayCircle, AlertTriangle } from "lucide-react";
import type { ActivityResponse, DiscordActivity } from "@/lib/activity/types";
import { formatClockTime } from "@/lib/activity/formatters";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";

type DiscordStatusCardProps = {
  payload: ActivityResponse<DiscordActivity> | null;
  loading?: boolean;
};

const statusClassMap: Record<DiscordActivity["status"], string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
};

function LoadingState() {
  return (
    <div className="space-y-6 pt-2 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 bg-foreground/10" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-1/2 bg-foreground/10" />
          <div className="h-3 w-1/3 bg-foreground/10" />
          <div className="h-3 w-1/4 bg-foreground/10 mt-3" />
        </div>
      </div>
    </div>
  );
}

function ActivityFallbackIcon({
  kind,
  type,
}: {
  kind: "spotify" | "activity";
  type?: number;
}) {
  const iconClass = "h-5 w-5 text-primary/75";

  if (kind === "spotify") {
    return <Headphones className={iconClass} aria-hidden="true" />;
  }

  if (type === 0) {
    return <Gamepad2 className={iconClass} aria-hidden="true" />;
  }

  if (type === 3) {
    return <PlayCircle className={iconClass} aria-hidden="true" />;
  }

  return <Activity className={iconClass} aria-hidden="true" />;
}

function DiscordStatusCard({
  payload,
  loading = false,
}: DiscordStatusCardProps) {
  const data = payload?.data;
  const spotifyHasLink = Boolean(data?.live.spotify?.trackUrl);
  const isClient = useClientReady();
  const isMobile = isClient ? getRuntimeEnv().isMobile : false;

  return (
    <article className="border-t border-white/10 bg-transparent py-6">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            Discord Presence
          </h3>
        </div>
        <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      {loading ? <LoadingState /> : null}

      {!loading && payload && !payload.ok ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{payload.error?.message ?? "Discord presence is temporarily unavailable."}</p>
        </div>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-4">
            {data.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.user.avatarUrl}
                alt={`${data.user.displayName ?? data.user.username} avatar`}
                loading="lazy"
                decoding="async"
                className={`h-14 w-14 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
              />
            ) : (
              <div className="h-14 w-14 shrink-0 border border-border bg-background/60" />
            )}

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-bold text-foreground/90">
                {data.user.displayName ?? data.user.username}
              </p>
              <p className="line-clamp-1 text-xs text-foreground/70 mt-1">@{data.user.username}</p>
              <div className="mt-3 inline-flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/75">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusClassMap[data.status]}`}
                  aria-hidden="true"
                />
                <span>{data.status}</span>
              </div>
            </div>
          </div>

          {data.live.spotify ? (
            <div className="pt-2">
              <div className="flex items-center gap-4">
                {data.live.spotify.albumArtUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.live.spotify.albumArtUrl}
                    alt={`${data.live.spotify.album} cover`}
                    loading="lazy"
                    decoding="async"
                    className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background/60">
                    <ActivityFallbackIcon kind="spotify" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    Spotify on Discord
                  </p>
                  {spotifyHasLink ? (
                    <a
                      href={data.live.spotify.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block line-clamp-1 text-sm font-bold text-foreground/85 hover:text-primary transition-colors"
                    >
                      {data.live.spotify.title}
                    </a>
                  ) : (
                    <p className="mt-2 line-clamp-1 text-sm font-bold text-foreground/85">{data.live.spotify.title}</p>
                  )}
                  <p className="line-clamp-1 text-xs text-foreground/70 mt-1">
                    {data.live.spotify.artist} · {data.live.spotify.album}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {data.live.gaming ? (
            <div className="pt-2">
              <div className="flex items-center gap-4">
                {data.live.gaming.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.live.gaming.imageUrl}
                    alt={`${data.live.gaming.name} cover`}
                    loading="lazy"
                    decoding="async"
                    className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background/60">
                    <ActivityFallbackIcon kind="activity" type={0} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Playing</p>
                  <p className="mt-2 line-clamp-1 text-sm font-bold text-foreground/85">{data.live.gaming.name}</p>
                  {data.live.gaming.details ? (
                    <p className="line-clamp-1 text-xs text-foreground/70 mt-1">{data.live.gaming.details}</p>
                  ) : null}
                  {data.live.gaming.state ? (
                    <p className="line-clamp-1 text-xs text-foreground/70">{data.live.gaming.state}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {data.live.otherActivities.length > 0 ? (
            <div className="space-y-6 pt-2">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Other Activities</p>
              {data.live.otherActivities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.name}-${activity.startedAt ?? "na"}`}
                  className="pt-2"
                >
                  <div className="flex items-center gap-4">
                    {activity.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activity.imageUrl}
                        alt={`${activity.name} artwork`}
                        loading="lazy"
                        decoding="async"
                        className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background/60">
                        <ActivityFallbackIcon kind="activity" type={activity.type} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                        {activity.typeLabel}
                      </p>
                      <p className="mt-2 line-clamp-1 text-sm font-bold text-foreground/85">{activity.name}</p>
                      {activity.details ? (
                        <p className="line-clamp-1 text-xs text-foreground/70 mt-1">{activity.details}</p>
                      ) : null}
                      {activity.state ? (
                        <p className="line-clamp-1 text-xs text-foreground/70">{activity.state}</p>
                      ) : null}
                      {activity.platform ? (
                        <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/65 mt-1">
                          {activity.platform}
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

export default memo(DiscordStatusCard);
