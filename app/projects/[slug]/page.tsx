"use client";

import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import PageTransition from "@/components/layout/PageTransition";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { use } from "react";
import BackButton from "@/components/utils/BackButton";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectFeatures from "@/components/projects/ProjectFeatures";
import SectionDivider from "@/components/ui/SectionDivider";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  useResetScrollTop();

  if (!project) notFound();

  return (
    <PageTransition>
      <ProjectHero project={project} />
      <ProjectBrief project={project} />
      <SectionDivider />
      <ProjectFeatures project={project} />
      <SectionDivider />
      <ProjectGallery images={project.gallery} />
      <SectionDivider />

      <BackButton sectionId="projects" text="Back to Projects" />
    </PageTransition>
  );
}
