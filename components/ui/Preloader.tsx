"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

const HOLD_MS = 1500;
const LETTERS = "HANSEO".split("");

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  // ponytail: ref instead of state — read only at exit time, no re-render needed
  const isFirstVisit = useRef(false);

  useEffect(() => {
    isFirstVisit.current = true;
    const timer = setTimeout(() => setIsLoading(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isFirstVisit.current || reducedMotion) return;
    let frame = 0;
    const totalFrames = Math.floor(HOLD_MS / 16);
    const id = setInterval(() => {
      frame++;
      setCount(Math.min(100, Math.round((frame / totalFrames) * 100)));
      if (frame >= totalFrames) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={
            !isFirstVisit.current || reducedMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : { y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }
          }
          className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {!reducedMotion && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "100vh" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-px bg-primary pointer-events-none"
            />
          )}

          <div className="flex overflow-hidden">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ clipPath: reducedMotion ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reducedMotion ? 0 : 0.5 + i * 0.06,
                }}
                className="font-sans text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.45, duration: 0.3 }}
            className="mt-6 font-mono text-[10px] tracking-[0.3em] text-primary"
          >
            {reducedMotion ? "100" : String(count).padStart(2, "0")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.6, duration: 0.4 }}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Portfolio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
