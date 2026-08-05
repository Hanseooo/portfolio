"use client";

import { useEffect, useRef } from "react";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { createHeroParallax, type GSAPEffectCleanup } from "@/lib/gsap-effects";

interface HeroDepthEffectProps {
  /** Stable server-rendered section id */
  containerId: string;
  /** Optional reveal event that must complete before ScrollTrigger setup */
  waitForRevealId?: string;
}

/**
 * Tiny client effect island. The hero scene remains a Server Component;
 * this module queries only explicitly marked nested targets after hydration.
 * Layers opt in with `data-parallax-speed` in the scene markup.
 */
export default function HeroDepthEffect({
  containerId,
  waitForRevealId,
}: HeroDepthEffectProps) {
  const { parallaxEligible, tier } = useCapability();
  const cleanupRef = useRef<GSAPEffectCleanup | null>(null);

  useEffect(() => {
    if (!parallaxEligible) return;

    let cancelled = false;
    const initialize = () => {
      if (cancelled || cleanupRef.current) return;
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;
      cleanupRef.current = createHeroParallax({ containerEl, tier });
    };

    const onRevealComplete = (event: Event) => {
      const revealId = (event as CustomEvent<{ revealId: string }>).detail?.revealId;
      if (revealId === waitForRevealId) initialize();
    };

    if (waitForRevealId) {
      window.addEventListener("portfolio:reveal-complete", onRevealComplete);
    } else {
      requestAnimationFrame(initialize);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("portfolio:reveal-complete", onRevealComplete);
      cleanupRef.current?.destroy();
      cleanupRef.current = null;
    };
  }, [containerId, parallaxEligible, tier, waitForRevealId]);

  return null;
}
