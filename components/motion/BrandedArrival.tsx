"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { EASING_BUDGET } from "@/lib/motion-budget";

/**
 * Hold before exit.
 * 900ms hold + 600ms exit = ~1.5s total.
 * Previous: 650ms + 450ms = 1.1s (felt too fast and clunky).
 */
const ARRIVAL_HOLD_MS = 900;

/** Blueprint corner bracket — identical to RouteHandoffOverlay variant */
function CornerBracket({
  position,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  const ARM = 28;
  const STROKE = 1.5;
  const SIZE = ARM + STROKE * 2;

  const positionClass = {
    tl: "top-10 left-10",
    tr: "top-10 right-10",
    bl: "bottom-10 left-10",
    br: "bottom-10 right-10",
  }[position];

  const path = {
    tl: `M ${SIZE} ${STROKE} L ${STROKE} ${STROKE} L ${STROKE} ${SIZE}`,
    tr: `M ${STROKE} ${STROKE} L ${SIZE} ${STROKE} L ${SIZE} ${SIZE}`,
    bl: `M ${SIZE} ${SIZE} L ${STROKE} ${SIZE} L ${STROKE} ${STROKE}`,
    br: `M ${STROKE} ${SIZE} L ${SIZE} ${SIZE} L ${SIZE} ${STROKE}`,
  }[position];

  return (
    <motion.div
      className={`absolute ${positionClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.25,
        ease: EASING_BUDGET.decisiveEditorial.framer,
        delay,
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d={path}
          stroke="var(--cs-signal)"
          strokeWidth={STROKE}
          strokeLinecap="square"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Branded full-load arrival — S5 §6, S6 §8.6.
 *
 * INVARIANTS:
 * - Only on full document loads (not client-side navigations)
 * - No fake progress counter or determinate percentage
 * - ~1.5s target (900ms hold + 600ms exit); exits via upward plane reveal
 * - Restoration (back/forward) bypasses entirely via immediate hide
 * - Reduced-motion/webview: dismissed immediately on initialization (no flash)
 * - Constructed Signal typography: "HANSEO" with brand treatment
 *
 * FLASH FIX:
 * visible starts true and the overlay always renders from the very first
 * server/hydration pass — a plain foundation-color cover until capability
 * is resolved. This eliminates the content flash that occurred when the
 * old code returned null during the !initialized window.
 */
export default function BrandedArrival() {
  const { brandedArrival, tier, initialized } = useCapability();
  // Always starts visible — the cover is present from SSR through animation.
  const [visible, setVisible] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!initialized) return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Not eligible — dismiss immediately, no animation.
    if (!brandedArrival || tier === "reduced-motion" || tier === "webview-constrained") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    // Restoration bypass: back/forward navigations skip the arrival.
    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const navigationApiEntry = "navigation" in window
      ? (window as Window & { navigation?: { currentEntry?: { navigationType?: string } } })
          .navigation?.currentEntry
      : undefined;
    if (
      navigationEntry?.type === "back_forward" ||
      navigationApiEntry?.navigationType === "traverse"
    ) {
      setVisible(false);
      return;
    }

    const utilityIsImmediate = () =>
      document.querySelector('[data-utility-priority="immediate"]') !== null;

    // Error/not-found recovery outranks decorative arrival.
    if (utilityIsImmediate()) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const resolveImmediately = () => {
      if (!utilityIsImmediate()) return;
      setVisible(false);
      document.body.style.overflow = "";
    };
    const observer = new MutationObserver(resolveImmediately);
    observer.observe(document.body, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, ARRIVAL_HOLD_MS);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.body.style.overflow = "";
    };
  }, [initialized, brandedArrival, tier]);

  // Determine whether to show the full branded content.
  // During !initialized we show only the plain cover — no animated elements.
  const showBrandedContent =
    initialized &&
    brandedArrival &&
    tier !== "reduced-motion" &&
    tier !== "webview-constrained";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="branded-arrival"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.6,
            ease: EASING_BUDGET.fluidCinematic.framer,
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[color:var(--cs-foundation)] overflow-hidden"
          aria-hidden="true"
        >
          {showBrandedContent && (
            <>
              {/* Blueprint corner brackets */}
              <CornerBracket position="tl" delay={0.1} />
              <CornerBracket position="tr" delay={0.15} />
              <CornerBracket position="bl" delay={0.15} />
              <CornerBracket position="br" delay={0.1} />

              {/* Signal scan line */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "100vh" }}
                transition={{
                  duration: 0.55,
                  ease: EASING_BUDGET.decisiveEditorial.framer,
                  delay: 0.15,
                }}
                className="absolute top-0 left-0 right-0 h-px bg-[color:var(--cs-signal)]"
              />

              {/* Brand wordmark */}
              <div className="flex overflow-hidden">
                {"HANSEO".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0 0 0% 0)" }}
                    transition={{
                      duration: 0.5,
                      ease: EASING_BUDGET.decisiveEditorial.framer,
                      delay: 0.3 + i * 0.055,
                    }}
                    className="font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,7rem)] font-normal uppercase leading-[0.85] tracking-tighter text-[color:var(--cs-text-primary)]"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.35 }}
                className="absolute bottom-12 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--cs-text-secondary)]"
              >
                Portfolio
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
