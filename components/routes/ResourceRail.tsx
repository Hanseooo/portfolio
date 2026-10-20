"use client";

import { useSectionObserver } from "@/components/observation/useSectionObserver";

/** In-page index: sticky rail on desktop, horizontal row on tablet, hidden on mobile. */
export default function ResourceRail({ groups }: { groups: { id: string; title: string }[] }) {
  const active = useSectionObserver(groups.map((g) => g.id));

  return (
    <nav aria-label="Resource lists" className="hidden md:block lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
      <ul role="list" className="flex gap-8 lg:flex-col lg:gap-4">
        {groups.map((g) => {
          const isActive = active === g.id;
          return (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`inline-block border-b-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] lg:text-6xl ${
                  isActive
                    ? "border-[color:var(--cs-signal)] text-[color:var(--cs-text-primary)]"
                    : "border-transparent text-[color:var(--cs-text-secondary)] hover:text-[color:var(--cs-text-primary)]"
                }`}
              >
                {g.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
