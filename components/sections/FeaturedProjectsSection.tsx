"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";

export default function FeaturedProjectsSection({ id }: { id: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id={id} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-20 flex items-end justify-between border-b border-border pb-8"
        >
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
            Projects
          </h2>
          <Link
            href="/projects"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span>View All</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {projects.slice(0, 3).map((project, idx) => (
            <motion.div variants={itemVariants} key={project.title}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="aspect-[4/5] w-full overflow-hidden border border-border bg-card relative">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/80">
                    0{idx + 1} {"//"} {project.subtitle.substring(0, 40)}{project.subtitle.length > 40 ? "..." : ""}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
