import HandoffLink from "@/components/shell/HandoffLink";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import ScreenshotFrameComponent from "@/components/evidence/ScreenshotFrame";
import EmptySafeActionsComponent from "@/components/evidence/EmptySafeActions";
import StructuredReveal from "@/components/motion/StructuredReveal";
import EvidenceDepthEffect from "@/components/motion/EvidenceDepthEffect";
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
      className={`hp-grid items-start gap-y-8 py-12 md:py-16 lg:py-20 ${
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
          {/* Geometric lines inside the block */}
          <div className="absolute top-[12%] left-[8%] w-[72%] aspect-square border border-white/20 pointer-events-none z-0" aria-hidden="true" />
          <div className="absolute right-[-5%] bottom-[-10%] w-[64%] aspect-square border border-white/10 rounded-full pointer-events-none z-0" aria-hidden="true" />
          <div className="absolute top-[50%] left-[-10%] w-[40%] h-[1px] bg-white/20 pointer-events-none z-0" aria-hidden="true" />

          <div className="relative z-10 flex flex-col h-full">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/70 mb-6 lg:mb-8 block">
              Case study / {String(index + 1).padStart(2, '0')}
            </span>
            
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5.5vw,5rem)] font-black uppercase leading-[0.85] tracking-tight text-white mb-8 lg:mb-12 w-[90%] md:w-[80%]">
              {project.title}
            </h3>
            
            <div className="mt-auto shadow-2xl relative z-10 border-4 border-white/10 dark:border-black/20 bg-[color:var(--cs-foundation)]">
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
        className={`col-span-4 md:col-span-8 lg:col-span-4 ${
          reversed ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-9"
        } flex flex-col justify-end pt-2 pb-4 lg:pb-12`}
      >
        <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {project.year} · {project.role}
        </p>

        <p className="text-[15px] leading-relaxed text-[color:var(--cs-text-secondary)]">
          {project.editorialSummary}
        </p>

        {project.technicalEvidence && project.technicalEvidence.length > 0 && (
          <ul className="mt-8 flex flex-col gap-3" role="list">
            {project.technicalEvidence.map((evidence, i) => (
              <li
                key={i}
                className="flex items-start gap-3 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[color:var(--cs-text-primary)]"
              >
                <span className="mt-1 h-[3px] w-[3px] shrink-0 bg-[color:var(--cs-signal)] dark:bg-zinc-500" aria-hidden="true" />
                {evidence}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 lg:mt-12">
          <EmptySafeActionsComponent actions={actions} />
        </div>
      </div>
    </article>
  );
}

export default function SceneFlagships({ data }: SceneFlagshipsProps) {
  return (
    <HomepageSceneFrame
      id={SECTION_IDS.flagships}
      sceneNumber="02"
      heading="Flagships"
      surface="reading"
      className="border-t border-b border-[color:var(--cs-structural-line)] relative isolate"
    >
      {/* The Vertical Data Pipe */}
      <div className="absolute top-0 bottom-0 left-[2rem] md:left-[5rem] lg:left-0 lg:ml-[25%] w-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 opacity-50 hidden lg:block" aria-hidden="true" />
      
      {/* 12-column editorial layout matching prototype */}
      <div className="hp-grid relative z-10">
        {/* Left Side Category Kicker (Cols 1–3) */}
        <div className="col-span-4 md:col-span-8 lg:col-span-3 pr-4 py-4 md:py-6 bg-[color:var(--cs-reading-surface)]">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--cs-signal-text)]">
            02 · WORK
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight text-[color:var(--cs-text-primary)]">
            Selected Flagship Systems
          </h3>
          <p className="mt-3 max-w-[28ch] text-xs text-[color:var(--cs-text-secondary)] leading-relaxed">
            Case studies demonstrating end-to-end AI product & full-stack software delivery.
          </p>
          <div className="mt-6 h-0.5 w-12 bg-[color:var(--cs-signal)]" aria-hidden="true" />
        </div>

        {/* Main Flagship Content Area (Cols 4–12) with vertical divider border */}
        <div className="col-span-4 md:col-span-8 lg:col-span-9 lg:border-l lg:border-[color:var(--cs-structural-line)] lg:pl-8 bg-[color:var(--cs-reading-surface)]">
          <StructuredReveal recipe="flagship-record" revealId={`flagship-${data.flagships[0].slug}`}>
            <FlagshipRecord
              project={data.flagships[0]}
              index={0}
              reversed={false}
              depthId={`flagship-${data.flagships[0].slug}-image`}
            />
          </StructuredReveal>

          <StructuredReveal recipe="flagship-record" revealId={`flagship-${data.flagships[1].slug}`}>
            <FlagshipRecord project={data.flagships[1]} index={1} reversed={true} />
          </StructuredReveal>
        </div>
      </div>

      <EvidenceDepthEffect
        containerId={SECTION_IDS.flagships}
        targetSelector={`[data-gsap-depth="flagship-${data.flagships[0].slug}-image"]`}
        waitForRevealId={`flagship-${data.flagships[0].slug}`}
        direction={-1}
      />
    </HomepageSceneFrame>
  );
}
