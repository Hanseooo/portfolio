"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/projects";

export default function ProjectBrief({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-16 md:grid-cols-2">
        {/* OVERVIEW */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Overview
          </h2>
          <p className="max-w-3xl text-base leading-relaxed opacity-85">
            {project.overview}
          </p>
        </motion.div>

        {/* META */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="text-sm uppercase tracking-widest opacity-60">
                Role
              </h3>
              <p className="text-base font-medium opacity-90">{project.role}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-sm uppercase tracking-widest opacity-60">
                Stack
              </h3>

              <ul className="flex flex-wrap gap-3">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="
                        rounded-full
                        border border-foreground/25
                        px-3 py-1
                        text-xs font-medium
                        tracking-wide
                    "
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
