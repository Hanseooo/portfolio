"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { REVEAL_RECIPES, type RevealRecipeName } from "@/lib/motion-recipes";
import type { ReactNode } from "react";

interface StructuredRevealProps {
  /** Named recipe to apply */
  recipe: RevealRecipeName;
  /** Content to reveal */
  children: ReactNode;
  /** Optional className on wrapper */
  className?: string;
  /** Optional: override viewport amount */
  viewportAmount?: number;
  /** Stable identifier used by a nested GSAP effect waiting for entrance completion */
  revealId?: string;
  /** Called only after the eligible entrance reaches its final state */
  onRevealComplete?: () => void;
}

/**
 * Structured reveal wrapper — S5 §9, S6 §8.2.
 *
 * Applies a named Framer recipe as progressive enhancement.
 * - Reduced-motion: renders children immediately (no wrapper animation)
 * - Once per route visit (Framer `once: true` in viewport)
 * - Focus/anchor/restoration resolves immediately via Framer's built-in behavior
 * - CSS baseline [data-motion-target] keeps content visible if JS fails
 */
export default function StructuredReveal({
  recipe,
  children,
  className = "",
  viewportAmount,
  revealId,
  onRevealComplete,
}: StructuredRevealProps) {
  const { tier, structuredReveal } = useCapability();
  const ref = useRef<HTMLDivElement>(null);
  const [focusForced, setFocusForced] = useState(false);

  const recipeData = REVEAL_RECIPES[recipe];
  const variants = recipeData.getVariants(tier);
  const inView = useInView(ref, {
    once: true,
    amount: viewportAmount ?? recipeData.viewportAmount,
  });

  // No animation: reduced-motion, restoration, webview, or ineligible.
  if (!structuredReveal || !variants) {
    return <div className={className}>{children}</div>;
  }

  const resolved = inView || focusForced;

  return (
    <motion.div
      ref={ref}
      data-reveal-id={revealId}
      className={className}
      variants={{
        initial: variants.initial,
        animate: {
          ...variants.animate,
          transition: variants.transition,
        },
      }}
      initial="initial"
      animate={resolved ? "animate" : "initial"}
      onFocusCapture={() => setFocusForced(true)}
      onAnimationComplete={() => {
        if (!resolved) return;
        onRevealComplete?.();
        if (revealId) {
          window.dispatchEvent(
            new CustomEvent("portfolio:reveal-complete", { detail: { revealId } })
          );
        }
      }}
    >
      {children}
    </motion.div>
  );
}
