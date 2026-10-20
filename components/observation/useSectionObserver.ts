"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Native IntersectionObserver hook for section tracking — S5 §13, S6 §11.
 *
 * Uses the upper-third heading-crossing rule:
 * - Active section advances when the next heading crosses the upper 33% threshold
 * - Short sections still become current when their heading crosses
 * - No browser-history entries on passive observation
 * - No scroll-linked animation — pure state tracking
 *
 * @param sectionIds - Ordered array of section IDs to observe
 * @returns The currently active section ID, or null if none visible
 */
export function useSectionObserver(sectionIds: string[], includePageEnd = false): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds.length > 0 ? sectionIds[0] : null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return;

    // Observe at the upper-third threshold
    const rootMargin = "-33% 0px -67% 0px";
    let observedId = sectionIds[0];
    const updateActive = () => {
      // A short closing chapter may never reach the upper-third line.
      const atEnd = includePageEnd && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      setActiveId(atEnd ? sectionIds[sectionIds.length - 1] : observedId);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observedId = entry.target.id;
          }
        }
        updateActive();
      },
      {
        rootMargin,
        threshold: 0,
      }
    );
    if (includePageEnd) window.addEventListener("scroll", updateActive, { passive: true });

    // Observe each section element
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observerRef.current.observe(el);
      }
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (includePageEnd) window.removeEventListener("scroll", updateActive);
    };
  }, [sectionIds, includePageEnd]);

  return activeId;
}
