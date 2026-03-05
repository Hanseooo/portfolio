"use client";

import Image from "next/image";
import { Github, Linkedin, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { aboutContent } from "@/lib/about";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/utils/externalLinks";
import AboutMobileCard from "./AboutMobileCard";
import AboutMobileAccordion from "./AboutMobileAccordion";
import { AnimatePresence, motion } from "framer-motion";
import { getEnterY, getEnterYTransition, getMotionMode, motionTokens } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { useState, type ReactNode } from "react";

type DisclosureProps = {
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  collapsedLabel: string;
  expandedLabel: string;
  reducedMotion: boolean;
};

function MobileDisclosure({
  expanded,
  onToggle,
  children,
  collapsedLabel,
  expandedLabel,
  reducedMotion,
}: DisclosureProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-foreground/20 bg-background/60 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span>{expanded ? expandedLabel : collapsedLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.framerEase.enter,
            }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function AboutMobile() {
  const isClient = useClientReady();
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState({
    profile: false,
    skills: false,
    tools: false,
    philosophy: false,
  });

  const motionMode = getMotionMode({ reducedMotion, isMobile: true });
  const cardEnter = getEnterY("subtle", motionMode);
  const cardTransition = getEnterYTransition(motionMode);
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;
  const toolCount = aboutContent.tools.groups.reduce((count, group) => count + group.tools.length, 0);

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-clip px-4 pb-14 pt-1 sm:px-6 sm:pb-16 sm:pt-4">
      <div className="space-y-5 sm:space-y-6">
        <motion.div
          initial={cardEnter}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={cardTransition}
        >
          <AboutMobileCard
            eyebrow={aboutContent.profile.eyebrow}
            title={aboutContent.profile.title}
          >
            <div className="space-y-5">
              <div className="grid gap-4 min-[380px]:grid-cols-[96px_1fr] min-[380px]:items-center">
                <div className="relative mx-auto w-full max-w-[15rem] overflow-hidden rounded-xl border border-foreground/20 shadow-sm min-[380px]:mx-0 min-[380px]:h-24 min-[380px]:w-24 min-[380px]:max-w-none">
                  <div className="relative aspect-[4/3] min-[380px]:h-full min-[380px]:w-full min-[380px]:aspect-auto">
                    <Image
                      src={currentImage}
                      alt="Hanseo portrait"
                      fill
                      className="object-cover"
                      sizes="(max-width: 379px) 240px, 96px"
                      priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-white/90 min-[380px]:hidden">
                      Hanseo
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {aboutContent.profile.intro}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-foreground/70">
                    Full-Stack Engineer
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                {aboutContent.profile.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <MobileDisclosure
                expanded={expanded.profile}
                onToggle={() =>
                  setExpanded((state) => ({
                    ...state,
                    profile: !state.profile,
                  }))
                }
                collapsedLabel="Show profile details"
                expandedLabel="Hide profile details"
                reducedMotion={reducedMotion}
              >
                <div className="space-y-4 pb-1">
                  <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {aboutContent.profile.detail}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 w-full items-center justify-center gap-2 border border-foreground/20 bg-background/70 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 w-full items-center justify-center gap-2 border border-foreground/20 bg-background/70 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Github size={16} /> GitHub
                    </a>
                  </div>
                </div>
              </MobileDisclosure>
            </div>
          </AboutMobileCard>
        </motion.div>

        <motion.div
          initial={cardEnter}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            ...cardTransition,
            delay: reducedMotion ? 0 : motionTokens.stagger.text,
          }}
        >
          <AboutMobileCard
            eyebrow={aboutContent.skills.eyebrow}
            title={aboutContent.skills.title.replace("\n", " ")}
          >
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                {aboutContent.skills.groups.length} skill groups covering product engineering, systems thinking, and delivery workflow.
              </p>

              <div className="flex flex-wrap gap-2">
                {aboutContent.skills.groups.map((group) => (
                  <span
                    key={group.title}
                    className="inline-flex min-h-10 items-center rounded-full border border-foreground/20 bg-background/55 px-3 text-xs uppercase tracking-[0.08em]"
                  >
                    {group.title}
                  </span>
                ))}
              </div>

              <MobileDisclosure
                expanded={expanded.skills}
                onToggle={() =>
                  setExpanded((state) => ({
                    ...state,
                    skills: !state.skills,
                  }))
                }
                collapsedLabel="Show full skill details"
                expandedLabel="Hide full skill details"
                reducedMotion={reducedMotion}
              >
                <div className="space-y-5 pb-1">
                  {aboutContent.skills.groups.map((group) => (
                    <section key={group.title} className="border-l border-foreground/20 pl-4">
                      <h4 className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:text-xs">
                        {group.title}
                      </h4>
                      <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-foreground/85 marker:text-primary sm:text-base">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </MobileDisclosure>
            </div>
          </AboutMobileCard>
        </motion.div>

        <motion.div
          initial={cardEnter}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            ...cardTransition,
            delay: reducedMotion ? 0 : motionTokens.stagger.text * 2,
          }}
        >
          <AboutMobileCard
            eyebrow={aboutContent.tools.eyebrow}
            title={aboutContent.tools.title.replace("\n", " ")}
          >
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                {aboutContent.tools.groups.length} tool groups and {toolCount} core technologies I use for product delivery.
              </p>

              <div className="flex flex-wrap gap-2">
                {aboutContent.tools.groups.map((group) => (
                  <span
                    key={group.title}
                    className="inline-flex min-h-10 items-center rounded-full border border-foreground/20 bg-background/55 px-3 text-xs uppercase tracking-[0.08em]"
                  >
                    {group.title}
                  </span>
                ))}
              </div>

              <MobileDisclosure
                expanded={expanded.tools}
                onToggle={() =>
                  setExpanded((state) => ({
                    ...state,
                    tools: !state.tools,
                  }))
                }
                collapsedLabel="Show complete stack"
                expandedLabel="Hide complete stack"
                reducedMotion={reducedMotion}
              >
                <div className="pb-1">
                  <AboutMobileAccordion groups={aboutContent.tools.groups} />
                </div>
              </MobileDisclosure>
            </div>
          </AboutMobileCard>
        </motion.div>

        <motion.div
          initial={cardEnter}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            ...cardTransition,
            delay: reducedMotion ? 0 : motionTokens.stagger.text * 3,
          }}
        >
          <AboutMobileCard
            eyebrow={aboutContent.philosophy.eyebrow}
            title={aboutContent.philosophy.title.replace("\n", " ")}
          >
            <div className="space-y-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
              <p>{aboutContent.philosophy.lines[0]}</p>

              <MobileDisclosure
                expanded={expanded.philosophy}
                onToggle={() =>
                  setExpanded((state) => ({
                    ...state,
                    philosophy: !state.philosophy,
                  }))
                }
                collapsedLabel="Show more focus notes"
                expandedLabel="Hide focus notes"
                reducedMotion={reducedMotion}
              >
                <div className="space-y-3 pb-1">
                  {aboutContent.philosophy.lines.slice(1).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </MobileDisclosure>
            </div>
          </AboutMobileCard>
        </motion.div>
      </div>
    </div>
  );
}
