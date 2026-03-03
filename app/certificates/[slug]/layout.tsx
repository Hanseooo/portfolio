import type { Metadata } from "next";
import type { ReactNode } from "react";
import { certificates } from "@/lib/certificates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const baseUrl = "https://hanseo.tech";
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return {
      title: "Certificate",
      description: "Certificate details from Hans Amoguis' portfolio.",
      alternates: {
        canonical: `/certificates/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${certificate.title} | Hans Amoguis`;
  const description = `${certificate.issuer} - ${certificate.date}`;
  const url = `${baseUrl}/certificates/${certificate.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/certificates/${certificate.slug}`,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Hans Amoguis Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function CertificateSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
