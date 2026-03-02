"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ToolGroup } from "./Tools/ToolGroup";
import { motion } from "framer-motion";
import { aboutContent } from "@/lib/about";
import { AboutPanelHeading, AboutPanelShell } from "./AboutPanelShell";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";


export default function ToolsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".tool-group", {
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
        className="bg-background dark:border-r"
        left={
          <AboutPanelHeading
            eyebrow={aboutContent.tools.eyebrow}
            title={aboutContent.tools.title}
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
            className="space-y-10"
          >
            {aboutContent.tools.groups.map((group) => (
              <ToolGroup key={group.title} title={group.title} tools={group.tools} />
            ))}
          </motion.div>
        }
      />
    </div>
  );
}
