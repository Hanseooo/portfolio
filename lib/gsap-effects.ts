// lib/gsap-effects.ts

/**
 * GSAP/ScrollTrigger effect modules — scoped scroll-linked depth.
 * S5 §10, S6 §8.3
 *
 * INVARIANTS:
 * - Only compositor-friendly transforms (translateY)
 * - No layout changes, no document reflow
 * - No pin spacers, no scroll locking
 * - Scoped trigger creation with explicit container boundary
 * - Teardown returns targets to valid state
 * - Never starts while Framer entrance is in-progress on same node
 * - Max 3 simultaneous scroll-linked compositions per frame
 */

import { gsap, ScrollTrigger } from "./gsap";
import { DISTANCE_BUDGET, type MotionTier } from "./motion-budget";

export interface GSAPEffectCleanup {
  /** Kill all timelines, triggers, and restore targets */
  destroy: () => void;
}

export interface HeroParallaxTargets {
  /** Container/section element for trigger boundary and layer lookup */
  containerEl: HTMLElement;
  /** Active motion tier — selects the distance budget */
  tier: MotionTier;
}

/** Layers opt in via `data-parallax-speed`, a multiple of the 18px budget. */
const PARALLAX_LAYER_SELECTOR = "[data-parallax-speed]";

/**
 * Hero parallax: each marked layer moves at a restrained relative speed
 * as the user scrolls through the identity scene.
 *
 * Negative speeds move UP (nearer planes), positive move DOWN (farther
 * planes). Text-bearing layers stay within ±1.0; decorative layers may
 * reach ±1.7 since nothing is read off them.
 *
 * - Bounded to container height — clean release at boundary
 * - Base distance: DISTANCE_BUDGET.heroParallax[tier] (72px desktop, 60px short)
 *
 * S5 §10.1: "Portrait, oversized professional name... may move at
 * restrained relative speeds."
 */
export function createHeroParallax(targets: HeroParallaxTargets): GSAPEffectCleanup {
  const { containerEl, tier } = targets;
  const distance = DISTANCE_BUDGET.heroParallax[tier];
  if (!distance) return { destroy: () => {} };

  const layers = Array.from(
    containerEl.querySelectorAll<HTMLElement>(PARALLAX_LAYER_SELECTOR),
  );

  const tweens = layers.map((el) => {
    const speed = Number(el.dataset.parallaxSpeed) || 0;
    return gsap.to(el, {
      y: distance * speed,
      ease: "none",
      scrollTrigger: {
        trigger: containerEl,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  });

  return {
    destroy: () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      if (layers.length) gsap.set(layers, { y: 0 });
    },
  };
}

export interface EvidenceDepthTargets {
  /** The image/frame element to apply depth to */
  targetEl: HTMLElement;
  /** Container element for trigger boundary */
  containerEl: HTMLElement;
  /** Direction: positive = moves down relative to content, negative = up */
  direction?: 1 | -1;
}

/**
 * Evidence depth: a selected screenshot or portrait frame moves at a
 * restrained bounded speed relative to its text companion.
 *
 * S5 §10.2: "Smaller depth relationships may appear in one or more
 * flagship screenshot/frame relationships; the personal-scene portrait."
 */
export function createEvidenceDepth(targets: EvidenceDepthTargets): GSAPEffectCleanup {
  const { targetEl, containerEl, direction = -1 } = targets;
  const distance = DISTANCE_BUDGET.parallax["full-desktop"] * 0.7; // ~12.6px — subtle

  const tween = gsap.to(targetEl, {
    y: distance * direction,
    ease: "none",
    scrollTrigger: {
      trigger: containerEl,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
  });

  return {
    destroy: () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(targetEl, { y: 0 });
    },
  };
}

/**
 * Refresh all ScrollTrigger instances — call after route change or
 * layout shift. Debounced internally by ScrollTrigger.
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

/**
 * Kill all active ScrollTrigger instances — call on route unmount.
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
