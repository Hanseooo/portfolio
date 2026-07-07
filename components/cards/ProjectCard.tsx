"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  idx: number;
};

export default function ProjectCard({ project, idx }: Props) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="aspect-video w-full overflow-hidden relative border border-border bg-card">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
        {project.client && (
          <span className="absolute top-3 left-3 border border-primary/30 dark:border-primary/60 bg-white/90 dark:bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm shadow-sm">
            Client
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-primary">0{idx + 1}</span>
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>
        <div className="h-px w-full bg-border" />
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-start justify-between gap-2">
          {project.title}
          <ArrowUpRight size={20} className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {project.role}
        </span>
        
        {/* Subtitle / Overview preview */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
          {project.subtitle}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="bg-foreground/5 border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/80 transition-colors group-hover:bg-foreground/10 group-hover:border-foreground/20"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="font-mono text-[9px] text-muted-foreground self-center ml-1">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
