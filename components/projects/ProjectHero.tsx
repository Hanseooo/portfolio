"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative min-h-[82vh] w-full overflow-hidden border-b border-foreground/15">
      <Image
        src={project.heroImage}
        alt={project.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/82 via-black/58 to-black/22" />
      <div className="absolute inset-0 bg-linear-to-r from-black/72 via-black/24 to-transparent" />
      <div className="absolute inset-0 bg-radial-[circle_at_16%_78%] from-black/70 via-transparent to-transparent" />

      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.feature,
          ease: motionTokens.framerEase.enter,
        }}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-6 pb-10"
      >
        <div className="max-w-4xl border border-black/35 bg-black/45 p-6 shadow-primary-sharp backdrop-blur-lg dark:border-primary/35 dark:bg-background/22 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/72">
            <span className="border border-primary/70 px-2 py-1 text-primary">Case Study</span>
            <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
            <span>{project.role}</span>
          </div>

          <h1 className="text-pretty text-[clamp(2.5rem,6vw,5.1rem)] font-black leading-[0.92] text-white">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl border-l-2 border-primary/70 pl-4 text-base leading-relaxed text-white/86 sm:text-lg">
            {project.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.github && (
              <Button variant="outline" asChild>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Source Code
                </a>
              </Button>
            )}

            {project.live && (
              <Button asChild className="font-semibold">
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Preview
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
