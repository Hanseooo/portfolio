// components/routes/ProjectEvidenceBody.tsx
import { ScreenshotFrame } from "@/components/evidence";
import StructuredReveal from "@/components/motion/StructuredReveal";
import type { ProjectDetailProjection } from "@/lib/content/detail-projections";

interface ProjectEvidenceBodyProps {
  project: ProjectDetailProjection;
}

/**
 * Project evidence body — S4 §9.2 claim-to-proof sequence.
 *
 * Order: Brief → Decisions → System → Capabilities → Screenshots.
 * Each section has a stable ID for local navigation anchoring.
 * Gallery deduplication handled upstream (hero excluded from gallery).
 * No accordions, tabs, or show-all controls.
 */
export default function ProjectEvidenceBody({ project }: ProjectEvidenceBodyProps) {
  // Determine which sections exist for local nav
  const hasDecisions = project.technicalDecisions.length > 0;
  const hasStack = project.stack.length > 0;
  const hasIntegrations = project.integrations.length > 0;
  const hasFeatures = project.features.length > 0;
  const hasGallery = project.gallery.length > 0;

  return (
    <div className="space-y-0">
      {/* ── Section: Hero Screenshot ── */}
      <StructuredReveal recipe="evidence-section">
        <section
          id="project-hero-image"
          className="scroll-target evidence-section"
          aria-labelledby="project-hero-image-heading"
          data-motion-target="evidence-hero"
        >
          <h2 id="project-hero-image-heading" className="sr-only">
            Primary visual evidence
          </h2>
          <ScreenshotFrame
            src={project.heroImage}
            alt={`${project.title} — primary interface screenshot`}
            priority
            wide
          />
        </section>
      </StructuredReveal>

      {/* ── Section: Brief ── */}
      <StructuredReveal recipe="evidence-section">
        <section
          id="project-brief"
          className="scroll-target evidence-section border-t border-[color:var(--cs-structural-line)]"
          aria-labelledby="project-brief-heading"
          data-motion-target="evidence-brief"
        >
          <h2
            id="project-brief-heading"
            className="mb-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-3xl"
          >
            Brief
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8">
              {/* Problem */}
              <div className="mb-8">
                <h3 className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Problem
                </h3>
                <p className="readable-measure text-base leading-relaxed text-[color:var(--cs-text-secondary)] md:text-lg">
                  {project.problem}
                </p>
              </div>

              {/* Response / Overview */}
              <div>
                <h3 className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Response
                </h3>
                <p className="readable-measure text-base leading-relaxed text-[color:var(--cs-text-secondary)] md:text-lg">
                  {project.overview}
                </p>
              </div>
            </div>
          </div>
        </section>
      </StructuredReveal>

      {/* ── Section: Technical Decisions ── */}
      {hasDecisions && (
        <StructuredReveal recipe="evidence-section">
          <section
            id="project-decisions"
            className="scroll-target evidence-section border-t border-[color:var(--cs-structural-line)]"
            aria-labelledby="project-decisions-heading"
            data-motion-target="evidence-decisions"
          >
            <h2
              id="project-decisions-heading"
              className="mb-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-3xl"
            >
              Technical Decisions
            </h2>
            <ol className="space-y-6 readable-measure" role="list">
              {project.technicalDecisions.map((decision, i) => (
                <li key={i} className="flex items-baseline gap-5">
                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-signal)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
                    {decision}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </StructuredReveal>
      )}

      {/* ── Section: System (Stack + Integrations) ── */}
      {hasStack && (
        <StructuredReveal recipe="evidence-section">
          <section
            id="project-system"
            className="scroll-target evidence-section border-t border-[color:var(--cs-structural-line)]"
            aria-labelledby="project-system-heading"
            data-motion-target="evidence-system"
          >
            <h2
              id="project-system-heading"
              className="mb-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-3xl"
            >
              System
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* Stack */}
              <div>
                <h3 className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Stack
                </h3>
                <ol className="space-y-2" role="list">
                  {project.stack.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-3">
                      <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-[color:var(--cs-text-primary)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Integrations — omitted entirely when empty */}
              {hasIntegrations && (
                <div>
                  <h3 className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                    Integrations
                  </h3>
                  <ol className="space-y-2" role="list">
                    {project.integrations.map((item, i) => (
                      <li key={item} className="flex items-baseline gap-3">
                        <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-[color:var(--cs-text-primary)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </section>
        </StructuredReveal>
      )}

      {/* ── Section: Capabilities (Features) ── */}
      {hasFeatures && (
        <StructuredReveal recipe="evidence-section">
          <section
            id="project-capabilities"
            className="scroll-target evidence-section border-t border-[color:var(--cs-structural-line)]"
            aria-labelledby="project-capabilities-heading"
            data-motion-target="evidence-capabilities"
          >
            <h2
              id="project-capabilities-heading"
              className="mb-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-3xl"
            >
              Capabilities
            </h2>
            {/* Two columns only on wide screens per S4 §9.4 */}
            <ol
              className="grid grid-cols-1 gap-y-3 gap-x-8 lg:grid-cols-2"
              role="list"
            >
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-baseline gap-4 py-2">
                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-[color:var(--cs-text-secondary)]">
                    {feature}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </StructuredReveal>
      )}

      {/* ── Section: Screenshots (Gallery) ── */}
      {hasGallery && (
        <StructuredReveal recipe="evidence-section">
          <section
            id="project-screenshots"
            className="scroll-target evidence-section border-t border-[color:var(--cs-structural-line)]"
            aria-labelledby="project-screenshots-heading"
            data-motion-target="evidence-gallery"
          >
            <h2
              id="project-screenshots-heading"
              className="mb-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-3xl"
            >
              Screenshots
            </h2>
            {/*
              Gallery layout per S4 §9.5:
              - First image: wide row
              - Following: paired on desktop, single on mobile
              - Hero already excluded by Plan 1 getProjectDetail
            */}
            <div className="space-y-6">
              {/* First gallery image — wide */}
              <ScreenshotFrame
                src={project.gallery[0]}
                alt={`${project.title} — screenshot 1`}
                wide
              />
              {/* Remaining images — paired on desktop, single on mobile */}
              {project.gallery.length > 1 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {project.gallery.slice(1).map((img, i) => (
                    <ScreenshotFrame
                      key={i}
                      src={img}
                      alt={`${project.title} — screenshot ${i + 2}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </StructuredReveal>
      )}
    </div>
  );
}
