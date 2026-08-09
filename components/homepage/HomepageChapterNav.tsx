"use client";

import { useCallback } from "react";
import { useSectionObserver } from "@/components/observation";
import { useAnchorConsumer } from "@/components/observation";
import { useCapability } from "@/components/providers/CapabilityProvider";
import {
  HOMEPAGE_CHAPTER_SEQUENCE,
  DESTINATIONS,
  type DestinationId,
} from "@/lib/destinations";
import { SECTION_IDS } from "@/lib/anchor-navigation";

const OBSERVED_IDS = [
  SECTION_IDS.identity,
  SECTION_IDS.flagships,
  SECTION_IDS.experience,
  SECTION_IDS.moreWork,
  SECTION_IDS.presence,
  SECTION_IDS.contact,
];

const CHAPTER_NUMBERS = ["01", "02", "03", "04", "05", "06"];

export default function HomepageChapterNav() {
  const activeId = useSectionObserver(OBSERVED_IDS);
  const { navigateToSection } = useAnchorConsumer();
  const { tier } = useCapability();

  const isHidden = tier === "mobile-touch" || tier === "webview-constrained";

  const handleClick = useCallback(
    (destId: DestinationId) => {
      navigateToSection(destId);
    },
    [navigateToSection]
  );

  if (isHidden) return null;

  return (
    <nav
      aria-label="Homepage sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex lg:flex-col lg:gap-1"
    >
      {HOMEPAGE_CHAPTER_SEQUENCE.map((destId, index) => {
        const dest = DESTINATIONS[destId];
        const sectionId = OBSERVED_IDS[index];
        const isActive = activeId === sectionId;

        return (
          <button
            key={destId}
            type="button"
            onClick={() => handleClick(destId)}
            className={`group flex h-9 items-center gap-2 rounded-[2px] px-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
              isActive
                ? "text-[color:var(--cs-signal)]"
                : "text-[color:var(--cs-text-secondary)] hover:text-[color:var(--cs-text-primary)]"
            }`}
            aria-label={dest.accessibleName}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-widest">
              {CHAPTER_NUMBERS[index]}
            </span>

            <span
              className={`hidden font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest transition-opacity lg:inline ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {dest.label.replace(/^\d+\s/, "")}
            </span>

            {isActive && (
              <span
                className="ml-1 h-px w-4 bg-[color:var(--cs-signal)]"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
