"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "@/lib/projects";
import PageTransition from "@/components/layout/PageTransition";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { use, useLayoutEffect } from "react";
import BackButton from "@/components/utils/BackButton";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectFeatures from "@/components/projects/ProjectFeatures";
import SectionDivider from "@/components/ui/SectionDivider";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  if (!project) notFound();

  useLayoutEffect(() => {
    const lenis = (window as any).__lenis;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

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
