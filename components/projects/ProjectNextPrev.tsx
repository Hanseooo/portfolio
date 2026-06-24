"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

function NavCard({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block aspect-[5/2] overflow-hidden"
    >
      <Image
        src={project.heroImage}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {direction === "prev" && (
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
          )}
          <span>{direction === "prev" ? "Previous" : "Next"}</span>
          {direction === "next" && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </p>
        <h3 className="text-xl font-black text-white">{project.title}</h3>
      </div>
    </Link>
  );
}

export default function ProjectNextPrev({ project }: { project: Project }) {
  if (projects.length < 2) return null;

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mobile: next on top; desktop: prev left, next right */}
        <div className="order-1 md:order-2">
          <NavCard project={next} direction="next" />
        </div>
        <div className="order-2 md:order-1">
          <NavCard project={prev} direction="prev" />
        </div>
      </div>
    </section>
  );
}
