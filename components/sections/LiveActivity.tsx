"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GitHubActivityCard from "@/components/sections/live-activity/GitHubActivityCard";
import SpotifyActivityCard from "@/components/sections/live-activity/SpotifyActivityCard";
import DiscordStatusCard from "@/components/sections/live-activity/DiscordStatusCard";
import {
  getEnterY,
  getMotionMode,
  motionTokens,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { useClientReady } from "@/components/utils/useClientReady";
import type {
  ActivityErrorCode,
  ActivityResponse,
  DiscordActivity,
  GitHubActivity,
  SpotifyActivity,
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
    error: {
      code,
      message,
    },
  };
}

function usePolledActivity<T>(url: string, intervalMs: number) {
  const [state, setState] = useState<ActivityState<T>>({
    payload: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const update = async () => {
      try {
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = (await response.json()) as ActivityResponse<T>;
        if (cancelled) return;

        setState({
          payload,
          loading: false,
        });
      } catch {
        if (cancelled) return;

        setState({
          payload: buildClientErrorResponse<T>("Live activity is temporarily unavailable."),
          loading: false,
        });
      }
    };

    void update();

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
  }, [intervalMs, url]);

  return state;
}

export default function LiveActivity() {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const motionMode = getMotionMode({
    reducedMotion,
    isMobile: runtimeEnv.isMobile,
  });
  const headingEnter = getEnterY("accent", motionMode);
  const cardEnter = getEnterY("subtle", motionMode);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const github = usePolledActivity<GitHubActivity>("/api/activity/github", 5 * 60 * 1000);
  const spotify = usePolledActivity<SpotifyActivity>("/api/activity/spotify", 20 * 1000);
  const discord = usePolledActivity<DiscordActivity>("/api/activity/discord", 20 * 1000);

  const payloads = [github.payload, spotify.payload, discord.payload].filter(Boolean) as Array<
    ActivityResponse<GitHubActivity> |
    ActivityResponse<SpotifyActivity> |
    ActivityResponse<DiscordActivity>
  >;
  const hasAnyOk = payloads.some((payload) => payload.ok);
  const hasAnyError = payloads.some((payload) => !payload.ok);
  const latestTimestamp = payloads
    .map((payload) => new Date(payload.updatedAt).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a)[0];
  const staleMs = latestTimestamp ? now.getTime() - latestTimestamp : Number.POSITIVE_INFINITY;

  const liveState = github.loading || spotify.loading || discord.loading
    ? "connecting"
    : !hasAnyOk
      ? "offline"
      : staleMs > 90_000
        ? "delayed"
        : hasAnyError
          ? "degraded"
          : "live";

  const liveStateLabelMap = {
    connecting: "Connecting",
    offline: "Offline",
    delayed: "Delayed",
    degraded: "Partial",
    live: "Live",
  } as const;

  const liveStateClassMap = {
    connecting: "bg-amber-400",
    offline: "bg-foreground/45",
    delayed: "bg-amber-500",
    degraded: "bg-orange-500",
    live: "bg-emerald-500",
  } as const;

  return (
    <section id="live-activity" className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={headingEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <h2 className="font-black text-primary">
          <span className="mb-3 block text-xs uppercase tracking-[0.26em] text-primary/80">
            Live Signals
          </span>
          <span className="text-[clamp(2rem,7vw,4rem)]">Live Activity</span>
        </h2>
        <div className="mt-5 inline-flex items-center gap-2 border border-foreground/20 bg-background/80 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-foreground/80">
          <span
            className={`h-2.5 w-2.5 rounded-full ${liveStateClassMap[liveState]} ${
              liveState === "live" ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          />
          <span>{liveStateLabelMap[liveState]}</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
          What I am building, listening to, and where I am active right now.
        </p>
      </motion.div>

      <motion.div
        initial={cardEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
          delay: reducedMotion ? 0 : motionTokens.stagger.text,
        }}
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-8">
          <GitHubActivityCard payload={github.payload} loading={github.loading} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <SpotifyActivityCard payload={spotify.payload} loading={spotify.loading} />
          <DiscordStatusCard payload={discord.payload} loading={discord.loading} now={now} />
        </div>
      </motion.div>
    </section>
  );
}
