"use client";

import { useEffect, useRef } from "react";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { createEvidenceDepth, type GSAPEffectCleanup } from "@/lib/gsap-effects";

interface EvidenceDepthEffectProps {
  containerId: string;
  targetSelector: string;
  direction?: 1 | -1;
  /** Reveal completion that gates ScrollTrigger setup */
  waitForRevealId: string;
}

/** Bounded selected-evidence depth attached as a tiny client effect island. */
export default function EvidenceDepthEffect({
  containerId,
  targetSelector,
  direction = -1,
  waitForRevealId,
}: EvidenceDepthEffectProps) {
  const { parallaxEligible } = useCapability();
  const cleanupRef = useRef<GSAPEffectCleanup | null>(null);

  useEffect(() => {
    if (!parallaxEligible) return;

    let cancelled = false;
    const initialize = () => {
      if (cancelled || cleanupRef.current) return;
      const containerEl = document.getElementById(containerId);
      const targetEl = containerEl?.querySelector<HTMLElement>(targetSelector);
      if (!containerEl || !targetEl) return;
      cleanupRef.current = createEvidenceDepth({ targetEl, containerEl, direction });
    };

    const onRevealComplete = (event: Event) => {
      const revealId = (event as CustomEvent<{ revealId: string }>).detail?.revealId;
      if (revealId === waitForRevealId) initialize();
    };
    window.addEventListener("portfolio:reveal-complete", onRevealComplete);

    return () => {
      cancelled = true;
      window.removeEventListener("portfolio:reveal-complete", onRevealComplete);
      cleanupRef.current?.destroy();
      cleanupRef.current = null;
    };
  }, [containerId, direction, parallaxEligible, targetSelector, waitForRevealId]);

  return null;
}
