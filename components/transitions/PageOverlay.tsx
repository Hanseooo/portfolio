"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

const LETTERS = "HANSEO".split("");
const COLS = 5; // Number of architectural columns

export default function PageOverlay({ active }: { active: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  // ponytail: skip exit animation on initial mount — active=false fires the else branch before any enter
  const hasMountedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const overlay = overlayRef.current;
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const cols = colRefs.current.filter(Boolean) as HTMLDivElement[];
    
    if (!overlay || letters.length === 0 || cols.length === 0) return;

    if (active) {
      gsap.killTweensOf([overlay, ...cols, ...letters]);
      gsap.set(overlay, { visibility: "visible" });
      
      // Start positions
      gsap.set(cols, { y: "100%" });
      gsap.set(letters, { clipPath: "inset(0 0 100% 0)" });

      if (reducedMotion) {
        gsap.set(cols, { y: "0%" });
        gsap.set(letters, { clipPath: "inset(0 0 0% 0)" });
        return;
      }

      gsap.timeline()
        .to(cols, { 
          y: "0%", 
          duration: 0.85, 
          ease: "power4.inOut", 
          stagger: 0.08 
        })
        .to(letters, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
        }, "-=0.4");
    } else {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }

      gsap.killTweensOf([overlay, ...cols, ...letters]);

      if (reducedMotion) {
        gsap.set(overlay, { visibility: "hidden" });
        return;
      }

      gsap.timeline({ onComplete: () => gsap.set(overlay, { visibility: "hidden" }) })
        .to(letters, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.4,
          ease: "power3.in",
          stagger: { each: 0.04, from: "end" },
        })
        .to(cols, {
          y: "-100%", // slide out to the top
          duration: 0.85,
          ease: "power4.inOut",
          stagger: 0.08,
        }, "-=0.2");
    }
  }, [active, reducedMotion]);

  return (
    <div
      ref={overlayRef}
      // ponytail: CSS initial hide prevents flash before JS runs
      style={{ visibility: "hidden" }}
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
    >
      {/* Background Staggered Glass Columns */}
      <div className="absolute inset-0 flex w-full h-full">
        {Array.from({ length: COLS }).map((_, i) => (
          <div
            key={i}
            ref={el => { colRefs.current[i] = el; }}
            className="h-full flex-1 border-r border-[color:var(--cs-structural-line)] bg-white/20 dark:bg-black/40 backdrop-blur-2xl last:border-r-0 will-change-transform"
            style={{ transform: "translateY(100%)" }}
          />
        ))}
      </div>

      {/* Glass Outline Text */}
      <div className="relative flex overflow-hidden z-10 drop-shadow-2xl">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={el => { letterRefs.current[i] = el; }}
            style={{ clipPath: "inset(0 0 100% 0)", display: "inline-block" }}
            className="font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,10rem)] font-black leading-[0.85] tracking-tight text-transparent [-webkit-text-stroke:2px_var(--cs-text-primary)]"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
