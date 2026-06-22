"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectBrief({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        {/* OVERVIEW */}
        <motion.div
          className="md:col-span-7"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
          }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-2xl font-black tracking-tight uppercase">
            Overview
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {project.overview}
          </p>
        </motion.div>

        {/* META */}
        <motion.div
          className="md:col-span-4 md:col-start-9 space-y-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
            delay: motionTokens.stagger.text,
          }}
          viewport={{ once: true }}
        >
          {project.client && (
            <div>
              <h3 className="mb-3 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                Client
              </h3>
              <p className="text-base font-medium text-foreground">{project.client}</p>
              {project.clientConsent && (
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground/50">
                  * Shared with client permission.
                </p>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              Role
            </h3>
            <p className="text-base font-medium text-foreground">{project.role}</p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              Stack
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.integrations && project.integrations.length > 0 && (
            <div>
              <h3 className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                Integrations & Services
              </h3>
              <ul className="flex flex-wrap gap-2">
                {project.integrations.map((item) => (
                  <li
                    key={item}
                    className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
