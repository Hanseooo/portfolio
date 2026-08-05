"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import ProjectCard from "@/components/cards/ProjectCard";
import { clipReveal } from "@/lib/motion";

const FEATURED = projects.slice(0, 3);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturedProjectsSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id={id} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
          <motion.h2
            {...clipReveal(reducedMotion)}
            className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
          >
            Projects
          </motion.h2>
          <Link
            href="/projects"
            className="group flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span>All Projects</span>
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        <motion.div
          variants={reducedMotion ? undefined : containerVariants}
          initial={reducedMotion ? undefined : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {FEATURED.map((project, idx) => (
            <motion.div
              variants={reducedMotion ? undefined : itemVariants}
              key={project.title}
            >
              <ProjectCard project={project} idx={idx} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
