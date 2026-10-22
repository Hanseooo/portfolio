import Link from "next/link";
import HandoffLink from "@/components/shell/HandoffLink";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import ScreenshotFrameComponent from "@/components/evidence/ScreenshotFrame";
import EmptySafeActionsComponent from "@/components/evidence/EmptySafeActions";
import StructuredReveal from "@/components/motion/StructuredReveal";
import EvidenceDepthEffect from "@/components/motion/EvidenceDepthEffect";
import { CompassArc, CropMarks, RegistrationMark } from "@/components/geometry";
import FlagshipIndex from "./FlagshipIndex";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import type { HomepageFlagshipProjection } from "@/lib/content/homepage-projections";
import type { ProjectCardProjection } from "@/lib/content/types";

interface SceneFlagshipsProps {
  data: HomepageFlagshipProjection;
}

function FlagshipRecord({
  project,
  index,
  reversed,
  depthId,
}: {
  project: ProjectCardProjection;
  index: number;
  reversed: boolean;
  depthId?: string;
}) {
  const actions = [
    {
      key: "case-study",
      element: (
        <HandoffLink
          href={project.detailRoute}
          className="inline-flex h-11 items-center gap-2 border border-[color:var(--cs-structural-line-strong)] px-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:border-[color:var(--cs-signal)] hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
        >
          View Case Study
          <ArrowUpRight size={12} aria-hidden="true" />
        </HandoffLink>
      ),
    },
    project.liveUrl
      ? {
          key: "live",
          element: (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Live Site
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
        }
      : null,
    project.githubUrl
      ? {
          key: "github",
          element: (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              GitHub
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
        }
      : null,
  ];

  return (
    <article
      className={`hp-grid items-center gap-y-8 py-12 md:py-16 lg:py-20 ${
        index > 0 ? "border-t border-[color:var(--cs-structural-line)]" : ""
      }`}
      data-motion-target={`flagship-record-${project.slug}`}
    >
      {/* Visual / Editorial Block (Option A) */}
      <div
        className={`col-span-4 md:col-span-8 lg:col-span-7 ${
          reversed ? "lg:order-2 lg:col-start-6" : "lg:order-1"
        }`}
        {...(depthId ? { "data-gsap-depth": depthId } : {})}
      >
        <div className="relative overflow-hidden bg-[color:var(--cs-signal)] dark:bg-zinc-800 p-6 md:p-10 lg:p-12 text-white isolate shadow-xl">
          {/* Compass construction from the top-right corner, registration mark under the screenshot */}
          <CompassArc className="absolute right-0 top-0 z-0 w-[62%] rotate-180 text-white/25" />
          <RegistrationMark className="absolute -bottom-12 -left-12 z-0 w-40 text-white/20" />
          <div className="absolute top-[50%] left-[-10%] w-[40%] h-[1px] bg-white/20 pointer-events-none z-0" aria-hidden="true" />

          <div className="@container relative z-10 flex flex-col h-full">
            {/* Sized to the plate so single-word titles never break mid-word */}
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(2rem,15cqi,5rem)] font-black uppercase leading-[0.85] tracking-tight text-white mb-8 lg:mb-12">
              {project.title}
            </h3>
            
            <div className="mt-auto shadow-2xl relative z-10 border-4 border-white/10 dark:border-black/20 bg-[color:var(--cs-foundation)]">
              <CropMarks className="text-white/70" />
              <ScreenshotFrameComponent
                src={project.heroImage}
                alt={`${project.title} — application screenshot`}
                priority={index === 0}
                wide
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text content / Summary Block */}
      <div
        className={`col-span-4 md:col-span-8 lg:col-span-5 ${
          reversed ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-8"
        } flex flex-col pt-2 pb-4`}
      >
        {/* Index with a leader line pointing at the plate */}
        <div className={`mb-6 flex items-center gap-4 ${reversed ? "" : "lg:flex-row-reverse"}`}>
          <span className="font-[family-name:var(--font-display)] text-5xl font-black leading-none text-[color:var(--cs-signal-text)] md:text-6xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--cs-structural-line-strong)]" />
        </div>

        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {project.year} · {project.role}
        </p>

        <p className="mt-3 max-w-[34ch] text-lg leading-snug text-[color:var(--cs-text-primary)]">
          {project.tagline ?? project.editorialSummary}
        </p>

        {project.technicalEvidence && project.technicalEvidence.length > 0 && (
          <ul
            className="mt-6 max-w-sm border-t border-[color:var(--cs-structural-line)]"
            role="list"
            aria-label="Highlights"
          >
            {project.technicalEvidence.map((evidence) => (
              <li
                key={evidence}
                className="flex items-center gap-3 border-b border-[color:var(--cs-structural-line)] py-2.5 text-sm text-[color:var(--cs-text-secondary)]"
              >
                <span aria-hidden="true" className="w-3 shrink-0 border-t border-[color:var(--cs-signal)]" />
                {evidence}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <EmptySafeActionsComponent actions={actions} />
        </div>
      </div>
    </article>
  );
}

export default function SceneFlagships({ data }: SceneFlagshipsProps) {
  const [leadFlagship] = data.flagships;

  return (
    <HomepageSceneFrame
      id={SECTION_IDS.flagships}
      sceneNumber="02"
      heading="Selected Work"
      surface="reading"
      className="border-t border-b border-[color:var(--cs-structural-line)] relative isolate"
    >
      {/* The Vertical Data Pipe */}
      <div className="absolute top-0 bottom-0 left-[2rem] md:left-[5rem] lg:left-0 lg:ml-[25%] w-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 opacity-50 hidden lg:block" aria-hidden="true" />
      
      {/* 12-column editorial layout matching prototype */}
      <div className="hp-grid relative z-10">
        {/* Left Side Category Kicker (Cols 1–3) */}
        <div className="col-span-4 md:col-span-8 lg:col-span-3 lg:sticky lg:top-28 lg:self-start pr-4 py-4 md:py-6 bg-[color:var(--cs-reading-surface)]">
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight text-[color:var(--cs-text-primary)]">
            Selected work
          </h3>
          <FlagshipIndex items={data.flagships.map((p) => ({ id: `work-${p.slug}`, title: p.title }))} />
        </div>

        {/* Main Flagship Content Area (Cols 4–12) with vertical divider border */}
        <div className="col-span-4 md:col-span-8 lg:col-span-9 lg:border-l lg:border-[color:var(--cs-structural-line)] lg:pl-8 bg-[color:var(--cs-reading-surface)]">
          {data.flagships.map((project, index) => (
            // Stable anchor for FlagshipIndex: StructuredReveal remounts its children when capability resolves
            <div key={project.slug} id={`work-${project.slug}`} className="scroll-mt-28">
            <StructuredReveal recipe="flagship-record" revealId={`flagship-${project.slug}`}>
              <FlagshipRecord
                project={project}
                index={index}
                reversed={index % 2 === 1}
                depthId={index === 0 ? "flagship-lead-image" : undefined}
              />
            </StructuredReveal>
            </div>
          ))}
        </div>
      </div>

      {/* Explosive CTA Block */}
      <div className="hp-grid mt-12 md:mt-20 mb-12 md:mb-20">
        <div className="col-span-4 md:col-span-8 lg:col-span-12 relative overflow-hidden bg-[color:var(--cs-signal)] dark:bg-zinc-800 isolate shadow-2xl">
          
          {/* Geometric lines inside the block */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] md:w-[70%] aspect-square border border-white/20 rounded-full pointer-events-none z-0" aria-hidden="true" />
          <CompassArc className="absolute right-0 top-0 z-0 w-[24%] rotate-180 text-white/20" />
          <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white/20 pointer-events-none z-0" aria-hidden="true" />

          <Link
            href={data.catalogueRoute}
            className="group relative z-10 flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-white"
          >
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6.5vw,6.5rem)] font-black uppercase leading-[0.85] tracking-tight text-white transition-transform duration-500 group-hover:scale-[1.02]">
              View All<br />Projects
            </h3>
            <div className="mt-8 md:mt-12 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-[color:var(--cs-signal)] dark:group-hover:text-zinc-900">
              <ArrowUpRight
                size={24}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </div>
          </Link>
        </div>
      </div>

      {leadFlagship && (
        <EvidenceDepthEffect
          containerId={SECTION_IDS.flagships}
          targetSelector='[data-gsap-depth="flagship-lead-image"]'
          waitForRevealId={`flagship-${leadFlagship.slug}`}
          direction={-1}
        />
      )}
    </HomepageSceneFrame>
  );
}
