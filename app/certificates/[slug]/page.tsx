"use client"

import { notFound } from "next/navigation";
import { certificates } from "@/lib/certificates";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { use } from "react";
import BackButton from "@/components/utils/BackButton";
import PageTransition from "@/components/layout/PageTransition";
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
      <section className="mx-auto max-w-4xl flex flex-col px-6 py-32">
        <h1 className="mb-4 text-4xl font-bold text-primary">{cert.title}</h1>

        <p className="mb-8 opacity-70">
          {cert.issuer} · {cert.date}
        </p>

        <div className="relative mb-8 aspect-4/3 w-full rounded-lg border border-foreground/20 bg-muted">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(min-width: 1024px) 56rem, 100vw"
            className="object-contain p-6"
          />
        </div>

        {cert.credentialUrl && (
          <Link
            href={cert.credentialUrl}
            target="_blank"
            className="
            inline-flex items-center gap-2
            border border-primary w-54 justify-center
            px-6 py-3 self-center
            font-semibold
            text-primary
            transition
            hover:bg-primary hover:text-background
            shadow-primary-sharp
          "
          >
            View Credential
            <ExternalLink size={18} />
          </Link>
        )}
      </section>
      <BackButton sectionId="certificates" text="Back to Certificates" />
    </PageTransition>
  );
}
