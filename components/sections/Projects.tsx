"use client";

import { projects } from "@/lib/projects";
import ProjectCard from "../cards/ProjectCard";
import { motion } from "framer-motion";


export default function Projects() {

  return (
    <section className="relative min-h-screen bg-background px-6 py-32">
      <motion.h2
        initial={{x: -90, opacity: 0 }}
        whileInView={{x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.75 }}
        id="projects"
        className="mb-20 text-center sm:text-start text-primary font-black text-[clamp(2.5rem,8vw,6rem)] leading-none"
      >
        Featured Projects
      </motion.h2>

      <div className="mx-auto max-w-6xl grid gap-32">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
}
