"use client";

import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { useTheme } from "next-themes";
import { aboutContent } from "@/lib/about";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/utils/externalLinks";
import AboutMobileCard from "./AboutMobileCard";
import AboutMobileAccordion from "./AboutMobileAccordion";

export default function AboutMobile() {
  const isClient = useClientReady();
  const { resolvedTheme } = useTheme();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-clip px-4 pb-12 pt-1 sm:px-6 sm:pb-14 sm:pt-4">
      <div className="space-y-4 sm:space-y-5">
        <AboutMobileCard
          eyebrow={aboutContent.profile.eyebrow}
          title={aboutContent.profile.title}
        >
          <div className="space-y-4">
            <div className="relative mx-auto w-full max-w-[15rem] overflow-hidden rounded-xl border border-foreground/20 shadow-sm">
              <Image
                src={currentImage}
                alt="Hanseo portrait"
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <p className="text-sm leading-relaxed opacity-85 sm:text-base">{aboutContent.profile.intro}</p>

            <ul className="space-y-2 text-sm leading-relaxed opacity-80 sm:text-base">
              {aboutContent.profile.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed opacity-85 sm:text-base">{aboutContent.profile.detail}</p>

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
        </AboutMobileCard>

        <AboutMobileCard
          eyebrow={aboutContent.skills.eyebrow}
          title={aboutContent.skills.title.replace("\n", " ")}
        >
          <div className="space-y-5">
            {aboutContent.skills.groups.map((group) => (
              <section key={group.title} className="border-l border-foreground/20 pl-4">
                <h4 className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] opacity-70 sm:text-xs">
                  {group.title}
                </h4>
                <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed opacity-85 marker:text-primary sm:text-base">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </AboutMobileCard>

        <AboutMobileCard
          eyebrow={aboutContent.tools.eyebrow}
          title={aboutContent.tools.title.replace("\n", " ")}
        >
          <AboutMobileAccordion groups={aboutContent.tools.groups} />
        </AboutMobileCard>

        <AboutMobileCard
          eyebrow={aboutContent.philosophy.eyebrow}
          title={aboutContent.philosophy.title.replace("\n", " ")}
        >
          <div className="space-y-3 text-sm leading-relaxed opacity-85 sm:text-base">
            {aboutContent.philosophy.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </AboutMobileCard>
      </div>
    </div>
  );
}
