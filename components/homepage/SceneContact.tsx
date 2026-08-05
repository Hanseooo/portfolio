import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import StructuredReveal from "@/components/motion/StructuredReveal";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import type { HomepageContactProjection } from "@/lib/content/homepage-projections";

interface SceneContactProps {
  data: HomepageContactProjection;
}

export default function SceneContact({ data }: SceneContactProps) {
  return (
    <HomepageSceneFrame
      id={SECTION_IDS.contact}
      sceneNumber="06"
      heading="Contact"
      surface="reading"
      className="relative py-16 md:py-24 lg:py-32 border-t border-[color:var(--cs-structural-line)] bg-[color:var(--cs-reading-surface)] text-[color:var(--cs-text-primary)] overflow-hidden"
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
          maskImage: 'radial-gradient(circle at 70% 50%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 70% 50%, black 40%, transparent 80%)'
        }}
      />

      {/* Geometric Outlines mirroring the Hero section */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" aria-hidden="true">
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[70vw] aspect-square rounded-full border border-[color:var(--cs-structural-line-strong)] opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[40vw] aspect-square border border-[color:var(--cs-structural-line-strong)] rotate-12 opacity-30" style={{ borderRadius: '48% 48% 12% 12%' }} />
        <div className="absolute bottom-[10%] right-[30%] w-[20vw] aspect-square border border-dashed border-[color:var(--cs-structural-line)] opacity-60" />
      </div>

      <div className="hp-grid relative z-10">
        <StructuredReveal
          recipe="contact-close"
          className="col-span-4 md:col-span-8 lg:col-span-12"
        >
          <div
            className="flex flex-col items-start"
            data-motion-target="contact-close"
          >
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--cs-signal-text)]">
              06 · CONTACT
            </p>

            <h2
              id={`${SECTION_IDS.contact}-heading`}
              className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-[color:var(--cs-text-primary)]"
            >
              {data.closeStatement}
            </h2>

            <ul className="mt-8 flex flex-wrap items-center gap-4 md:mt-10" role="list">
              {data.channels.map((channel) => (
                <li key={channel.type}>
                  <a
                    href={channel.href}
                    target={channel.type !== "email" ? "_blank" : undefined}
                    rel={channel.type !== "email" ? "noopener noreferrer" : undefined}
                    className="group inline-flex h-12 items-center gap-2 border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-6 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[color:var(--cs-text-primary)] hover:bg-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-foundation)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                  >
                    <span>{channel.label}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-70 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </StructuredReveal>
      </div>
    </HomepageSceneFrame>
  );
}
