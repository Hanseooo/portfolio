"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectTechnicalDecisions({ project }: { project: Project }) {
  if (!project.technicalDecisions || project.technicalDecisions.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          03 / Technical Decisions
        </h2>
        <div className="h-px w-full bg-border" />
      </motion.div>

      <ul className="space-y-8">
        {project.technicalDecisions.map((decision, i) => (
          <motion.li
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
              delay: i * motionTokens.stagger.text,
            }}
            viewport={{ once: true }}
            className="flex items-baseline gap-6"
          >
            <span className="shrink-0 font-mono text-primary">
              {String(i + 1).padStart(2, "0")} /
            </span>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {decision}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
