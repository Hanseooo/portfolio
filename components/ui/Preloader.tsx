"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

const HOLD_MS = 1500;
const LETTERS = "HANSEO".split("");
const COLS = 5;

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
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
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
          // We don't animate the container out immediately, wait for the columns to slide up
          exit={{ visibility: "hidden", transition: { delay: 1.5 } }} 
        >
          {/* Glass Columns */}
          <div className="absolute inset-0 flex w-full h-full">
            {Array.from({ length: COLS }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                exit={{
                  y: "-100%",
                  transition: {
                    duration: 0.85,
                    ease: [0.76, 0, 0.24, 1],
                    delay: i * 0.08,
                  },
                }}
                className="h-full flex-1 border-r border-[color:var(--cs-structural-line)] bg-white/20 dark:bg-black/40 backdrop-blur-2xl last:border-r-0 will-change-transform"
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center z-10">
            {/* Hollow Text */}
            <div className="flex overflow-hidden drop-shadow-2xl">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ clipPath: reducedMotion ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  exit={{
                    clipPath: "inset(0 0 100% 0)",
                    transition: {
                      duration: 0.4,
                      ease: [0.76, 0, 0.24, 1],
                      delay: (LETTERS.length - 1 - i) * 0.04,
                    },
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: reducedMotion ? 0 : 0.5 + i * 0.06,
                  }}
                  className="font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,10rem)] font-black leading-[0.85] tracking-tight text-transparent [-webkit-text-stroke:2px_var(--cs-text-primary)]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ delay: reducedMotion ? 0 : 0.45, duration: 0.3 }}
              className="mt-8 font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[color:var(--cs-signal-text)] uppercase"
            >
              SYS.BOOT // {reducedMotion ? "100" : String(count).padStart(3, "0")}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
