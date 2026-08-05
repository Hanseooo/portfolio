// app/experience/page.tsx
import type { Metadata } from "next";
import { getExperienceLedger } from "@/lib/content/collection-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { RecordContinuation } from "@/components/evidence";
import ExperienceCareerRecord from "@/components/routes/ExperienceCareerRecord";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience of Hans Amoguis — AI Solutions Development Intern at Eskwelabs and freelance full-stack development work.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  const { totalCount, records } = getExperienceLedger();

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="Home"
          parentHref="/"
          title="Experience"
          subtitle="Complete professional history."
          metadata={
            <span>{totalCount} roles</span>
          }
        />
      }
      continuation={
        <RecordContinuation
          parent={{ label: "← Home", href: "/" }}
        />
      }
    >
      <div data-motion-target="career-ledger">
        {records.map((record) => (
          <ExperienceCareerRecord
            key={`${record.company}-${record.role}`}
            record={record}
          />
        ))}
      </div>
    </PageFamilyFrame>
  );
}
