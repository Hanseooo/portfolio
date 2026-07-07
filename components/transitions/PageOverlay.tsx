"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

const LETTERS = "HANSEO".split("");

export default function PageOverlay({ active }: { active: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scanRef = useRef<HTMLDivElement>(null);
  // ponytail: skip exit animation on initial mount — active=false fires the else branch before any enter
  const hasMountedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const overlay = overlayRef.current;
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const scan = scanRef.current;
    if (!overlay || letters.length === 0) return;

    if (active) {
      gsap.killTweensOf([overlay, scan, ...letters]);
      gsap.set(overlay, { y: "100%" });
      gsap.set(letters, { clipPath: "inset(0 0 100% 0)" });
      if (scan) gsap.set(scan, { y: 0 });

      if (reducedMotion) {
        gsap.set(overlay, { y: "0%" });
        gsap.set(letters, { clipPath: "inset(0 0 0% 0)" });
        return;
      }

      overlay.style.willChange = "transform";
      gsap.timeline({ onComplete: () => { overlay.style.willChange = "auto"; } })
        .to(overlay, { y: "0%", duration: 0.75, ease: "power4.out" })
        .to(scan, { y: "100vh", duration: 0.5, ease: "power3.out" }, "-=0.4")
        .to(letters, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        }, "-=0.4");
    } else {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }

      gsap.killTweensOf([overlay, scan, ...letters]);

      if (reducedMotion) {
        gsap.set(overlay, { y: "-100%" });
        return;
      }

      overlay.style.willChange = "transform";
      gsap.timeline({ onComplete: () => { overlay.style.willChange = "auto"; } })
        .to(letters, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.3,
          ease: "power3.in",
          stagger: { each: 0.04, from: "end" },
        })
        .to(overlay, { y: "-100%", duration: 0.75, ease: "power4.inOut" }, "-=0.1");
    }
  }, [active, reducedMotion]);

  return (
    <div
      ref={overlayRef}
      // ponytail: CSS initial hide prevents flash before JS runs
      style={{ transform: "translateY(-100%)" }}
      className="pointer-events-none fixed inset-0 z-200 flex items-center justify-center bg-background overflow-hidden"
    >
      <div
        ref={scanRef}
        className="absolute top-0 left-0 right-0 h-px bg-primary pointer-events-none"
      />
      <div className="flex overflow-hidden">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={el => { letterRefs.current[i] = el; }}
            style={{ clipPath: "inset(0 0 100% 0)", display: "inline-block" }}
            className="font-sans text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
