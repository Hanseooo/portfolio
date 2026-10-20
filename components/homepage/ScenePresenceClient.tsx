"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import LiveProviderRegionComponent from "@/components/evidence/LiveProviderRegion";
import GitHubActivityCard, { GitHubContributionBand } from "@/components/sections/live-activity/GitHubActivityCard";
// Spotify hidden until SPOTIFY_REFRESH_TOKEN is re-minted (refresh docket, blocker 3).
// import SpotifyActivityCard from "@/components/sections/live-activity/SpotifyActivityCard";
import DiscordStatusCard from "@/components/sections/live-activity/DiscordStatusCard";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import type {
  ActivityResponse,
  GitHubActivity,
  // SpotifyActivity,
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
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "200px" });
  const revealed = useInView(sectionRef, { once: true, margin: "-100px" });

  const github = usePolledActivity<GitHubActivity>("/api/activity/github", 5 * 60 * 1000, inView);
  // const spotify = usePolledActivity<SpotifyActivity>("/api/activity/spotify", 20 * 1000, inView);
  const discord = usePolledActivity<DiscordActivity>("/api/activity/discord", 20 * 1000, inView);

  return (
    <motion.div 
      ref={sectionRef} 
      className="hp-grid relative isolate"
      initial={reducedMotion ? false : "hidden"}
      animate={reducedMotion ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } },
        hidden: {}
      }}
    >
      {/* Contribution band — full width, the expressive moment of this scene */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
        }}
        className="col-span-4 md:col-span-8 lg:col-span-12 relative z-10"
      >
        {/* Crop marks framing the band */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.3, ease: "easeOut" } }
          }}
          className="absolute -top-4 -left-4 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-[color:var(--cs-signal)] pointer-events-none origin-top-left hidden md:block" aria-hidden="true"
        />
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.3, ease: "easeOut" } }
          }}
          className="absolute -bottom-4 -right-4 w-8 md:w-12 h-8 md:h-12 border-b-2 border-r-2 border-[color:var(--cs-signal)] pointer-events-none origin-bottom-right hidden md:block" aria-hidden="true"
        />

        <LiveProviderRegionComponent
          providerId="github-calendar"
          state={resolveProviderState(github.loading, github.payload)}
          label="GitHub contributions"
          minHeight="320px"
        >
          <GitHubContributionBand payload={github.payload} loading={github.loading} revealed={revealed} />
        </LiveProviderRegionComponent>
      </motion.div>

      {/* GitHub details — reading column */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
        }}
        className="col-span-4 mt-16 md:col-span-5 md:mt-20 lg:col-span-7 relative z-10"
      >
        <LiveProviderRegionComponent
          providerId="github"
          state={resolveProviderState(github.loading, github.payload)}
          label="GitHub recent work"
        >
          <GitHubActivityCard payload={github.payload} loading={github.loading} />
        </LiveProviderRegionComponent>
      </motion.div>

      {/* Spotify + Discord — stepped down from the band, tied to it by a leader line */}
      <div className="relative col-span-4 mt-8 flex flex-col gap-8 md:col-span-3 md:col-start-6 md:mt-20 lg:col-span-4 lg:col-start-9 lg:mt-36">
        <div className="absolute -top-36 left-0 hidden h-36 w-px bg-[color:var(--cs-structural-line-strong)] lg:block" aria-hidden="true" />
        <div className="absolute -top-36 left-0 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-reading-surface)] lg:block" aria-hidden="true" />
        {/* Spotify hidden until the refresh token is fixed. Restore with the import and poll above.
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0, transition: reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <LiveProviderRegionComponent
            providerId="spotify"
            state={resolveProviderState(spotify.loading, spotify.payload)}
            label="Spotify activity"
            minHeight="120px"
          >
            <SpotifyActivityCard payload={spotify.payload} loading={spotify.loading} />
          </LiveProviderRegionComponent>
        </motion.div>
        */}

        <motion.div
          variants={{
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0, transition: reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <LiveProviderRegionComponent
            providerId="discord"
            state={resolveProviderState(discord.loading, discord.payload)}
            label="Discord status"
            minHeight="100px"
          >
            <DiscordStatusCard payload={discord.payload} loading={discord.loading} />
          </LiveProviderRegionComponent>
        </motion.div>
      </div>
    </motion.div>
  );
}
