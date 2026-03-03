import type { Metadata } from "next";
import type { ReactNode } from "react";
import { projects } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const baseUrl = "https://hanseo.tech";
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

export default function ProjectSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
