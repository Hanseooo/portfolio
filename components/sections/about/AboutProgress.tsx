"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AboutProgress({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !barRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => {
        const panels = sectionRef.current!.querySelectorAll(".about-panel");
        return `+=${window.innerWidth * (panels.length - 1)}`;
      },
      scrub: true,
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
    <div className="pointer-events-none fixed bottom-6 left-6 right-6 z-60">
      <div className="h-0.5 w-full bg-foreground/10 overflow-hidden">
        <div ref={barRef} className="h-full w-full bg-primary scale-x-0" />
      </div>
    </div>
  );
}
