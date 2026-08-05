import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import ProofFigureComponent from "@/components/evidence/ProofFigure";
import DocumentaryArtifactComponent from "@/components/evidence/DocumentaryArtifact";
import StructuredReveal from "@/components/motion/StructuredReveal";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import { DESTINATIONS, getDestinationHref } from "@/lib/destinations";
import type { HomepageExperienceProjection } from "@/lib/content/homepage-projections";
import type { ExperienceCardProjection } from "@/lib/content/types";

interface SceneExperienceProps {
  data: HomepageExperienceProjection;
}

function ExperienceRecord({
  record,
  isFirst,
}: {
  record: ExperienceCardProjection;
  isFirst: boolean;
}) {
  return (
    <article
      className={`py-8 md:py-10 relative isolate ${
        !isFirst ? "border-t border-[color:var(--cs-structural-line)]" : ""
      }`}
      data-motion-target={`experience-record-${record.company.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Structural Timeline Hash (Connects to the vertical column border on Desktop) */}
      <div className="absolute top-[2.75rem] md:top-[3.25rem] left-[-1rem] lg:left-[-2rem] w-4 lg:w-8 h-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />

      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 relative z-10">
        <h3 className="text-lg font-medium text-[color:var(--cs-text-primary)]">
          {record.role}
        </h3>
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {record.company}
          {record.period && ` · ${record.period}`}
        </span>
      </div>

      <p className="max-w-[58ch] text-base leading-relaxed text-[color:var(--cs-text-secondary)] relative z-10">
        {record.editorialSummary}
      </p>

      {record.proof && (
        <div className="mt-5 relative z-10">
          <ProofFigureComponent data={record.proof} size="compact" />
        </div>
      )}
    </article>
  );
}

export default function SceneExperience({ data }: SceneExperienceProps) {
  const experienceDest = DESTINATIONS.experience;
  const certificatesDest = DESTINATIONS.certificates;

  return (
    <HomepageSceneFrame
      id={SECTION_IDS.experience}
      sceneNumber="03"
      heading="Experience"
      surface="foundation"
      className="border-t border-b border-[color:var(--cs-structural-line)] relative isolate"
    >
      <div className="hp-grid">
        {/* Left Side Kicker (Cols 1–3) */}
        <div className="col-span-4 md:col-span-8 lg:col-span-3 pr-4 py-4 md:py-6">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--cs-signal-text)]">
            03 · EXPERIENCE
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight text-[color:var(--cs-text-primary)]">
            History & Credentials
          </h3>
          <p className="mt-3 max-w-[28ch] text-xs text-[color:var(--cs-text-secondary)] leading-relaxed">
            Corroborated track record in full-stack architecture & AI engineering.
          </p>
          <div className="mt-6 h-0.5 w-12 bg-[color:var(--cs-signal)]" aria-hidden="true" />
        </div>

        {/* Main Records Column (Cols 4–9) separated by vertical border line */}
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:border-l lg:border-[color:var(--cs-structural-line-strong)] lg:pl-8 relative z-10">
          <StructuredReveal recipe="experience-record">
            <ExperienceRecord record={data.records[0]} isFirst={true} />
          </StructuredReveal>

          {/* Eskwelabs credential — attached to Eskwelabs record */}
          <StructuredReveal recipe="credential-artifact">
          <div
            className="border-t border-[color:var(--cs-structural-line)] py-6 relative isolate"
          >
            {/* Timeline Hash for Credential */}
            <div className="absolute top-[2.25rem] left-[-1rem] lg:left-[-2rem] w-4 lg:w-8 h-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />

            <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] relative z-10">
              Corroborating Credential
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start relative z-10">
              <DocumentaryArtifactComponent
                src={data.attachedCredential.image}
                alt={`${data.attachedCredential.title} certificate`}
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-[color:var(--cs-text-primary)]">
                  {data.attachedCredential.title}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  {data.attachedCredential.issuer} · {data.attachedCredential.date}
                </p>
                <p className="mt-1 max-w-[40ch] text-sm text-[color:var(--cs-text-secondary)]">
                  {data.attachedCredential.editorialSummary}
                </p>
                {data.attachedCredential.credentialUrl && (
                  <a
                    href={data.attachedCredential.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex h-11 items-center gap-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal-text)] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                  >
                    Verify Credential
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
          </StructuredReveal>

          <StructuredReveal recipe="experience-record">
            <ExperienceRecord record={data.records[1]} isFirst={false} />
          </StructuredReveal>
        </div>

        {/* Route cues sidebar (Cols 10–12) - Option 2: Architectural Pillar */}
        <div className="col-span-4 mt-12 md:mt-16 lg:mt-0 flex flex-col lg:col-span-3 lg:col-start-10 bg-[color:var(--cs-signal)] dark:bg-zinc-800 text-white relative overflow-hidden shadow-2xl isolate">
          {/* Geometric accents inside the pillar */}
          <div className="absolute top-[-10%] right-[-30%] w-[150%] aspect-square border border-white/20 rounded-full pointer-events-none z-0" aria-hidden="true" />
          <div className="absolute bottom-[10%] left-[-20%] w-[120%] aspect-square border border-white/10 pointer-events-none z-0 rotate-12" aria-hidden="true" />
          <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white/10 pointer-events-none z-0" aria-hidden="true" />

          <div className="p-6 md:p-8 lg:p-10 flex flex-col h-full relative z-10 justify-between min-h-[400px]">
            <div className="flex flex-col gap-10">
              <Link
                href={getDestinationHref(experienceDest)}
                className="group flex flex-col gap-3 focus-visible:outline-none"
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/70 transition-colors group-hover:text-white">
                  Directory / 01
                </span>
                <span className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-black uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 leading-[0.9]">
                  Full<br />Experience
                </span>
                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-[color:var(--cs-signal)] dark:group-hover:text-zinc-900">
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
              
              <div className="w-full h-[1px] bg-white/20" aria-hidden="true" />

              <Link
                href={getDestinationHref(certificatesDest)}
                className="group flex flex-col gap-3 focus-visible:outline-none"
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/70 transition-colors group-hover:text-white">
                  Directory / 02
                </span>
                <span className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-black uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 leading-[0.9]">
                  All<br />Certificates
                </span>
                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-[color:var(--cs-signal)] dark:group-hover:text-zinc-900">
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
            </div>
            
            <div className="mt-12">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/40">
                End of Section 03
              </span>
            </div>
          </div>
        </div>
      </div>
    </HomepageSceneFrame>
  );
}
