"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { BBH_Bartle } from "next/font/google";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
});

export default function PageOverlay({ active }: { active: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !textRef.current) return;

    if (active) {
      // ENTER
      gsap.set(overlayRef.current, { y: "100%" });
      gsap.set(textRef.current, { y: 40, opacity: 0 });

      gsap
        .timeline()
        .to(overlayRef.current, {
          y: "0%",
          duration: 0.9,
          ease: "power4.out",
        })
        .to(
          textRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
    } else {
      // EXIT
      gsap
        .timeline()
        .to(textRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        })
        .to(
          overlayRef.current,
          {
            y: "-100%",
            duration: 0.9,
            ease: "power4.inOut",
          },
          "-=0.1"
        );
    }
  }, [active]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none will-change-transform border-y-2 shadow border-primary fixed inset-0 z-100 flex items-center justify-center bg-background"
    >
      <h1
        ref={textRef}
        className={` ${bbhBartle.className} text-[clamp(3rem,10vw,8rem)] font-black italic text-primary tracking-tight`}
      >
        HANSEO
      </h1>
    </div>
  );
}
