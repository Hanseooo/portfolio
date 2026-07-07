import type { Metadata } from "next";
import type { ReactNode } from "react";
import { certificates } from "@/lib/certificates";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;

export async function generateStaticParams() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function CertificateSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return children;
  }

  const url = `${baseUrl}/certificates/${certificate.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Certificates", item: `${baseUrl}/certificates` },
      { "@type": "ListItem", position: 3, name: certificate.title, item: url },
    ],
  };

  const credentialLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: certificate.title,
    recognizedBy: { "@type": "Organization", name: certificate.issuer },
    dateCreated: certificate.date,
    ...(certificate.credentialUrl ? { url: certificate.credentialUrl } : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={credentialLd} />
      {children}
    </>
  );
}
