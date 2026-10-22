import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { CropMarks } from "@/components/geometry";
import HandoffLink from "@/components/shell/HandoffLink";
import StructuredReveal from "@/components/motion/StructuredReveal";
import ScenePresenceClient from "@/components/homepage/ScenePresenceClient";
import { AVAILABILITY, getHomepagePersonal } from "@/lib/content/homepage-projections";
import { DESTINATIONS, getDestinationHref } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Hans Amoguis (Hanseo): focused on applied AI, system design, and cloud architecture, learning through building and tech communities.",
  alternates: { canonical: "/about" },
};

const proofLinks = [
  { destination: DESTINATIONS.projects, label: "Explore my projects", detail: "AI products, web apps, and business systems." },
  { destination: DESTINATIONS.experience, label: "See my experience", detail: "Internship, freelance work, and community contributions." },
];

const proofLinkClass = "group flex min-h-12 items-center justify-between gap-4 py-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-signal-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";
const evidenceLinkClass = "underline decoration-[color:var(--cs-structural-line-strong)] underline-offset-4 hover:text-[color:var(--cs-signal-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";

export default function AboutPage() {
  const personal = getHomepagePersonal();

  return (
    <PageFamilyFrame
      masthead={<CompactMasthead parentLabel="Home" parentHref="/" title="About" />}
      continuation={
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-4xl">Let&apos;s connect.</h2>
          <HandoffLink
            href={getDestinationHref(DESTINATIONS.contact)}
            className="group inline-flex min-h-12 items-center gap-6 border-2 border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-foundation)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] motion-reduce:transform-none motion-reduce:transition-none"
          >
            Start a conversation <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none" />
          </HandoffLink>
        </div>
      }
    >
      <div className="grid items-start gap-12 md:grid-cols-12 lg:gap-20">
        <figure className="m-0 md:col-span-5 lg:top-28 [@media(min-width:1024px)_and_(min-height:640px)]:sticky">
          <StructuredReveal recipe="credential-artifact" className="relative max-w-sm">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 bg-zinc-900 dark:bg-zinc-800 md:translate-x-4 md:translate-y-4" />
            <div className="relative">
            <CropMarks className="text-[color:var(--cs-structural-line-strong)]" />
            <Image src={personal.portrait} alt="Hans Amoguis" priority sizes="(max-width: 767px) 90vw, 40vw" className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[min(45vh,26rem)]" />
            <figcaption className="flex flex-wrap justify-between gap-2 bg-[color:var(--cs-signal)] px-5 py-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-white dark:bg-zinc-800">
              <span>{personal.personalHandle}</span>
              <span>Building since 2023</span>
            </figcaption>
            </div>
          </StructuredReveal>
          <p className="mt-8 flex max-w-sm items-start gap-2 font-[family-name:var(--font-mono)] text-xs uppercase leading-relaxed tracking-widest text-[color:var(--cs-text-secondary)]">
            <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-[color:var(--cs-signal)]" />
            <span aria-hidden="true" className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-[color:var(--cs-status-online)]" />
            <span>
              {AVAILABILITY.split(" · ").map((part, i, parts) => (
                <Fragment key={part}>
                  {i > 0 && " "}
                  <span className="whitespace-nowrap">{i < parts.length - 1 ? `${part} ·` : part}</span>
                </Fragment>
              ))}
            </span>
          </p>
        </figure>

        <div className="space-y-10 md:col-span-7">
          <StructuredReveal recipe="evidence-section">
          <section aria-labelledby="about-focus">
            <h2 id="about-focus" className="max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">Learning by <span className="text-[color:var(--cs-signal-text)]">building.</span></h2>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">I&apos;m Hans, an Information Technology student at Holy Cross of Davao College. I started programming in 2023 and participated in the <HandoffLink href="/certificates/national-programming-challenge-2024" className={evidenceLinkClass}>National Programming Challenge 2024, organized by CodeChum</HandoffLink>.</p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">Today, I&apos;m focused on applied AI while deepening my understanding of system design and cloud architecture. I learn something new every day and keep refining how I build.</p>
          </section>
          </StructuredReveal>

          <StructuredReveal recipe="evidence-section">
          <section aria-labelledby="about-work" className="border-t border-[color:var(--cs-structural-line)] pt-8">
            <h2 id="about-work" className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tight text-[color:var(--cs-text-primary)]">How I work</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">{personal.aboutPrimary}</p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">That approach runs through my work: <HandoffLink href="/projects/story-buddy" className={evidenceLinkClass}>StoryBuddy</HandoffLink>, a capstone that turns learners&apos; stories into illustrated books; AI-assisted recruitment and slide-generation tools at Eskwelabs; and <HandoffLink href="/projects/le-doux" className={evidenceLinkClass}>Le Doux</HandoffLink>, an ordering platform built to replace a client&apos;s Google Forms workflow.</p>
          </section>
          </StructuredReveal>

          <StructuredReveal recipe="evidence-section">
          <section aria-labelledby="about-community" className="border-t border-[color:var(--cs-structural-line)] pt-8">
            <h2 id="about-community" className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tight text-[color:var(--cs-text-primary)]">Beyond the build</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">I volunteer as a software developer with <HandoffLink href="/experience#durianpy" className={evidenceLinkClass}>DurianPy</HandoffLink>, contributing to the PyCon Davao 2026 website, TechTix registration, and the community&apos;s badge service. Tech events are also a chance to meet other builders, exchange ideas, and learn from how they work.</p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[color:var(--cs-text-secondary)]">Away from code, I enjoy coffee shops, billiards, and spending time with friends.</p>
          </section>
          </StructuredReveal>

          <StructuredReveal recipe="evidence-section">
          <div className="divide-y divide-[color:var(--cs-structural-line)] border-y border-[color:var(--cs-structural-line)]">
            {proofLinks.map(({ destination, label, detail }) => (
              <div key={destination.id} className="pb-4">
                <HandoffLink href={getDestinationHref(destination)} className={proofLinkClass}>
                  {label}<ArrowUpRight size={14} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" />
                </HandoffLink>
                <p className="text-[15px] leading-relaxed text-[color:var(--cs-text-secondary)]">{detail}</p>
              </div>
            ))}
          </div>
          </StructuredReveal>
        </div>
      </div>

      <section aria-labelledby="about-activity" className="mt-20 border-t border-[color:var(--cs-structural-line)] pt-12 md:mt-28 md:pt-16">
        <h2 id="about-activity" className="mb-10 font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-4xl">Live activity</h2>
        <ScenePresenceClient />
      </section>
    </PageFamilyFrame>
  );
}
