import type { Metadata } from "next";
import type { ReactNode } from "react";
import { projects } from "@/lib/projects";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project",
      description: "Project details from Hans Amoguis' portfolio.",
      alternates: {
        canonical: `/projects/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${project.title} | Hans Amoguis`;
  const description = project.subtitle;
  const url = `${baseUrl}/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
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

export default async function ProjectSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return children;
  }

  const url = `${baseUrl}/projects/${project.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${baseUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.subtitle,
    image: new URL(project.heroImage.src, baseUrl).toString(),
    url,
    author: { "@type": "Person", name: "Hans Amoguis", url: baseUrl },
    keywords: project.stack.join(", "),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={creativeWorkLd} />
      {children}
    </>
  );
}
