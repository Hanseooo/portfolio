"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function PhilosophyPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".philosophy-line", {
        y: 24,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
        },
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="about-panel bg-background flex flex-col justify-center h-screen w-screen px-6 md:px-12 gap-8 text-center md:text-left"
    >
      <span className="text-xs uppercase tracking-[0.3em] opacity-60">
        Philosophy
      </span>

      <h2 className="philosophy-line text-primary text-4xl md:text-[clamp(3rem,6vw,5rem)] font-bold leading-tight">
        Build systems,
        <br />
        not screens.
      </h2>

      <div className="mt-6 md:mt-12 space-y-4 md:space-y-6 text-lg opacity-80 max-w-3xl mx-auto md:mx-0">
        <p className="philosophy-line">
          I believe great products are engineered with clarity, structure, and
          intent — not just assembled.
        </p>
        <p className="philosophy-line">
          Motion, design, and code should work together to communicate purpose,
          not distract from it.
        </p>
        <p className="philosophy-line">
          Every decision should scale — visually, technically, and conceptually.
        </p>
      </div>
    </div>
  );
}
