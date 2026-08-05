"use client";

import { memo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ActivityResponse, SpotifyActivity } from "@/lib/activity/types";
import { formatClockTime, formatRelativeTime } from "@/lib/activity/formatters";

type SpotifyActivityCardProps = {
  payload: ActivityResponse<SpotifyActivity> | null;
  loading?: boolean;
};

function SpotifyActivityCard({
  payload,
  loading = false,
}: SpotifyActivityCardProps) {
  const data = payload?.data;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);
  const [recentPayload, setRecentPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);
  const [topPayload, setTopPayload] = useState<ActivityResponse<SpotifyActivity> | null>(null);

  const fetchRecentDetails = async () => {
    try {
      setRecentLoading(true);
      const res = await fetch("/api/activity/spotify?details=recent");
      if (res.ok) {
        const json = (await res.json()) as ActivityResponse<SpotifyActivity>;
        setRecentPayload(json);
      }
    } catch {
      // fallback silently
    } finally {
      setRecentLoading(false);
    }
  };

  const fetchTopDetails = async () => {
    try {
      setTopLoading(true);
      const res = await fetch("/api/activity/spotify?details=top");
      if (res.ok) {
        const json = (await res.json()) as ActivityResponse<SpotifyActivity>;
        setTopPayload(json);
      }
    } catch {
      // fallback silently
    } finally {
      setTopLoading(false);
    }
  };

  const detailsData = {
    recentTracks: recentPayload?.data?.recentTracks ?? data?.recentTracks ?? [],
    topTracks: topPayload?.data?.topTracks ?? data?.topTracks ?? [],
    topArtists: topPayload?.data?.topArtists ?? data?.topArtists ?? [],
  };

  if (loading) {
    return (
      <div className="py-3">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          Loading Spotify activity…
        </p>
      </div>
    );
  }

  if (payload && !payload.ok) {
    return (
      <div className="py-3">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-error)]">
          {payload.error?.message ?? "Spotify activity temporarily unavailable."}
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
          LIVE SPOTIFY FEED
        </p>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/60">
          {payload?.updatedAt ? `Sync: ${formatClockTime(payload.updatedAt)}` : "Offline"}
        </span>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-8">
        {/* Now playing (Macro Typography) */}
        {data.nowPlaying ? (
          <a
            href={data.nowPlaying.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-end gap-4 md:gap-6"
          >
            {data.nowPlaying.artworkUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.nowPlaying.artworkUrl}
                alt={`${data.nowPlaying.album} cover`}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 md:h-32 md:w-32 shrink-0 object-cover border border-white/20 shadow-xl grayscale opacity-80 mix-blend-luminosity transition-all duration-500 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
              />
            ) : (
              <div className="h-24 w-24 md:h-32 md:w-32 shrink-0 border border-[color:var(--cs-structural-line)] bg-black/10" />
            )}
            <div className="min-w-0 flex flex-col justify-end">
              <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-signal-text)]">
                {data.nowPlaying.isPlaying ? "STATUS // NOW PLAYING" : "STATUS // RECENTLY PLAYED"}
              </p>
              <p className="line-clamp-2 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black uppercase leading-[0.9] tracking-tight text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                {data.nowPlaying.title}
              </p>
              <p className="mt-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                {data.nowPlaying.artist}
              </p>
            </div>
          </a>
        ) : (
          <p className="text-sm font-[family-name:var(--font-mono)] uppercase text-[color:var(--cs-text-secondary)]">NO ACTIVE SIGNAL.</p>
        )}

        {/* Recent tracks (Micro Typography) */}
        {data.recentTracks && data.recentTracks.length > 0 && (
          <div className="border-t border-[color:var(--cs-structural-line)] pt-6 mt-2">
            <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              Historical Data // Recent
            </p>
            <ul className="flex flex-col gap-4">
              {data.recentTracks.slice(0, 2).map((track) => (
                <li key={`${track.trackUrl}-${track.playedAt}`}>
                  <a
                    href={track.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 border-l-2 border-[color:var(--cs-structural-line)] pl-3 transition-colors hover:border-[color:var(--cs-signal)]"
                  >
                    <p className="line-clamp-1 text-sm font-bold text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                      {track.title}
                    </p>
                    <p className="line-clamp-1 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[color:var(--cs-text-secondary)]">
                      {track.artist} · {formatRelativeTime(track.playedAt)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* View Details Button & Dialog Modal */}
      <div className="flex w-full mt-auto">
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
              className="group flex w-full items-center justify-between border-t border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-6 py-4 transition-colors hover:bg-[color:var(--cs-signal)] hover:text-white focus-visible:outline-none"
            >
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-primary)] group-hover:text-white transition-colors">
                Extract Full Telemetry
              </span>
              <ArrowRight size={14} className="text-[color:var(--cs-text-primary)] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-white" />
            </button>
          </DialogTrigger>
          <DialogContent className="flex max-h-[85vh] w-[90vw] max-w-2xl flex-col overflow-hidden border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-card-bg,var(--background))] p-0 text-[color:var(--cs-text-primary)]">
            <DialogHeader className="border-b border-[color:var(--cs-structural-line)] px-6 py-4">
              <DialogTitle className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                Spotify Activity Details
              </DialogTitle>
            </DialogHeader>

            <div data-lenis-prevent className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Recent Tracks */}
              <section>
                <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Recent Tracks
                </p>
                {recentLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-full rounded bg-[color:var(--cs-structural-line)]/40" />
                    ))}
                  </div>
                ) : detailsData.recentTracks.length > 0 ? (
                  <ul className="space-y-3">
                    {detailsData.recentTracks.slice(0, 8).map((track) => (
                      <li key={`${track.trackUrl}-${track.playedAt}`}>
                        <a
                          href={track.trackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <p className="line-clamp-1 text-sm font-medium text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                            {track.title}
                          </p>
                          <p className="line-clamp-1 text-xs text-[color:var(--cs-text-secondary)] mt-0.5">
                            {track.artist} · {formatRelativeTime(track.playedAt)}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[color:var(--cs-text-secondary)]">No recent tracks found.</p>
                )}
              </section>

              {/* Top Tracks */}
              <section>
                <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Top Tracks
                </p>
                {topLoading ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-32 w-full rounded bg-[color:var(--cs-structural-line)]/40" />
                    ))}
                  </div>
                ) : detailsData.topTracks.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {detailsData.topTracks.slice(0, 4).map((track) => (
                      <a
                        key={`${track.trackUrl}-${track.title}`}
                        href={track.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block border border-[color:var(--cs-structural-line)] p-2 transition-colors hover:border-[color:var(--cs-signal)]"
                      >
                        {track.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={track.artworkUrl}
                            alt={`${track.album} cover`}
                            loading="lazy"
                            decoding="async"
                            className="aspect-square w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-square w-full bg-[color:var(--cs-structural-line)]" />
                        )}
                        <p className="mt-2 line-clamp-1 text-xs font-medium text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                          {track.title}
                        </p>
                        <p className="line-clamp-1 text-[10px] text-[color:var(--cs-text-secondary)] mt-0.5">
                          {track.artist}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[color:var(--cs-text-secondary)]">Top tracks unavailable.</p>
                )}
              </section>

              {/* Top Artists */}
              <section>
                <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Top Artists
                </p>
                {topLoading ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-32 w-full rounded bg-[color:var(--cs-structural-line)]/40" />
                    ))}
                  </div>
                ) : detailsData.topArtists.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {detailsData.topArtists.slice(0, 4).map((artist) => (
                      <a
                        key={artist.name}
                        href={artist.artistUrl || undefined}
                        target={artist.artistUrl ? "_blank" : undefined}
                        rel={artist.artistUrl ? "noopener noreferrer" : undefined}
                        className="group block border border-[color:var(--cs-structural-line)] p-2 transition-colors hover:border-[color:var(--cs-signal)]"
                      >
                        {artist.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artist.artworkUrl}
                            alt={`${artist.name} artwork`}
                            loading="lazy"
                            decoding="async"
                            className="aspect-square w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-square w-full bg-[color:var(--cs-structural-line)]" />
                        )}
                        <p className="mt-2 line-clamp-1 text-xs font-medium text-[color:var(--cs-text-primary)] transition-colors group-hover:text-[color:var(--cs-signal)]">
                          {artist.name}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[color:var(--cs-text-secondary)]">Top artists unavailable.</p>
                )}
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}

export default memo(SpotifyActivityCard);
