"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { aboutContent } from "@/lib/about";
import { AboutPanelHeading, AboutPanelShell } from "./AboutPanelShell";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";


export default function PhilosophyPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

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
  }, [reducedMotion]);

  return (
    <div ref={panelRef}>
      <AboutPanelShell
        className="bg-background"
        leftClassName="flex items-center"
        rightClassName="mx-auto max-w-3xl"
        left={
          <AboutPanelHeading
            eyebrow={aboutContent.philosophy.eyebrow}
            title={aboutContent.philosophy.title}
            titleClassName="philosophy-line text-4xl md:text-[clamp(3rem,6vw,5rem)]"
          />
        }
        right={
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            whileInView={reducedMotion ? undefined : { opacity: 1 }}
            transition={
              reducedMotion ? undefined : { duration: 0.5, ease: "easeOut" }
            }
            viewport={reducedMotion ? undefined : { once: true, amount: 0.25 }}
            className="space-y-4 text-center text-lg opacity-80 md:space-y-6 md:text-left"
          >
            {aboutContent.philosophy.lines.map((line) => (
              <p key={line} className="philosophy-line">
                {line}
              </p>
            ))}
          </motion.div>
        }
      />
    </div>
  );
}
