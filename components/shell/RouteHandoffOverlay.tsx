"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";
import { EASING_BUDGET } from "@/lib/motion-budget";

/** Blueprint corner bracket — thin L-shaped SVG mark, accent-colored */
function CornerBracket({
  position,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  const ARM = 28; // px arm length
  const STROKE = 1.5;
  const SIZE = ARM + STROKE * 2;

  // Each corner uses mirrored transforms for correct L orientation
  const positionClass = {
    tl: "top-8 left-8",
    tr: "top-8 right-8",
    bl: "bottom-8 left-8",
    br: "bottom-8 right-8",
  }[position];

  // SVG path draws an L from corner
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
        duration: 0.2,
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
 * Route-handoff visual overlay — S5 §7.
 * Renders the cover/reveal planes during eligible route transitions.
 * Visual: blueprint corner brackets + centred brand wordmark.
 */
export default function RouteHandoffOverlay() {
  const { phase, isActive } = useRouteHandoff();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="route-handoff"
          initial={{ y: "100%" }}
          animate={phase === "revealing" ? { y: "-100%" } : { y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: phase === "revealing" ? 0.4 : 0.3,
            ease: EASING_BUDGET.fluidCinematic.framer,
          }}
          className="pointer-events-none fixed inset-0 z-[9000] bg-[color:var(--cs-foundation)]"
          aria-hidden="true"
        >
          {/* Blueprint corner brackets */}
          <CornerBracket position="tl" delay={0.05} />
          <CornerBracket position="tr" delay={0.1} />
          <CornerBracket position="bl" delay={0.1} />
          <CornerBracket position="br" delay={0.05} />

          {/* Centred brand signal during cover */}
          <div className="flex h-full items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,4vw,3rem)] uppercase tracking-wider text-[color:var(--cs-text-secondary)] opacity-30">
              Hanseo
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
