"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Github, Linkedin } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { aboutContent } from "@/lib/about";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/utils/externalLinks";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { motionTokens } from "@/lib/motion";
import AboutMobileAccordion from "./AboutMobileAccordion";

type CollapsibleProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  reducedMotion: boolean;
};

function CollapsibleRow({
  title,
  open,
  onToggle,
  children,
  reducedMotion,
}: CollapsibleProps) {
  return (
    <section className="overflow-hidden border border-foreground/20 bg-background/70">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.13em] text-foreground/80 sm:text-sm">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.framerEase.enter,
            }}
            className="overflow-hidden border-t border-foreground/15"
          >
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function AboutCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="border border-foreground/20 bg-background/85 p-6 shadow-primary-sharp md:p-8">
      <p className="text-xs uppercase tracking-[0.22em] text-foreground/70">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-bold leading-tight text-primary md:text-3xl">
        {title.replace("\n", " ")}
      </h3>
      <div className="mt-5">{children}</div>
    </article>
  );
}

export default function AboutStacked() {
  const isClient = useClientReady();
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;

  const [profileOpen, setProfileOpen] = useState(false);
  const [philosophyOpen, setPhilosophyOpen] = useState(false);
  const [skillOpenIndex, setSkillOpenIndex] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);

  const toolCount = aboutContent.tools.groups.reduce(
    (count, group) => count + group.tools.length,
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
      <div className="space-y-6 md:space-y-8">
        <AboutCard
          eyebrow={aboutContent.profile.eyebrow}
          title={aboutContent.profile.title}
        >
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
            <div className="relative w-full overflow-hidden border border-foreground/20">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={currentImage}
                  alt="Hanseo portrait"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 220px, 100vw"
                  priority
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base leading-relaxed text-foreground/85">
                {aboutContent.profile.intro}
              </p>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/85 md:text-base">
                {aboutContent.profile.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <CollapsibleRow
                title={profileOpen ? "Hide profile details" : "Show profile details"}
                open={profileOpen}
                onToggle={() => setProfileOpen((value) => !value)}
                reducedMotion={reducedMotion}
              >
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
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
              </CollapsibleRow>
            </div>
          </div>
        </AboutCard>

        <AboutCard
          eyebrow={aboutContent.skills.eyebrow}
          title={aboutContent.skills.title}
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
              {aboutContent.skills.groups.length} skill groups covering product
              engineering, systems thinking, and delivery workflow.
            </p>
            <div className="space-y-3">
              {aboutContent.skills.groups.map((group, index) => (
                <CollapsibleRow
                  key={group.title}
                  title={group.title}
                  open={skillOpenIndex === index}
                  onToggle={() =>
                    setSkillOpenIndex((current) => (current === index ? -1 : index))
                  }
                  reducedMotion={reducedMotion}
                >
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 marker:text-primary md:text-base">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CollapsibleRow>
              ))}
            </div>
          </div>
        </AboutCard>

        <AboutCard
          eyebrow={aboutContent.tools.eyebrow}
          title={aboutContent.tools.title}
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
              {aboutContent.tools.groups.length} tool groups and {toolCount} core
              technologies I use for product delivery.
            </p>

            <CollapsibleRow
              title={toolsOpen ? "Hide complete stack" : "Show complete stack"}
              open={toolsOpen}
              onToggle={() => setToolsOpen((value) => !value)}
              reducedMotion={reducedMotion}
            >
              <AboutMobileAccordion groups={aboutContent.tools.groups} />
            </CollapsibleRow>
          </div>
        </AboutCard>

        <AboutCard
          eyebrow={aboutContent.philosophy.eyebrow}
          title={aboutContent.philosophy.title}
        >
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85 md:text-base">
            <p>{aboutContent.philosophy.lines[0]}</p>

            <CollapsibleRow
              title={philosophyOpen ? "Hide focus notes" : "Show more focus notes"}
              open={philosophyOpen}
              onToggle={() => setPhilosophyOpen((value) => !value)}
              reducedMotion={reducedMotion}
            >
              <div className="space-y-3">
                {aboutContent.philosophy.lines.slice(1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </CollapsibleRow>
          </div>
        </AboutCard>
      </div>
    </div>
  );
}
