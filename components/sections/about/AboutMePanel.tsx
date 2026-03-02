"use client";

import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useTheme } from "next-themes";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/utils/externalLinks";
import { motionTokens } from "@/lib/motion";
import { useClientReady } from "@/components/utils/useClientReady";
import { aboutContent } from "@/lib/about";
import { AboutPanelHeading, AboutPanelShell } from "./AboutPanelShell";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function AboutMePanel() {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;

  return (
    <motion.div
      initial={reducedMotion ? undefined : { y: 40, opacity: 0 }}
      whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={
        reducedMotion
          ? undefined
          : {
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
            }
      }
      viewport={reducedMotion ? undefined : { once: true, amount: 0.25 }}
    >
      <AboutPanelShell
        leftClassName="flex justify-center"
        rightClassName="mx-auto flex max-w-2xl flex-col justify-center"
        left={
          <div className="group relative mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border-2 md:max-w-md">
            <Image
              src={currentImage}
              alt="Hanseo portrait"
              className="block w-full object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />

            <div className="absolute bottom-0 w-full bg-background/80 px-4 py-2 text-center backdrop-blur">
              <span className="text-sm font-semibold tracking-wide">Hanseo</span>
            </div>
          </div>
        }
        right={
          <>
            <AboutPanelHeading
              eyebrow={aboutContent.profile.eyebrow}
              title={aboutContent.profile.title}
              titleClassName="max-w-xl text-2xl sm:text-3xl md:text-4xl"
            />

            <p className="mt-5 max-w-2xl text-sm leading-relaxed opacity-85 sm:text-lg md:mt-6 md:text-xl">
              {aboutContent.profile.intro}
            </p>

            <ul className="mt-4 grid gap-2 text-left text-sm opacity-80 sm:text-base">
              {aboutContent.profile.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <motion.p
              initial={reducedMotion ? undefined : { y: 40, opacity: 0 }}
              whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: motionTokens.duration.base,
                      ease: motionTokens.framerEase.enter,
                      delay: motionTokens.stagger.text,
                    }
              }
              viewport={reducedMotion ? undefined : { once: true, amount: 0.25 }}
              className="mb-2 mt-4 max-w-2xl text-sm leading-relaxed opacity-85 sm:mb-0 sm:text-lg md:mt-5 md:text-xl"
            >
              {aboutContent.profile.detail}
            </motion.p>

            <div className="mb-2 mt-7 flex flex-wrap justify-center gap-4 md:justify-start">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Linkedin size={16} /> LinkedIn
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Github size={16} /> GitHub
              </a>
            </div>
          </>
        }
      />
    </motion.div>
  );
}
