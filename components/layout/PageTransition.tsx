"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current || reducedMotion) {
      if (overlayRef.current) gsap.set(overlayRef.current, { display: "none" });
      return;
    }

    const tl = gsap.timeline();

    // Cinematic Wipe Overlay
    tl.to(overlayRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1.2,
      ease: "power4.inOut",
    })
    // Content Reveal
    .fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.98,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        clearProps: "all"
      },
      "-=0.8" // Overlap the animations heavily
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 z-[100] bg-background pointer-events-none origin-top"
      />
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
}
