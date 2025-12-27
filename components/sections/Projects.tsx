"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BBH_Bartle } from "next/font/google";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
});

export default function Projects() {
  const [active, setActive] = useState(projects[0]);

  return (
    <section className="relative min-h-screen  px-6 py-32">
      {/* Heading — subtle continuation from About */}
      <motion.h2
        initial={{ x: -60, opacity: 0.25 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        id="projects"
        className={`
          mb-20
          text-primary text-center 
          font-black
          text-[clamp(2rem,8vw,5rem)]
          leading-none
          ${bbhBartle.className}
        `}
      >
        <span className="block text-[clamp(1.5rem,5vw,3rem)]">Featured</span>
        Projects
      </motion.h2>

      <motion.div
        initial={{ x: -60, opacity: 0.25 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[420px_1fr]"
      >
        {/* LEFT — PROJECT LIST */}
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(project)}
              className="
                group block
                border border-foreground/20
                px-6 py-5
                transition
                hover:border-primary
                focus-visible:border-primary
                shadow-primary-sharp
                bg-background/50
              "
            >
              <Image
                className="border-secondary border-2 mb-4  lg:hidden"
                src={project.heroImage}
                alt={`${project.title} image`}
              />
              <h3 className="text-xl font-semibold group-hover:text-primary">
                {project.title}
              </h3>
              <p className="mt-1 text-sm opacity-70">{project.subtitle}</p>
            </Link>
          ))}
        </div>

        {/* RIGHT — PREVIEW (desktop only) */}
        <div className="relative hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="
                relative
                aspect-video
                w-full
                overflow-hidden
                shadow-2xl shadow-muted-foreground/75
                dark:shadow-muted-foreground/20 shadow-primary-sharp
                border-primary border
              "
            >
              <Image
                src={active.heroImage}
                alt={active.title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay + metadata */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-2xl font-semibold text-white">
                  {active.title}
                </h4>
                <p className="mt-1 text-sm text-white/80">{active.subtitle}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
