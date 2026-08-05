import Link from "next/link";
import HandoffLink from "@/components/shell/HandoffLink";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import ScreenshotFrameComponent from "@/components/evidence/ScreenshotFrame";
import StructuredReveal from "@/components/motion/StructuredReveal";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import type { HomepageMoreWorkProjection } from "@/lib/content/homepage-projections";
import type { ProjectCardProjection } from "@/lib/content/types";

interface SceneMoreWorkProps {
  data: HomepageMoreWorkProjection;
}

function SupportingRecord({
  project,
  position,
}: {
  project: ProjectCardProjection;
  position: number;
}) {
  return (
    <article
      className="hp-grid items-start gap-y-6 border-t border-[color:var(--cs-structural-line)] py-10 md:py-12"
      data-motion-target={`supporting-record-${project.slug}`}
    >
      {/* Screenshot — alternating alignment at desktop */}
      <div
        className={`col-span-4 md:col-span-3 lg:col-span-5 ${
          position % 2 === 0 ? "lg:col-start-1" : "lg:col-start-2"
        }`}
      >
        <ScreenshotFrameComponent
          src={project.heroImage}
          alt={`${project.title} — application screenshot`}
          wide
        />
      </div>

      {/* Text content */}
      <div className="col-span-4 md:col-span-5 lg:col-span-6 lg:col-start-7">
        <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          <span className="text-[color:var(--cs-signal-text)]">
            {String(position).padStart(2, "0")}
          </span>
          {" · "}{project.year} · {project.role}
        </p>

        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,3vw,2rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">
          {project.title}
        </h3>

        <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-[color:var(--cs-text-secondary)] md:text-base">
          {project.editorialSummary}
        </p>

        <HandoffLink
          href={project.detailRoute}
          className="mt-4 inline-flex h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
        >
          View Case Study
          <ArrowUpRight size={12} aria-hidden="true" />
        </HandoffLink>
      </div>
    </article>
  );
}

export default function SceneMoreWork({ data }: SceneMoreWorkProps) {
  return (
    <HomepageSceneFrame
      id={SECTION_IDS.moreWork}
      sceneNumber="04"
      heading="More Work"
      surface="reading"
      className="relative overflow-hidden"
    >
      {/* Shadcn-style Grid Background (Subtle, masked) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.07]" 
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '128px 128px',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
        }}
      />

      <div className="hp-grid relative z-10">
        <div className="col-span-4 md:col-span-6 lg:col-span-8">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            04 · More Selected Work
          </p>
          <div className="mt-4 h-0.5 w-16 bg-[color:var(--cs-signal)] dark:bg-zinc-700 md:w-24" aria-hidden="true" />
        </div>
      </div>

      <div className="relative z-10">
        {data.supporting.map((project, i) => (
          <StructuredReveal key={project.slug} recipe="supporting-record">
            <SupportingRecord
              project={project}
              position={i + 3} /* 03, 04, 05 — continuing from the 2 flagships */
            />
          </StructuredReveal>
        ))}
      </div>

      {/* Explosive CTA Block */}
      <div className="hp-grid mt-12 md:mt-24 mb-16 md:mb-24">
        <div className="col-span-4 md:col-span-8 lg:col-span-12 relative overflow-hidden bg-[color:var(--cs-signal)] dark:bg-zinc-800 isolate shadow-2xl">
          
          {/* Geometric lines inside the block */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] md:w-[70%] aspect-square border border-white/20 rounded-full pointer-events-none z-0" aria-hidden="true" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] aspect-square border border-white/10 pointer-events-none z-0 rotate-12" aria-hidden="true" />
          <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white/20 pointer-events-none z-0" aria-hidden="true" />

          <Link
            href={data.catalogueRoute}
            className="group relative z-10 flex flex-col items-center justify-center py-20 md:py-32 px-4 text-center focus-visible:outline-none"
          >
            <p className="mb-6 font-[family-name:var(--font-mono)] text-xs md:text-sm uppercase tracking-[0.2em] text-white/70">
              04 · Project Catalogue
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.85] tracking-tight text-white transition-transform duration-500 group-hover:scale-[1.02]">
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
    </HomepageSceneFrame>
  );
}
