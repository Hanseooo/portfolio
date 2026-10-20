"use client";

import { useMemo } from "react";
import { useSectionObserver } from "@/components/observation/useSectionObserver";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";

// Matches the targets' scroll-mt-28 so native and Lenis jumps land in the same place
const OFFSET_PX = 112;

/** Sticky project index for Selected Work: the leader line grows on the project in view. */
export default function FlagshipIndex({ items }: { items: { id: string; title: string }[] }) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const active = useSectionObserver(ids);
  const { scrollToFragment } = useScrollEnhancement();

  return (
    <nav aria-label="Selected work" className="mt-10 hidden lg:block">
      <ol role="list" className="flex flex-col border-l border-[color:var(--cs-structural-line-strong)]">
        {items.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  scrollToFragment(item.id, OFFSET_PX);
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.setAttribute("tabindex", "-1");
                    target.focus({ preventScroll: true });
                  }
                }}
                className="group flex h-11 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
              >
                <span
                  aria-hidden="true"
                  className={`h-px motion-safe:transition-[width,background-color] motion-safe:duration-300 ${
                    isActive
                      ? "w-8 bg-[color:var(--cs-signal)]"
                      : "w-3 bg-[color:var(--cs-structural-line-strong)] group-hover:w-5"
                  }`}
                />
                <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[color:var(--cs-text-secondary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[color:var(--cs-text-primary)]"
                      : "text-[color:var(--cs-text-secondary)] group-hover:text-[color:var(--cs-text-primary)]"
                  }`}
                >
                  {item.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
