"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative min-h-[65vh] w-full overflow-hidden">
      <Image
        src={project.heroImage}
        alt={project.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-black via-black/85 to-black/20" />

      {/* content */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`absolute bottom-10 left-6 max-w-4xl ${project.heroTextPosition}`}
      >
        <h1 className="text-primary font-black text-shadow-lg leading-tight text-[clamp(2.5rem,6vw,4.5rem)]">
          {project.title}
        </h1>

        <p className={`mt-4 text-lg opacity-90 ${project.heroSubtitleColor}`}>
          {project.subtitle}
        </p>

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
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Preview
              </a>
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
