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
      <article id="project-view" className="bg-background text-foreground">
        {/* HERO */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent" />

          {/* HERO TEXT */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute left-6 max-w-4xl ${project.heroTextPosition}`}
          >
            <h1 className="text-primary text-[clamp(3rem,6vw,4.5rem)] font-black leading-tight">
              {project.title}
            </h1>

            <p
              className={`mt-4 text-lg opacity-90 ${project.heroSubtitleColor}`}
            >
              {project.subtitle}
            </p>

            {/* HERO ACTIONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              {project.github && (
                <Button variant="outline" asChild>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}

              {project.live && (
                <Button asChild>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Preview
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-5xl px-6 py-24 space-y-24">
          {/* OVERVIEW */}
          <div className="prose-project">
            <h2>Overview</h2>
            <p className="max-w-3xl">{project.overview}</p>
          </div>

          {/* META */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <h3 className="meta-heading">Role</h3>
                <p className="text-lg opacity-80">{project.role}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="meta-heading">Stack</h3>
                <ul className="flex flex-wrap gap-3">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-foreground/20 px-4 py-1 text-sm"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* GALLERY */}
          <ProjectGallery images={project.gallery} />
        </section>
      </article>
      <BackButton sectionId="projects" text="Back to Projects" />
    </PageTransition>
  );
}
