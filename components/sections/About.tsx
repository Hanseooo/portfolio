"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".about-panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => `+=${trackRef.current!.offsetWidth}`,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative h-screen bg-background">
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
      <div ref={trackRef} className="flex h-full w-max will-change-transform">
        <Panel title="About Me" />
        <Panel title="Skills" />
        <Panel title="Tools" />
        <Panel title="Philosophy" />
      </div>
    </section>
  );
}

function Panel({ title }: { title: string }) {
  return (
    <div className="about-panel flex h-screen w-screen items-center justify-center">
      <h2 className="text-primary text-6xl font-bold">{title}</h2>
    </div>
  );
}
