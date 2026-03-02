"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { BBH_Bartle } from "next/font/google";
import { motion } from "framer-motion"
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "../utils/externalLinks";
import { motionTokens } from "@/lib/motion";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Footer() {


  return (
    <footer
      className="relative border-t border-foreground/10 bg-background px-6 py-32"
    >
      <div className="mx-auto max-w-6xl space-y-20">
        {/* CTA */}
        <h2
          className={`
            ${bbhBartle.className}
            text-primary font-black leading-[0.95] mb-2.5 tracking-tight
            text-[clamp(2.5rem,7vw,5rem)]
          `}
        >
          Let’s
          <br />
          Connect
        </h2>

        {/* RED DIVIDER */}
        <div className="h-px w-full bg-primary mt-16 opacity-80" />

        {/* LINKS */}
        <motion.div 
        initial={{opacity: 0}}
        viewport={{amount: 0.25}}
        whileInView={{opacity: 1}}
        transition={{
          duration: motionTokens.duration.base,
          delay: motionTokens.stagger.text,
          ease: motionTokens.framerEase.enter,
        }}
        className="flex flex-wrap items-center gap-10 text-sm uppercase tracking-widest">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Mail size={14} />
            Email
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Github size={14} />
            GitHub
          </a>
        </motion.div>

        {/* META */}
        <div className="flex flex-col gap-1 text-xs opacity-60">
          <span>© {new Date().getFullYear()} Hanseo</span>
          <span>Designed & built with intent</span>
        </div>
      </div>
    </footer>
  );
}
