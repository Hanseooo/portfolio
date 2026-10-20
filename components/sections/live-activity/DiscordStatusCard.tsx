"use client";

import { memo } from "react";
import { Activity, Gamepad2, Headphones, PlayCircle } from "lucide-react";
import type { ActivityResponse, DiscordActivity } from "@/lib/activity/types";
import LiveCardHeader from "./LiveCardHeader";
import { LIVE_LABEL, SKELETON_BAR } from "./labels";

type DiscordStatusCardProps = {
  payload: ActivityResponse<DiscordActivity> | null;
  loading?: boolean;
};

const STATUS: Record<DiscordActivity["status"], { dot: string; word: string }> = {
  online: { dot: "bg-[color:var(--cs-status-online)]", word: "Online" },
  idle: { dot: "bg-[color:var(--cs-status-idle)]", word: "Idle" },
  dnd: { dot: "bg-[color:var(--cs-status-dnd)]", word: "Do not disturb" },
  offline: { dot: "bg-[color:var(--cs-status-offline)]", word: "Offline" },
};

/** Same frame as a loaded card with no activity rows (R2-5). */
function DiscordStatusSkeleton() {
  return (
    <article aria-busy="true" className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] shadow-xl motion-safe:animate-pulse">
      <LiveCardHeader label="Discord" />
      <span className="sr-only">Loading Discord status</span>
      <div aria-hidden="true" className="p-4 md:p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 md:gap-6 border-b border-[color:var(--cs-structural-line)] pb-6">
          <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 bg-[color:var(--cs-structural-line)]" />
          <div className="min-w-0 flex flex-col justify-end">
            <p className="mb-2 text-xs"><span className={`${SKELETON_BAR} w-16`}>&nbsp;</span></p>
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black">
              <span className={`${SKELETON_BAR} w-32`}>&nbsp;</span>
            </p>
          </div>
        </div>
        <div />
      </div>
    </article>
  );
}

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

  if (loading) return <DiscordStatusSkeleton />;

  if (payload && !payload.ok) {
    return (
      <article className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] shadow-xl">
        <LiveCardHeader label="Discord" />
        <p className="p-4 md:p-6 text-sm text-[color:var(--cs-text-secondary)]">
          Discord status is unavailable right now.
        </p>
      </article>
    );
  }

  if (!data) return null;

  const spotifyHasLink = Boolean(data.live.spotify?.trackUrl);

  return (
    <article className="flex flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] shadow-xl isolate">
      <LiveCardHeader label="Discord" updatedAt={payload?.updatedAt} />

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
              className="h-20 w-20 md:h-24 md:w-24 shrink-0 object-cover border border-[color:var(--cs-structural-line)]"
            />
          ) : (
            <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 border border-[color:var(--cs-structural-line)] bg-black/10" />
          )}
          <div className="min-w-0 flex flex-col justify-end">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[color:var(--cs-text-secondary)]">
              <span className={`h-2 w-2 rounded-full ${STATUS[data.status].dot}`} aria-hidden="true" />
              <span>{STATUS[data.status].word}</span>
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
                  className="h-14 w-14 shrink-0 object-cover border border-[color:var(--cs-structural-line)]"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="spotify" />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className={`mb-1 ${LIVE_LABEL}`}>
                  Listening on Spotify
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
                  className="h-14 w-14 shrink-0 object-cover border border-[color:var(--cs-structural-line)]"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="activity" type={0} />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className={`mb-1 ${LIVE_LABEL}`}>
                  Playing
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
                  className="h-14 w-14 shrink-0 object-cover border border-[color:var(--cs-structural-line)]"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[color:var(--cs-structural-line)] bg-black/10">
                  <ActivityIcon kind="activity" type={activity.type} />
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <p className={`mb-1 ${LIVE_LABEL}`}>
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
