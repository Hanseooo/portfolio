import type { Metadata } from "next";
import type { ReactNode } from "react";
import { certificates } from "@/lib/certificates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return {
      title: "Certificate | Hanseo",
      description: "Certificate details from Hanseo's portfolio.",
    };
  }

  return {
    title: `${certificate.title} | Hanseo`,
    description: `${certificate.issuer} - ${certificate.date}`,
  };
}

export default function CertificateSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
