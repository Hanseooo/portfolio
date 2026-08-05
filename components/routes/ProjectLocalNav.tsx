// components/routes/ProjectLocalNav.tsx
"use client";

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
 * Wide screens: restrained sticky rail beside evidence.
 * Tablet/mobile: inline wrapping contents list after masthead.
 * Not swipe-only. Anchor targets respect persistent nav offset.
 * Current-section uses non-color state (weight/position indicator).
 */
export default function ProjectLocalNav({ sections }: ProjectLocalNavProps) {
  const sectionIds = sections.map((s) => s.id);
  const activeId = useSectionObserver(sectionIds);

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
      {sections.map((section) => {
        const isCurrent = activeId === section.id;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`inline-flex h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
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
    </ul>
  );
}
