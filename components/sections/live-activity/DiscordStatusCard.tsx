"use client";

import { memo } from "react";
import { Activity, Gamepad2, Headphones, PlayCircle } from "lucide-react";
import type { ActivityResponse, DiscordActivity } from "@/lib/activity/types";
import { formatClockTime } from "@/lib/activity/formatters";

type DiscordStatusCardProps = {
  payload: ActivityResponse<DiscordActivity> | null;
  loading?: boolean;
};

const STATUS_DOT: Record<DiscordActivity["status"], string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
};

function ActivityIcon({ kind, type }: { kind: "spotify" | "activity"; type?: number }) {
  const cls = "h-4 w-4 text-[color:var(--cs-signal-text)]";
  if (kind === "spotify") return <Headphones className={cls} aria-hidden="true" />;
  if (type === 0) return <Gamepad2 className={cls} aria-hidden="true" />;
  if (type === 3) return <PlayCircle className={cls} aria-hidden="true" />;
  return <Activity className={cls} aria-hidden="true" />;
}

function DiscordStatusCard({
  payload,
  loading = false,
}: DiscordStatusCardProps) {
  const data = payload?.data;

  if (loading) {
    return (
      <div className="py-3">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          Loading Discord presence…
        </p>
      </div>
    );
  }

  if (payload && !payload.ok) {
    return (
      <div className="py-3">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-error)]">
          {payload.error?.message ?? "Discord presence temporarily unavailable."}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const spotifyHasLink = Boolean(data.live.spotify?.trackUrl);

  return (
    <article className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-white/5 dark:bg-black/20 backdrop-blur-sm isolate">
      {/* Editorial Header */}
      <div className="flex items-center justify-between gap-2 bg-[color:var(--cs-signal)] dark:bg-zinc-800 px-4 py-3 text-white">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/90">
          LIVE DISCORD STATUS
        </p>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/60">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* User (Macro Typography) */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 md:gap-6 border-b border-[color:var(--cs-structural-line)] pb-6">
          {data.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.user.avatarUrl}
              alt={`${data.user.displayName ?? data.user.username} avatar`}
              loading="lazy"
              decoding="async"
              className="h-20 w-20 md:h-24 md:w-24 shrink-0 object-cover border border-white/20 shadow-xl grayscale opacity-80 mix-blend-luminosity transition-all duration-500 hover:grayscale-0 hover:mix-blend-normal hover:opacity-100"
            />
          ) : (
            <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 border border-[color:var(--cs-structural-line)] bg-black/10" />
          )}
          <div className="min-w-0 flex flex-col justify-end">
            <div className="mb-2 flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-signal-text)]">
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[data.status]} shadow-[0_0_8px_currentColor]`} aria-hidden="true" />
              <span>STATUS // {data.status}</span>
            </div>
            <p className="line-clamp-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black uppercase tracking-tight text-[color:var(--cs-text-primary)]">
              {data.user.displayName ?? data.user.username}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Spotify on Discord */}
          {data.live.spotify && (
            <div className="flex items-center gap-4">
              {data.live.spotify.albumArtUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.live.spotify.albumArtUrl}
                  alt={`${data.live.spotify.album} cover`}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 shrink-0 object-cover border border-white/20 grayscale opacity-80 mix-blend-luminosity"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="spotify" />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] mb-1">
                  Spotify Activity
                </p>
                {spotifyHasLink ? (
                  <a
                    href={data.live.spotify.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block line-clamp-1 text-base font-bold text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)]"
                  >
                    {data.live.spotify.title}
                  </a>
                ) : (
                  <p className="line-clamp-1 text-base font-bold text-[color:var(--cs-text-primary)]">
                    {data.live.spotify.title}
                  </p>
                )}
                <p className="line-clamp-1 text-xs text-[color:var(--cs-text-secondary)] font-medium">
                  {data.live.spotify.artist}
                </p>
              </div>
            </div>
          )}

          {/* Gaming activity */}
          {data.live.gaming && (
            <div className="flex items-center gap-4">
              {data.live.gaming.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.live.gaming.imageUrl}
                  alt={`${data.live.gaming.name} cover`}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 shrink-0 object-cover border border-white/20 grayscale opacity-80 mix-blend-luminosity"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="activity" type={0} />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] mb-1">
                  Current Game
                </p>
                <p className="line-clamp-1 text-base font-bold text-[color:var(--cs-text-primary)]">
                  {data.live.gaming.name}
                </p>
              </div>
            </div>
          )}

          {/* Other activities */}
          {data.live.otherActivities.map((activity) => (
            <div
              key={`${activity.type}-${activity.name}-${activity.startedAt ?? "na"}`}
              className="flex items-center gap-4"
            >
              {activity.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activity.imageUrl}
                  alt={`${activity.name} artwork`}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 shrink-0 object-cover border border-white/20 grayscale opacity-80 mix-blend-luminosity"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="activity" type={activity.type} />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] mb-1">
                  {activity.typeLabel}
                </p>
                <p className="line-clamp-1 text-base font-bold text-[color:var(--cs-text-primary)]">
                  {activity.name}
                </p>
                {activity.platform && (
                  <p className="line-clamp-1 text-xs text-[color:var(--cs-text-secondary)] font-medium">
                    {activity.platform}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default memo(DiscordStatusCard);
