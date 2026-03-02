"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import TechStackSvg from "@/components/svg/TechStackSvg";
import type { AboutToolGroup } from "@/lib/about";

type AboutMobileAccordionProps = {
  groups: AboutToolGroup[];
};

export default function AboutMobileAccordion({ groups }: AboutMobileAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const accordionId = useId();

  return (
    <div className="space-y-3">
      {groups.map((group, index) => {
        const isOpen = openIndex === index;
        const panelId = `${accordionId}-panel-${index}`;
        const buttonId = `${accordionId}-button-${index}`;

        return (
          <section
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
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                  aria-hidden="true"
                />
              </button>
            </h4>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`${isOpen ? "block" : "hidden"} border-t border-foreground/15 px-4 py-3`}
            >
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
          </section>
        );
      })}
    </div>
  );
}
