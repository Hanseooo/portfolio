import type { Metadata } from "next";
import type { ReactNode } from "react";
import { projects } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project | Hanseo",
      description: "Project details from Hanseo's portfolio.",
    };
  }

  return {
    title: `${project.title} | Hanseo`,
    description: project.subtitle,
  };
}

export default function ProjectSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
