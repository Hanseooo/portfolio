"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { motionTokens, prefersReducedMotion } from "@/lib/motion";

export function FadeIn(children: ReactNode) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      ref.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: motionTokens.duration.feature,
        ease: motionTokens.gsapEase.enter,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
