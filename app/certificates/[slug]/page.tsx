// app/certificates/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCertificateDetail } from "@/lib/content/detail-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import {
  DocumentaryArtifact,
  RecordContinuation,
  EmptySafeActions,
} from "@/components/evidence";
import StructuredReveal from "@/components/motion/StructuredReveal";

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { slug } = await params;
  const cert = getCertificateDetail(slug);

  if (!cert) notFound();

  // External credential action — only when URL exists
  const actions = [
    cert.credentialUrl
      ? {
          key: "credential",
          element: (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-[color:var(--cs-signal)] px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal-inverse)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              View Credential <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
        }
      : null,
  ];

  // Continuation targets — non-wrapping adjacency
  const prevTarget = cert.prevSlug
    ? { label: `← Previous`, href: `/certificates/${cert.prevSlug}` }
    : null;
  const nextTarget = cert.nextSlug
    ? { label: `Next →`, href: `/certificates/${cert.nextSlug}` }
    : null;

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="All Certificates"
          parentHref="/certificates"
          index={`${String(cert.position).padStart(2, "0")} of ${String(cert.totalInCollection).padStart(2, "0")}`}
          title={cert.title}
          metadata={
            <>
              <span>{cert.issuer}</span>
              <span>{cert.date}</span>
            </>
          }
          actions={<EmptySafeActions actions={actions} />}
        />
      }
      continuation={
        <RecordContinuation
          parent={{ label: "All Certificates", href: "/certificates" }}
          prev={prevTarget}
          next={nextTarget}
        />
      }
    >
      <div data-motion-target="certificate-detail">
        {/* Large, undistorted certificate artifact */}
        <StructuredReveal recipe="credential-artifact">
          <div className="mb-10">
            <DocumentaryArtifact
              src={cert.image}
              alt={`${cert.title} — issued by ${cert.issuer}, ${cert.date}`}
              large
            />
          </div>
        </StructuredReveal>

        {/* Description — only when available */}
        {cert.description && (
          <StructuredReveal recipe="evidence-section">
            <div className="readable-measure">
              <h2 className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                Description
              </h2>
              <p className="text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
                {cert.description}
              </p>
            </div>
          </StructuredReveal>
        )}
      </div>
    </PageFamilyFrame>
  );
}
