"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { certificates } from "@/lib/certificates";
import PageTransition from "@/components/layout/PageTransition";
import BackButton from "@/components/utils/BackButton";
import SectionDivider from "@/components/ui/SectionDivider";
import CertificateHero from "@/components/certificates/CertificateHero";
import CertificateDisplay from "@/components/certificates/CertificateDisplay";
import CertificateNextPrev from "@/components/certificates/CertificateNextPrev";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const cert = certificates.find((c) => c.slug === resolvedParams.slug);
  useResetScrollTop();

  if (!cert) notFound();

  return (
    <PageTransition>
      <CertificateHero cert={cert} />
      <SectionDivider />
      <CertificateDisplay cert={cert} />
      <SectionDivider />
      <CertificateNextPrev cert={cert} />
      <SectionDivider />
      <BackButton sectionId="certificates" text="Back to Certificates" />
    </PageTransition>
  );
}
