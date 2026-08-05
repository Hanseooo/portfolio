import Image from "next/image";
import { HomepageSceneFrame } from "@/components/frames";
import StructuredReveal from "@/components/motion/StructuredReveal";
import EvidenceDepthEffect from "@/components/motion/EvidenceDepthEffect";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import type { HomepagePersonalProjection } from "@/lib/content/homepage-projections";
import ScenePresenceClient from "./ScenePresenceClient";

interface ScenePresenceProps {
  data: HomepagePersonalProjection;
}

export default function ScenePresence({ data }: ScenePresenceProps) {
  return (
    <HomepageSceneFrame
      id={SECTION_IDS.presence}
      sceneNumber="05"
      heading="Presence"
      surface="reading"
      className="relative overflow-hidden isolate"
    >
      {/* Section-Wide Blueprint Crosshair */}
      <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-[color:var(--cs-structural-line)] pointer-events-none z-0 hidden lg:block" aria-hidden="true" />
      <div className="absolute top-[-10%] left-[55%] w-[1px] h-[120%] bg-[color:var(--cs-structural-line)] pointer-events-none z-0 hidden lg:block" aria-hidden="true" />

      <div className="hp-grid relative z-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            05 · Personal & Live Presence
          </p>
          <div className="mt-4 h-0.5 w-16 bg-[color:var(--cs-signal)] dark:bg-zinc-700 md:w-24" aria-hidden="true" />
        </div>
      </div>

      {/* Static personal content — independent of provider state */}
      <StructuredReveal recipe="presence-region" revealId="presence-static">
        <div className="hp-grid mt-16 items-start md:mt-24 relative z-10">
          {/* Portrait + Personal identity (Group hover trigger for the whole column) */}
          <div
            className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-2 relative group"
            data-motion-target="presence-portrait"
            data-gsap-depth="presence-portrait"
          >
            <div className="relative max-w-xs mx-auto md:mx-0 isolate">
              {/* Geometric Portrait Echo (Ignites on hover) */}
              <div className="absolute -inset-10 pointer-events-none z-0 hidden md:block" aria-hidden="true">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border border-[color:var(--cs-structural-line-strong)] transition-all duration-700 group-hover:border-[color:var(--cs-signal)]" style={{ borderRadius: '48% 48% 12% 12%' }} />
                <div className="absolute top-[10%] right-[-10%] w-[33%] aspect-square rounded-full bg-[color:var(--cs-signal)] dark:bg-zinc-800 blur-2xl opacity-50 transition-colors duration-700 dark:group-hover:bg-[color:var(--cs-signal)]" />
              </div>

              <div className="relative">
                {/* Portrait Surveyor Alignment Mark */}
                <div className="absolute top-[-1.5rem] left-[-1.5rem] w-8 h-8 pointer-events-none z-20 hidden md:block" aria-hidden="true">
                  <div className="absolute inset-0 rounded-full border border-[color:var(--cs-text-primary)] opacity-20" />
                  <div className="absolute top-1/2 left-[-50%] w-[200%] h-[1px] bg-[color:var(--cs-text-primary)] opacity-30 -translate-y-1/2" />
                  <div className="absolute top-[-50%] left-1/2 w-[1px] h-[200%] bg-[color:var(--cs-text-primary)] opacity-30 -translate-x-1/2" />
                </div>

                {/* Cyber-Brutalist Solid Offset (Charcoal in light mode, lighter gray in dark mode) */}
                <div 
                  className="absolute inset-0 -translate-x-3 translate-y-3 md:-translate-x-4 md:translate-y-4 bg-zinc-900 dark:bg-zinc-200 z-0 pointer-events-none transition-transform duration-500 ease-out group-hover:-translate-x-4 group-hover:translate-y-4 md:group-hover:-translate-x-6 md:group-hover:translate-y-6" 
                  aria-hidden="true"
                />

                <div className="relative z-10 border-4 border-[#F3F0E9] bg-[color:var(--cs-reading-surface)] overflow-hidden shadow-2xl transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <Image
                    src={data.portrait}
                    alt="Hans Amoguis"
                    className="h-auto w-full object-cover opacity-90 transition-all duration-500 dark:md:grayscale dark:group-hover:grayscale-0"
                    sizes="(max-width: 768px) 60vw, (max-width: 1280px) 30vw, 300px"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-b border-[color:var(--cs-structural-line)] pb-2 relative z-10 bg-[color:var(--cs-reading-surface)]">
                <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors duration-500 group-hover:text-[color:var(--cs-signal-text)]">
                  {data.personalHandle}
                </p>
              </div>
            </div>
          </div>

          {/* About Me — Schematic Diagram Layout */}
          <div className="col-span-4 mt-12 md:col-span-4 md:mt-8 lg:col-span-5 lg:col-start-7 lg:mt-12 relative flex flex-col gap-6 md:gap-12">
            
            {/* The Circuit Connection Line (structural routing from Node 1 to Node 2) */}
            <div 
              className="absolute top-[40%] bottom-[40%] left-6 md:left-8 w-6 md:w-12 border-l border-b border-[color:var(--cs-structural-line-strong)] z-0 hidden md:block" 
              style={{ borderBottomLeftRadius: '12px' }}
              aria-hidden="true" 
            />

            {/* Node 1: The Core (Solid structural block) */}
            <div className="relative z-10 bg-[#E10600] dark:bg-[color:var(--cs-foundation)] border border-transparent dark:border-[color:var(--cs-structural-line-strong)] p-6 md:p-8 shadow-xl">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/90 dark:text-[color:var(--cs-signal-text)] mb-3 block">
                01 / About me
              </span>
              <p className="text-[15px] md:text-base leading-relaxed text-white dark:text-[color:var(--cs-text-primary)] font-medium">
                {data.aboutPrimary}
              </p>
            </div>

            {/* Node 2: The Extension (Asymmetrical wireframe, indented) */}
            <div className="relative z-10 md:ml-16 lg:ml-20 border-l-[3px] border-[color:var(--cs-signal)] pl-6 py-2">
              {/* Asymmetrical geometric accents */}
              <div className="absolute -left-[3px] top-0 w-3 h-[2px] bg-[color:var(--cs-signal)]" aria-hidden="true" />
              <div className="absolute -left-[3px] bottom-0 w-3 h-[2px] bg-[color:var(--cs-signal)]" aria-hidden="true" />
              
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)] mb-2 block">
                02 / Outside of school or work
              </span>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-[color:var(--cs-text-secondary)]">
                {data.aboutSecondary}
              </p>
            </div>

          </div>
        </div>
      </StructuredReveal>

      <EvidenceDepthEffect
        containerId={SECTION_IDS.presence}
        targetSelector='[data-gsap-depth="presence-portrait"]'
        waitForRevealId="presence-static"
        direction={1}
      />

      {/* Option 1: Live providers — Telemetry Grid Island */}
      <div className="relative mt-24 md:mt-32 pt-16 pb-12 border-t border-[color:var(--cs-structural-line-strong)]" data-motion-target="presence-providers">
        
        {/* Telemetry Grid Masked to the right */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.07]" 
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '128px 128px',
            maskImage: 'linear-gradient(to right, transparent 20%, black 80%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 80%)'
          }}
        />

        <div className="relative z-10">
          <ScenePresenceClient />
        </div>
      </div>
    </HomepageSceneFrame>
  );
}
