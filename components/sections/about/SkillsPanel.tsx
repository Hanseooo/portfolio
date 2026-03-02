"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { aboutContent } from "@/lib/about";
import { AboutPanelHeading, AboutPanelShell } from "./AboutPanelShell";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";


export default function SkillsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".skill-group", {
        y: 40,
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
        className="bg-background dark:border-r dark:bg-transparent"
        left={
          <AboutPanelHeading
            eyebrow={aboutContent.skills.eyebrow}
            title={aboutContent.skills.title}
          />
        }
        right={
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            whileInView={reducedMotion ? undefined : { opacity: 1 }}
            transition={
              reducedMotion ? undefined : { duration: 0.5, ease: "easeOut" }
            }
            viewport={reducedMotion ? undefined : { once: true, amount: 0.4 }}
            className="space-y-8"
          >
            {aboutContent.skills.groups.map((group) => (
              <SkillGroup key={group.title} title={group.title} items={group.items} />
            ))}
          </motion.div>
        }
      />
    </div>
  );
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="skill-group border-l border-foreground/20 pl-4 sm:pl-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h3>
      <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed opacity-85 marker:text-primary sm:text-base md:text-lg">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
