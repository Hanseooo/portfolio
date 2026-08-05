// app/projects/page.tsx
import type { Metadata } from "next";
import { getProjectCollection } from "@/lib/content/collection-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { RecordContinuation } from "@/components/evidence";
import ProjectCatalogueRecord from "@/components/routes/ProjectCatalogueRecord";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected full-stack and AI product engineering projects by Hans Amoguis, including Le Doux, Clarift, and SimplyNote.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const { totalCount, records } = getProjectCollection();

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="Home"
          parentHref="/"
          title="Projects"
          subtitle={`${totalCount} selected projects — full-stack and AI product engineering.`}
          metadata={
            <span>{totalCount} projects</span>
          }
        />
      }
      continuation={
        <RecordContinuation
          parent={{ label: "← Home", href: "/" }}
        />
      }
    >
      {/* Equal-rank ruled bands — source order, no card grid */}
      <div data-motion-target="catalogue-list">
        {records.map((record, idx) => (
          <ProjectCatalogueRecord
            key={record.slug}
            record={record}
            isAlternate={idx % 2 !== 0}
          />
        ))}
      </div>
    </PageFamilyFrame>
  );
}
