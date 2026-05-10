"use client";

import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "../utils/externalLinks";
import { motionTokens } from "@/lib/motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background px-6 py-32 sm:py-48 z-10">
      <div className="mx-auto max-w-[1400px]">
        {/* CTA */}
        <div className="mb-20">
          <h2 className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-tighter text-foreground">
            Let’s
            <br />
            <span className="text-muted-foreground transition-colors duration-500 hover:text-primary">Connect.</span>
          </h2>
        </div>

        {/* DIVIDER */}
        <div className="mb-12 h-[1px] w-full bg-border" />

        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          {/* LINKS */}
          <motion.div
            initial={{ opacity: 0 }}
            viewport={{ amount: 0.25 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: motionTokens.duration.base,
              delay: motionTokens.stagger.text,
              ease: motionTokens.framerEase.enter,
            }}
            className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10"
          >
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground/80 transition-colors hover:text-primary"
            >
              <Mail size={16} className="text-primary" />
              <span>Email</span>
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground/80 transition-colors hover:text-primary"
            >
              <Linkedin size={16} className="text-primary" />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground/80 transition-colors hover:text-primary"
            >
              <Github size={16} className="text-primary" />
              <span>GitHub</span>
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </motion.div>

          {/* META */}
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground lg:text-right">
            <span>© {new Date().getFullYear()} Hans Amoguis</span>
            <span>Building with intent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
