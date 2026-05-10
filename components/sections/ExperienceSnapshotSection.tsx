"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceSnapshotSection({ id }: { id: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id={id} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex items-end justify-between border-b border-border pb-8"
        >
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
            Trajectory
          </h2>
          <Link
            href="/experience"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span>Full History</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-12 lg:w-2/3 lg:gap-24"
        >
          <motion.div variants={itemVariants} className="group relative border-l border-border pl-8 transition-colors hover:border-primary">
            <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />
            <h3 className="text-2xl font-bold text-foreground mb-2">AI Solutions Development Intern</h3>
            <p className="font-mono text-sm uppercase tracking-widest text-primary mb-6">Eskwelabs // 2026</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Designed and built an internal full-stack Recruitment Automation System. Reduced manual workload by 80%, turning day-long operations into workflows completed in minutes.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="group relative border-l border-border pl-8 transition-colors hover:border-primary">
            <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Full-Stack Web Developer</h3>
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground/80 mb-6">Freelance // 2023 - 2024</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Built full-stack web applications using Next.js, React, PostgreSQL, and Django with a focus on robust architecture and scalable features.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
