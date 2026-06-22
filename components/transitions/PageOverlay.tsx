"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function PageOverlay({ active }: { active: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !textRef.current) return;

    if (active) {
      gsap.set(overlayRef.current, { y: "100%" });
      gsap.set(textRef.current, { y: 30, opacity: 0 });

      gsap
        .timeline()
        .to(overlayRef.current, { y: "0%", duration: 0.75, ease: "power4.out" })
        .to(
          textRef.current,
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
          "-=0.35"
        );
    } else {
      gsap
        .timeline()
        .to(textRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.35,
          ease: "power3.in",
        })
        .to(
          overlayRef.current,
          { y: "-100%", duration: 0.75, ease: "power4.inOut" },
          "-=0.1"
        );
    }
  }, [active]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none will-change-transform fixed inset-0 z-200 flex items-center justify-center bg-background"
    >
      <h1
        ref={textRef}
        className="font-sans text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
      >
        HANSEO
      </h1>
    </div>
  );
}
