// app/resources/page.tsx
import type { Metadata } from "next";
import { getResourceGroups } from "@/lib/content/collection-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { RecordContinuation } from "@/components/evidence";
import ResourceGroupList from "@/components/routes/ResourceGroupList";
import ResourceRail from "@/components/routes/ResourceRail";

export const metadata: Metadata = {
  title: "Resources",
  description: "Creators, agent skills, and tools Hans Amoguis learns from and works with.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const groups = getResourceGroups();

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="Home"
          parentHref="/"
          title="Resources"
          metadata={<span>{groups.length} lists</span>}
        />
      }
      continuation={<RecordContinuation parent={{ label: "← Home", href: "/" }} />}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
        <ResourceRail groups={groups} />
        <div className="space-y-16 lg:col-span-7 lg:col-start-6">
          {groups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-28">
              <h2
                id={`${group.id}-title`}
                className="mb-4 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:sr-only"
              >
                {group.title}
              </h2>
              <ResourceGroupList group={group} />
              {group.sources && (
                <p className="mt-3 flex flex-wrap gap-x-6 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  {group.sources.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[color:var(--cs-signal-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ))}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </PageFamilyFrame>
  );
}
