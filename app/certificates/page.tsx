// app/certificates/page.tsx
import type { Metadata } from "next";
import { getCertificateCollection } from "@/lib/content/collection-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { RecordContinuation } from "@/components/evidence";
import CertificateRegisterRecord from "@/components/routes/CertificateRegisterRecord";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Certifications and credentials earned by Hans Amoguis, including Eskwelabs AI Track, Cisco Networking Academy, and competitive programming.",
  alternates: { canonical: "/certificates" },
};

export default function CertificatesPage() {
  const { totalCount, records } = getCertificateCollection();

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="Home"
          parentHref="/"
          title="Certificates"
          subtitle="Supporting credentials and documentary evidence."
          metadata={
            <span>{totalCount} certificates</span>
          }
        />
      }
      continuation={
        <RecordContinuation
          parent={{ label: "← Home", href: "/" }}
        />
      }
    >
      <div data-motion-target="certificate-register">
        {records.map((record) => (
          <CertificateRegisterRecord key={record.slug} record={record} />
        ))}
      </div>
    </PageFamilyFrame>
  );
}
