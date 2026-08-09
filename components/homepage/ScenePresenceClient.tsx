"use client";

import { useEffect, useRef, useState } from "react";
import LiveProviderRegionComponent from "@/components/evidence/LiveProviderRegion";
import GitHubActivityCard from "@/components/sections/live-activity/GitHubActivityCard";
import SpotifyActivityCard from "@/components/sections/live-activity/SpotifyActivityCard";
import DiscordStatusCard from "@/components/sections/live-activity/DiscordStatusCard";
import type {
  ActivityResponse,
  GitHubActivity,
  SpotifyActivity,
  DiscordActivity,
  ActivityErrorCode,
} from "@/lib/activity/types";

type ActivityState<T> = {
  payload: ActivityResponse<T> | null;
  loading: boolean;
};

function buildClientErrorResponse<T>(
  message: string,
  code: ActivityErrorCode = "provider_unavailable"
): ActivityResponse<T> {
  return {
    ok: false,
    source: "fallback",
    updatedAt: new Date().toISOString(),
    data: null,
    error: { code, message },
  };
}

/**
 * Polls `url` every `intervalMs`, but only while `active`. Scene 05 sits near
 * the bottom of a six-scene page; without the gate a visible tab parked on the
 * hero still fired two requests every 20s for the life of the session.
 *
 * One fetch always happens on mount so the first paint has data, and each
 * re-entry into view refreshes it.
 */
function usePolledActivity<T>(
  url: string,
  intervalMs: number,
  active: boolean
): ActivityState<T> {
  const [state, setState] = useState<ActivityState<T>>({
    payload: null,
    loading: true,
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const update = async () => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const payload = (await response.json()) as ActivityResponse<T>;
        if (cancelled) return;
        setState({ payload, loading: false });
      } catch {
        if (cancelled) return;
        setState({
          payload: buildClientErrorResponse<T>("Live activity is temporarily unavailable."),
          loading: false,
        });
      }
    };

    if (!fetchedRef.current || active) {
      fetchedRef.current = true;
      void update();
    }

    // ponytail: offscreen means no interval and no listener at all
    if (!active) {
      return () => {
        cancelled = true;
      };
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void update();
    }, intervalMs);

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      void update();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs, url, active]);

  return state;
}

function resolveProviderState(
  loading: boolean,
  payload: ActivityResponse<unknown> | null
): "loading" | "success" | "unavailable" | "error" {
  if (loading) return "loading";
  if (!payload) return "unavailable";
  if (payload.ok) return "success";
  if (payload.error?.code === "missing_config") return "unavailable";
  return "error";
}

export default function ScenePresenceClient() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const github = usePolledActivity<GitHubActivity>("/api/activity/github", 5 * 60 * 1000, inView);
  const spotify = usePolledActivity<SpotifyActivity>("/api/activity/spotify", 20 * 1000, inView);
  const discord = usePolledActivity<DiscordActivity>("/api/activity/discord", 20 * 1000, inView);

  return (
    <div ref={sectionRef} className="hp-grid relative isolate">
      {/* Background Architectural Scaffolding (Connecting the columns) */}
      <div className="absolute top-[30%] left-[-2rem] lg:left-[-5rem] w-[80%] h-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />
      <div className="absolute top-[-2rem] bottom-[-4rem] left-[66.66%] w-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />
      <div className="absolute top-[65%] right-[-2rem] lg:right-[-5rem] w-[40%] h-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />
      
      {/* Surveyor Ring sitting at the primary data intersection */}
      <div className="absolute top-[30%] left-[66.66%] w-8 h-8 border border-[color:var(--cs-structural-line-strong)] rounded-full -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:block" aria-hidden="true" />

      {/* GitHub — primary evidence rail */}
      <div className="col-span-4 md:col-span-5 lg:col-span-8 relative z-10">
        {/* GitHub Targeting Brackets (Framing the primary system window) */}
        <div className="absolute top-0 left-0 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-[color:var(--cs-signal)] z-20 pointer-events-none -translate-x-[2px] -translate-y-[2px]" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-8 md:w-12 h-8 md:h-12 border-b-2 border-r-2 border-[color:var(--cs-signal)] z-20 pointer-events-none translate-x-[2px] translate-y-[2px]" aria-hidden="true" />
        
        <LiveProviderRegionComponent
          providerId="github"
          state={resolveProviderState(github.loading, github.payload)}
          label="GitHub activity"
          minHeight="200px"
        >
          <GitHubActivityCard payload={github.payload} loading={github.loading} />
        </LiveProviderRegionComponent>
      </div>

      {/* Spotify + Discord — subordinate region */}
      <div className="col-span-4 mt-8 flex flex-col gap-8 md:col-span-3 md:col-start-6 md:mt-0 lg:col-span-4 lg:col-start-9">
        <LiveProviderRegionComponent
          providerId="spotify"
          state={resolveProviderState(spotify.loading, spotify.payload)}
          label="Spotify activity"
          minHeight="120px"
        >
          <SpotifyActivityCard payload={spotify.payload} loading={spotify.loading} />
        </LiveProviderRegionComponent>

        <LiveProviderRegionComponent
          providerId="discord"
          state={resolveProviderState(discord.loading, discord.payload)}
          label="Discord status"
          minHeight="100px"
        >
          <DiscordStatusCard payload={discord.payload} loading={discord.loading} />
        </LiveProviderRegionComponent>
      </div>
    </div>
  );
}
