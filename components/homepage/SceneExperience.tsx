import Link from "next/link";
import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import ProofFigureComponent from "@/components/evidence/ProofFigure";
import DocumentaryArtifactComponent from "@/components/evidence/DocumentaryArtifact";
import StructuredReveal from "@/components/motion/StructuredReveal";
import { CompassArc, RegistrationMark } from "@/components/geometry";
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
      <div className="absolute top-[calc(2.75rem-3px)] md:top-[calc(3.25rem-3px)] left-[-2rem] h-[7px] w-[7px] -translate-x-1/2 rounded-full border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] z-0 hidden lg:block" aria-hidden="true" />

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
      {record.evidenceLink && (
        <Link href={record.evidenceLink.href} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-[color:var(--cs-signal-text)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]">
          {record.evidenceLink.label}
          <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
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
      sceneNumber="04"
      heading="Experience"
      surface="foundation"
      className="border-t border-b border-[color:var(--cs-structural-line)] relative isolate"
    >
      <div className="hp-grid">
        {/* Left Side Kicker (Cols 1–3) */}
        <div className="col-span-4 md:col-span-8 lg:col-span-3 lg:mr-8 bg-zinc-900 dark:bg-zinc-800 text-white p-6 md:p-8 lg:p-6 xl:p-8 shadow-2xl relative overflow-clip isolate">
          <CompassArc className="absolute bottom-0 left-0 z-0 w-[90%] text-white/15 hidden lg:block" />
          <div className="lg:sticky lg:top-28 relative z-10">
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-[clamp(1.125rem,1.75vw,1.875rem)] font-black uppercase leading-tight tracking-tight text-white">
            History & Credentials
          </h3>
          {/* Schedule of the records on the right */}
          <ol role="list" className="mt-10 hidden flex-col gap-6 border-l border-white/25 pl-5 lg:flex">
            {data.records.map((record) => (
              <li key={record.source.recordId} className="relative">
                <span className="absolute -left-5 top-1.5 h-[7px] w-[7px] -translate-x-1/2 rounded-full border border-white bg-zinc-900 dark:bg-zinc-800" aria-hidden="true" />
                <p className="text-sm font-medium leading-tight text-white">{record.company}</p>
                {record.period && (
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/60">
                    {record.period}
                  </p>
                )}
              </li>
            ))}
          </ol>
          </div>
        </div>

        {/* Main Records Column (Cols 4–9) separated by vertical border line */}
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:border-l lg:border-[color:var(--cs-structural-line-strong)] lg:pl-8 relative z-10">
          {data.records.map((record, index) => (
          <Fragment key={record.source.recordId}>
          <StructuredReveal recipe="experience-record">
            <ExperienceRecord record={record} isFirst={index === 0} />
          </StructuredReveal>

          {/* Eskwelabs credential — attached to Eskwelabs record */}
          {record.source.recordId === "eskwelabs" && (
          <StructuredReveal recipe="credential-artifact">
          <div
            className="border-t border-[color:var(--cs-structural-line)] py-6 relative isolate"
          >
            {/* Timeline Hash for Credential */}
            <div className="absolute top-[2.25rem] left-[-1rem] lg:left-[-2rem] w-4 lg:w-8 h-[1px] bg-[color:var(--cs-structural-line-strong)] z-0 hidden lg:block" aria-hidden="true" />

            <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] relative z-10">
              Certificate
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
          )}
          </Fragment>
          ))}
        </div>

        {/* Route cues sidebar (Cols 10–12) - Option 2: Architectural Pillar */}
        <div className="col-span-4 mt-12 md:mt-16 lg:mt-0 flex flex-col lg:col-span-3 lg:col-start-10 bg-[color:var(--cs-signal)] dark:bg-zinc-800 text-white relative overflow-clip shadow-2xl isolate">
          {/* Geometric accents inside the pillar */}
          <RegistrationMark className="absolute -top-20 -right-20 z-0 w-64 text-white/20" />
          <CompassArc className="absolute bottom-0 left-0 z-0 w-full text-white/15" />
          <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white/10 pointer-events-none z-0" aria-hidden="true" />

          <div className="p-6 md:p-8 lg:p-6 xl:p-8 flex flex-col flex-1 relative z-10 min-h-[400px]">
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              <Link
                href={getDestinationHref(experienceDest)}
                className="group flex flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl lg:text-[clamp(1.5rem,2.5vw,2.25rem)] xl:text-4xl font-black uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 leading-[0.9]">
                  Full<br />Experience
                </span>
                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-[color:var(--cs-signal)] dark:group-hover:text-zinc-900">
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
              
              <div className="w-full h-[1px] bg-white/20" aria-hidden="true" />

              <Link
                href={getDestinationHref(certificatesDest)}
                className="group flex flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl lg:text-[clamp(1.5rem,2.5vw,2.25rem)] xl:text-4xl font-black uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 leading-[0.9]">
                  All<br />Certificates
                </span>
                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-[color:var(--cs-signal)] dark:group-hover:text-zinc-900">
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HomepageSceneFrame>
  );
}
