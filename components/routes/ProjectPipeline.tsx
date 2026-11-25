// components/routes/ProjectPipeline.tsx
import { ArrowUpRight, RotateCcw } from "lucide-react";
import type { ProjectPipeline as Pipeline } from "@/lib/projects";

interface ProjectPipelineProps {
  pipeline: Pipeline;
}

/**
 * A project's pipeline as a drawn flow: hairline steps joined by rules,
 * stacked on phones and in one row from `xl`. The ordered list is the text
 * alternative. The retry loop is the one signal mark, a bracket drawn under
 * its step (`data-draw="extend-x"`), paired with an icon and words so color
 * is never the only cue.
 */
export default function ProjectPipeline({ pipeline }: ProjectPipelineProps) {
  const { steps, loop, caption, links = [] } = pipeline;

  return (
    <>
      <ol className="flex flex-col xl:flex-row" role="list" aria-label="Pipeline steps">
        {steps.map((step, i) => (
          <li key={step.label} className="flex flex-col xl:min-w-0 xl:flex-1 xl:flex-row">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="ml-5 block h-6 w-px shrink-0 bg-[color:var(--cs-structural-line-strong)] xl:ml-0 xl:mt-8 xl:h-px xl:w-6"
              />
            )}
            <div className="min-w-0 xl:flex-1">
              <div className="border border-[color:var(--cs-structural-line-strong)] px-4 py-3 xl:min-h-[6.5rem]">
                <span className="block font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--cs-text-secondary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-sm font-medium text-[color:var(--cs-text-primary)]">
                  {step.label}
                </span>
                {step.note && (
                  <span className="mt-1 block text-xs leading-snug text-[color:var(--cs-text-secondary)]">
                    {step.note}
                  </span>
                )}
              </div>
              {loop?.step === i && (
                <div className="px-4">
                  <span
                    aria-hidden="true"
                    data-draw="extend-x"
                    className="block h-3 origin-left border-x border-b border-[color:var(--cs-signal)]"
                  />
                  <span className="mt-2 flex items-start gap-2 text-xs leading-snug text-[color:var(--cs-text-secondary)]">
                    <RotateCcw size={12} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--cs-signal-text)]" />
                    {loop.label}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {caption && (
        <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          {caption}
        </p>
      )}

      {links.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-x-8" role="list">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
              >
                {link.label}
                <ArrowUpRight
                  size={12}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
