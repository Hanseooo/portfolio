"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectFeatures({ project }: { project: Project }) {
  if (!project.features || project.features.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true }}
        className="mb-12 text-2xl font-bold tracking-tight"
      >
        Key Features
      </motion.h2>

      <ul className="space-y-6">
        {project.features.map((feature, i) => (
          <motion.li
            key={feature}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
              delay: i * motionTokens.stagger.text,
            }}
            viewport={{ once: true }}
            className="
              group relative border-l-2 border-foreground/15
              pl-6 py-2
              transition-colors
              hover:border-primary
            "
          >
            <p className="text-base leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">
              {feature}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
