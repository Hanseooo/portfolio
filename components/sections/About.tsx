"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import AboutMePanel from "./about/AboutMePanel";
import SkillsPanel from "./about/SkillsPanel";
import PhilosophyPanel from "./about/PhilosophyPanel";
import AboutProgress from "./about/AboutProgress";
import ToolsPanel from "./about/ToolsPanel";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-panel");

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          end: () => {
            const vw = window.innerWidth;
            return `+=${vw * (panels.length - 1)}`;
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-background"
    >
      <GridPattern
        width={80}
        height={80}
        squares={[
          [4, 9],
          [5, 1],
          [24, 12],
          [10, 3],
          [3, 4],
        ]}
        className="absolute inset-0 -z-10 w-full h-full text-gray-400/30 dark:text-gray-700/30"
      />

      <AboutProgress containerRef={sectionRef} />

      <div ref={trackRef} className="flex h-full w-max will-change-transform">
        <AboutMePanel />
        <SkillsPanel />
        <ToolsPanel />
        <PhilosophyPanel />
      </div>
    </section>
  );
}
