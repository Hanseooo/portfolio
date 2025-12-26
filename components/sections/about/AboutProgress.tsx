"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function AboutProgress({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () =>
            containerRef.current ? containerRef.current.scrollWidth : 0,
          scrub: true,
          invalidateOnRefresh: true, 
        },
        transformOrigin: "left center",
      });
    }, containerRef); 

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50 w-40">
      <div className="h-0.5 w-full bg-foreground/10">
        <div ref={barRef} className="h-full w-full scale-x-0 bg-primary" />
      </div>
    </div>
  );
}
