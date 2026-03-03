"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import TechStackSvg from "@/components/svg/TechStackSvg";
import type { AboutToolGroup } from "@/lib/about";
import { AnimatePresence, motion } from "framer-motion";
import { getMotionMode, motionTokens } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

type AboutMobileAccordionProps = {
  groups: AboutToolGroup[];
};

export default function AboutMobileAccordion({ groups }: AboutMobileAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const accordionId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const motionMode = getMotionMode({ reducedMotion, isMobile: true });
  const accordionDuration =
    motionMode === "reduced"
      ? motionTokens.duration.fast
      : motionMode === "mobile"
        ? motionTokens.duration.base
        : motionTokens.duration.feature;

  return (
    <div className="space-y-4">
      {groups.map((group, index) => {
        const isOpen = openIndex === index;
        const panelId = `${accordionId}-panel-${index}`;
        const buttonId = `${accordionId}-button-${index}`;

        return (
          <motion.section
            layout
            key={group.title}
            className="overflow-hidden rounded-xl border border-foreground/20 bg-background/70"
          >
            <h4>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] opacity-80 sm:text-sm">
                  {group.title}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{
                    duration: accordionDuration,
                    ease: motionTokens.framerEase.emphasis,
                  }}
                  className="shrink-0"
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </motion.span>
              </button>
            </h4>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={
                    reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
                  }
                  animate={
                    reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
                  }
                  exit={
                    reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: accordionDuration,
                    ease: motionTokens.framerEase.enter,
                  }}
                  className="overflow-hidden border-t border-foreground/15"
                >
                  <div className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {group.tools.map((tool) => (
                        <span
                          key={tool.label}
                          className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-foreground/20 bg-muted-foreground/5 px-3 py-1 text-xs sm:text-sm"
                        >
                          <TechStackSvg id={tool.id} className="shrink-0" />
                          <span className="truncate">{tool.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}
