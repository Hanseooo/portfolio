// components/routes/ProjectLocalNav.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSectionObserver } from "@/components/observation";

/** Section definitions — only rendered when section has content */
export interface LocalNavSection {
  id: string;
  label: string;
}

interface ProjectLocalNavProps {
  sections: LocalNavSection[];
}

/**
 * Project-only local section navigation — S4 §9.3.
 *
 * Sticks under the global header while the evidence scrolls. A signal marker
 * rides the nav's bottom rule to the current section; the current link also
 * keeps its non-color state (weight). On narrow screens the list is one
 * scrollable row that keeps the current link in view. Not swipe-only: every
 * link is a plain anchor. Anchor targets respect both sticky bars.
 */
export default function ProjectLocalNav({ sections }: ProjectLocalNavProps) {
  const sectionIds = sections.map((s) => s.id);
  const activeId = useSectionObserver(sectionIds);
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  /** Moves the marker under the current link; returns that link. */
  const place = () => {
    const link = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    if (link && markerRef.current) {
      markerRef.current.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
    }
    return link;
  };

  // One observer for the nav's life: re-place on resize. Its first callback paints the
  // first position in place; the marker slides only between sections after that.
  useEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;
    let raf = 0;
    const resize = new ResizeObserver(() => {
      place();
      if (!("ready" in marker.dataset)) raf = requestAnimationFrame(() => (marker.dataset.ready = ""));
    });
    resize.observe(list);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const link = place();
    if (list && link && list.scrollWidth > list.clientWidth) {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollTo({ left: link.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
    }
  }, [activeId]);

  return (
    <ul
      ref={listRef}
      className="relative flex gap-x-6 overflow-x-auto [scrollbar-width:none] md:flex-wrap md:overflow-visible"
      role="list"
    >
      {sections.map((section) => {
        const isCurrent = activeId === section.id;
        return (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              className={`inline-flex h-11 items-center whitespace-nowrap font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
                isCurrent
                  ? "text-[color:var(--cs-text-primary)] font-semibold"
                  : "text-[color:var(--cs-text-secondary)] hover:text-[color:var(--cs-signal)]"
              }`}
              aria-current={isCurrent ? "true" : undefined}
            >
              {section.label}
            </a>
          </li>
        );
      })}
      <span ref={markerRef} aria-hidden="true" className="local-nav-marker" />
    </ul>
  );
}
