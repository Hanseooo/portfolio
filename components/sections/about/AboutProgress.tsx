"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

export default function AboutProgress({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !barRef.current) return;
    if (prefersReducedMotion()) return;

    const getDistance = () => {
      const panels = sectionRef.current!.querySelectorAll(".about-panel");
      const isShortHeight = window.innerHeight < 820;
      const base = window.innerWidth * (panels.length - 1);
      return isShortHeight ? base * 1.2 : base;
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${getDistance()}`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        gsap.set(barRef.current!, {
          scaleX: self.progress,
          transformOrigin: "left center",
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 w-[calc(100%-3rem)] -translate-x-1/2 md:bottom-8 md:w-[calc(100%-5rem)]">
      <div className="mx-auto h-0.5 w-full max-w-5xl overflow-hidden bg-foreground/12">
        <div ref={barRef} className="h-full w-full bg-primary scale-x-0" />
      </div>
    </div>
  );
}
