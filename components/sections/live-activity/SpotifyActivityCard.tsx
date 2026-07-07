"use client";

import { memo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ActivityResponse, SpotifyActivity } from "@/lib/activity/types";
import { formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";

type SpotifyActivityCardProps = {
  payload: ActivityResponse<SpotifyActivity> | null;
  loading?: boolean;
};

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse py-2">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 bg-foreground/10" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-foreground/10" />
          <div className="h-3 w-1/2 bg-foreground/10" />
          <div className="h-3 w-1/4 bg-foreground/10 mt-2" />
        </div>
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
      <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">{title}</p>
      <div className="scrollbar-live snap-x snap-mandatory overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">{children}</div>
      </div>
    </section>
  );
}

function SpotifyActivityCard({
  payload,
  loading = false,
}: SpotifyActivityCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);
  const [recentPayload, setRecentPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);
  const [topPayload, setTopPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);
  const data = payload?.data;
  const isClient = useClientReady();
  const isMobile = isClient ? getRuntimeEnv().isMobile : false;
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
    <article className="border-t border-white/10 bg-transparent py-6">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            Now Playing
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
          <p>{payload.error?.message ?? "Spotify activity is temporarily unavailable."}</p>
        </div>
      ) : null}

      {!loading && payload?.ok && data ? (
        <div className="space-y-4">
          {data.nowPlaying ? (
            <a
              href={data.nowPlaying.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group py-2"
            >
              <div className="flex items-center gap-4">
                {data.nowPlaying.artworkUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.nowPlaying.artworkUrl}
                    alt={`${data.nowPlaying.album} cover`}
                    loading="lazy"
                    decoding="async"
                    className={`h-16 w-16 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 border border-border bg-background/60" />
                )}
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-bold text-foreground/90 transition-colors group-hover:text-primary">
                    {data.nowPlaying.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-foreground/75 mt-1">{data.nowPlaying.artist}</p>
                  <p className="mt-2 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    {data.nowPlaying.isPlaying ? "Playing" : "Recently played"}
                  </p>
                </div>
              </div>
            </a>
          ) : (
            <div className="py-2">
              <p className="text-sm text-foreground/80 font-bold uppercase tracking-[0.2em]">Not playing right now.</p>
            </div>
          )}

          <div className="flex items-center justify-end pt-4">
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
                  className="group inline-flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:text-primary focus-visible:outline-none"
                >
                  View details
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </DialogTrigger>
            <DialogContent className="flex h-[min(82vh,44rem)] w-[min(92vw,48rem)] max-w-3xl flex-col overflow-hidden p-0">
              <DialogHeader>
                <DialogTitle className="px-6 pb-4 pt-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                  Spotify Activity Details
                </DialogTitle>
              </DialogHeader>

              <div data-lenis-prevent className="scrollbar-live min-h-0 flex-1 space-y-8 overflow-y-auto px-6 pb-6 pt-1">
                <section>
                  <p className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    Recent Tracks
                  </p>
                  {recentLoading ? (
                    <ul className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <li key={i} className="min-w-0 pl-0">
                          <div className="block py-1">
                            <div className="h-4 w-2/3 bg-foreground/10 mb-2" />
                            <div className="h-3 w-1/3 bg-foreground/10" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : detailsData?.recentTracks.length ? (
                    <ul className="space-y-4">
                      {detailsData.recentTracks.slice(0, 5).map((track) => (
                        <li key={`${track.trackUrl}-${track.playedAt}`} className="min-w-0 pl-0">
                          <a
                            href={track.trackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <p className="line-clamp-1 text-sm font-bold text-foreground/85 transition-colors group-hover:text-primary">{track.title}</p>
                            <p className="line-clamp-1 text-xs text-foreground/70 mt-1">
                              {track.artist} · {formatRelativeTime(track.playedAt)}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-foreground/75 font-bold uppercase tracking-[0.2em]">No recent tracks found.</p>
                  )}
                </section>

                <HorizontalRail title="Top Tracks">
                  {topLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-36 shrink-0 snap-start animate-pulse">
                          <div className="h-36 w-full border border-border bg-foreground/10 mb-3" />
                          <div className="h-4 w-3/4 bg-foreground/10 mb-2" />
                          <div className="h-3 w-1/2 bg-foreground/10" />
                        </div>
                      ))}
                    </>
                  ) : detailsData?.topTracks.length ? (
                    detailsData.topTracks.slice(0, 5).map((track) => (
                      <a
                        key={`${track.trackUrl}-${track.title}`}
                        href={track.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-36 shrink-0 snap-start group"
                      >
                        {track.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={track.artworkUrl}
                            alt={`${track.album} cover`}
                            loading="lazy"
                            decoding="async"
                            className={`h-36 w-full object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
                          />
                        ) : (
                          <div className="h-36 w-full border border-border bg-background/60" />
                        )}
                        <p className="mt-3 line-clamp-1 text-sm font-bold text-foreground/85 transition-colors group-hover:text-primary">{track.title}</p>
                        <p className="line-clamp-1 text-xs text-foreground/70 mt-1">{track.artist}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/75 font-bold uppercase tracking-[0.2em]">Top tracks unavailable.</p>
                  )}
                </HorizontalRail>

                <HorizontalRail title="Top Artists">
                  {topLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-36 shrink-0 snap-start animate-pulse">
                          <div className="h-36 w-full border border-border bg-foreground/10 mb-3" />
                          <div className="h-4 w-3/4 bg-foreground/10" />
                        </div>
                      ))}
                    </>
                  ) : detailsData?.topArtists.length ? (
                    detailsData.topArtists.slice(0, 5).map((artist) => (
                      <a
                        key={artist.name}
                        href={artist.artistUrl || undefined}
                        target={artist.artistUrl ? "_blank" : undefined}
                        rel={artist.artistUrl ? "noopener noreferrer" : undefined}
                        className="w-36 shrink-0 snap-start group"
                      >
                        {artist.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artist.artworkUrl}
                            alt={`${artist.name} artwork`}
                            loading="lazy"
                            decoding="async"
                            className={`h-36 w-full object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
                          />
                        ) : (
                          <div className="h-36 w-full border border-border bg-background/60" />
                        )}
                        <p className="mt-3 line-clamp-1 text-sm font-bold text-foreground/85 transition-colors group-hover:text-primary">{artist.name}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/75 font-bold uppercase tracking-[0.2em]">Top artists unavailable.</p>
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

export default memo(SpotifyActivityCard);
