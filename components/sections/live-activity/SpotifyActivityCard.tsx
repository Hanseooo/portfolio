"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ActivityResponse, SpotifyActivity } from "@/lib/activity/types";
import { formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";

type SpotifyActivityCardProps = {
  payload: ActivityResponse<SpotifyActivity> | null;
  loading?: boolean;
};

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 w-full bg-foreground/10" />
      <div className="space-y-2">
        <div className="h-3 w-2/3 bg-foreground/10" />
        <div className="h-3 w-1/2 bg-foreground/10" />
      </div>
    </div>
  );
}

type RailProps = {
  title: string;
  children: React.ReactNode;
};

function HorizontalRail({ title, children }: RailProps) {
  return (
    <section>
      <p className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">{title}</p>
      <div className="scrollbar-live snap-x snap-mandatory overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">{children}</div>
      </div>
    </section>
  );
}

export default function SpotifyActivityCard({
  payload,
  loading = false,
}: SpotifyActivityCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);
  const [recentPayload, setRecentPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);
  const [topPayload, setTopPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);
  const data = payload?.data;
  const detailsData = {
    recentTracks: recentPayload?.data?.recentTracks ?? data?.recentTracks ?? [],
    topTracks: topPayload?.data?.topTracks ?? data?.topTracks ?? [],
    topArtists: topPayload?.data?.topArtists ?? data?.topArtists ?? [],
  };

  const topStorageKey = "live-activity:spotify-top";
  const topStorageTtlMs = 6 * 60 * 60 * 1000;

  const readTopFromStorage = () => {
    try {
      const raw = window.localStorage.getItem(topStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as {
        expiresAt: number;
        payload: ActivityResponse<SpotifyActivity>;
      };
      if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(topStorageKey);
        return null;
      }
      return parsed.payload;
    } catch {
      return null;
    }
  };

  const writeTopToStorage = (nextPayload: ActivityResponse<SpotifyActivity>) => {
    try {
      window.localStorage.setItem(
        topStorageKey,
        JSON.stringify({
          expiresAt: Date.now() + topStorageTtlMs,
          payload: nextPayload,
        })
      );
    } catch {
      // Ignore storage quota/runtime errors.
    }
  };

  const fetchRecentDetails = async () => {
    if (recentLoading) return;
    setRecentLoading(true);

    try {
      const response = await fetch("/api/activity/spotify?details=recent", { cache: "no-store" });
      if (!response.ok) throw new Error("recent_failed");
      const nextPayload = (await response.json()) as ActivityResponse<SpotifyActivity>;
      setRecentPayload(nextPayload);
    } catch {
      setRecentPayload((current) =>
        current ?? {
          ok: false,
          source: "fallback",
          updatedAt: new Date().toISOString(),
          data: null,
          error: {
            code: "provider_unavailable",
            message: "Spotify details are temporarily unavailable.",
          },
        }
      );
    } finally {
      setRecentLoading(false);
    }
  };

  const fetchTopDetails = async () => {
    if (topLoading) return;
    setTopLoading(true);

    try {
      const cached = readTopFromStorage();
      if (cached) {
        setTopPayload(cached);
        return;
      }

      const response = await fetch("/api/activity/spotify?details=top", { cache: "no-store" });
      if (!response.ok) throw new Error("top_failed");
      const nextPayload = (await response.json()) as ActivityResponse<SpotifyActivity>;
      setTopPayload(nextPayload);
      writeTopToStorage(nextPayload);
    } catch {
      setTopPayload((current) =>
        current ?? {
          ok: false,
          source: "fallback",
          updatedAt: new Date().toISOString(),
          data: null,
          error: {
            code: "provider_unavailable",
            message: "Spotify top data is temporarily unavailable.",
          },
        }
      );
    } finally {
      setTopLoading(false);
    }
  };

  return (
    <article className="border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Now Playing
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      {loading ? <LoadingState /> : null}

      {!loading && payload && !payload.ok ? (
        <p className="text-sm text-foreground/75">
          {payload.error?.message ?? "Spotify activity is temporarily unavailable."}
        </p>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-4">
          {data.nowPlaying ? (
            <a
              href={data.nowPlaying.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-foreground/15 bg-background/70 p-3 transition hover:border-primary"
            >
              <div className="flex items-center gap-3">
                {data.nowPlaying.artworkUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.nowPlaying.artworkUrl}
                    alt={`${data.nowPlaying.album} cover`}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-md border border-foreground/15 bg-background/60" />
                )}
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium text-foreground/90">
                    {data.nowPlaying.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-foreground/75">{data.nowPlaying.artist}</p>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/65">
                    {data.nowPlaying.isPlaying ? "Playing" : "Recently played"}
                  </p>
                </div>
              </div>
            </a>
          ) : (
            <div className="border border-foreground/15 bg-background/70 p-3">
              <p className="text-sm text-foreground/80">Not playing right now.</p>
            </div>
          )}

          <div className="flex items-center justify-end border-t border-foreground/15 pt-1">
          <Dialog
            open={detailsOpen}
            onOpenChange={(open) => {
              setDetailsOpen(open);
              if (open) {
                if (!recentPayload) void fetchRecentDetails();
                if (!topPayload) void fetchTopDetails();
              }
            }}
          >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-10 w-full items-center justify-center border border-foreground/25 px-4 text-xs uppercase tracking-[0.12em] text-foreground/85 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View details
                </button>
              </DialogTrigger>
            <DialogContent className="flex h-[min(82vh,44rem)] w-[min(92vw,48rem)] max-w-3xl flex-col overflow-hidden p-0">
              <DialogHeader>
                <DialogTitle className="border-b border-foreground/15 px-6 pb-4 pt-6 text-sm uppercase tracking-[0.2em] text-foreground/75">
                  Spotify Activity Details
                </DialogTitle>
              </DialogHeader>

              <div className="scrollbar-live min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-6 pt-1">
                <section>
                  <p className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/70">
                    Recent Tracks
                  </p>
                  {recentLoading ? (
                    <p className="text-sm text-foreground/75">Loading details...</p>
                  ) : detailsData?.recentTracks.length ? (
                    <ul className="space-y-3">
                      {detailsData.recentTracks.slice(0, 5).map((track) => (
                        <li key={`${track.trackUrl}-${track.playedAt}`} className="min-w-0 border-l border-foreground/20 pl-3">
                          <a
                            href={track.trackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <p className="line-clamp-1 text-sm text-foreground/85">{track.title}</p>
                            <p className="line-clamp-1 text-xs text-foreground/70">
                              {track.artist} · {formatRelativeTime(track.playedAt)}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-foreground/75">No recent tracks found.</p>
                  )}
                </section>

                <HorizontalRail title="Top Tracks">
                  {topLoading ? (
                    <p className="text-sm text-foreground/75">Loading details...</p>
                  ) : detailsData?.topTracks.length ? (
                    detailsData.topTracks.slice(0, 5).map((track) => (
                      <a
                        key={`${track.trackUrl}-${track.title}`}
                        href={track.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-36 shrink-0 snap-start border border-foreground/20 bg-background/70 p-2 transition hover:border-primary"
                      >
                        {track.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={track.artworkUrl}
                            alt={`${track.album} cover`}
                            className="h-24 w-full rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-24 w-full rounded-md border border-foreground/15 bg-background/60" />
                        )}
                        <p className="mt-2 line-clamp-1 text-sm text-foreground/85">{track.title}</p>
                        <p className="line-clamp-1 text-xs text-foreground/70">{track.artist}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/75">Top tracks unavailable.</p>
                  )}
                </HorizontalRail>

                <HorizontalRail title="Top Artists">
                  {topLoading ? (
                    <p className="text-sm text-foreground/75">Loading details...</p>
                  ) : detailsData?.topArtists.length ? (
                    detailsData.topArtists.slice(0, 5).map((artist) => (
                      <a
                        key={artist.name}
                        href={artist.artistUrl || undefined}
                        target={artist.artistUrl ? "_blank" : undefined}
                        rel={artist.artistUrl ? "noopener noreferrer" : undefined}
                        className="w-32 shrink-0 snap-start border border-foreground/20 bg-background/70 p-2 transition hover:border-primary"
                      >
                        {artist.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artist.artworkUrl}
                            alt={`${artist.name} artwork`}
                            className="h-24 w-full rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-24 w-full rounded-md border border-foreground/15 bg-background/60" />
                        )}
                        <p className="mt-2 line-clamp-1 text-sm text-foreground/85">{artist.name}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/75">Top artists unavailable.</p>
                  )}
                </HorizontalRail>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : null}
    </article>
  );
}
