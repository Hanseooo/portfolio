"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectFeatures({ project }: { project: Project }) {
  if (!project.features || project.features.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        <motion.div
          className="md:col-span-5"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
          }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-black tracking-tight uppercase">
            Key Features
          </h2>
        </motion.div>

        <ul className="space-y-0 md:col-span-7 divide-y divide-border">
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
              className="py-6 transition-colors hover:text-primary group"
            >
              <p className="text-base leading-relaxed text-muted-foreground group-hover:text-primary transition-colors">
                {feature}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
