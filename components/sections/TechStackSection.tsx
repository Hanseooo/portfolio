"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { fadeUpReveal, clipReveal, peelReveal } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import { buildItems, toolsItems, deployItems } from "@/lib/skills";
import type { HomepageCapability } from "@/lib/content/homepage-projections";
import { DESTINATIONS, getDestinationHref } from "@/lib/destinations";
import { CompassArc, RegistrationMark, IndexMark } from "@/components/geometry";

function ProofLinks({ links, inverse = false }: { links: HomepageCapability["proof"]; inverse?: boolean }) {
  return (
    <ul className="mt-4 flex flex-col items-start">
      {links.map((link) => (
        <li key={link.href} className="max-w-full">
          <Link
            href={link.href}
            className={`group inline-flex min-h-11 max-w-full items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              inverse
                ? "text-white hover:text-white/70 focus-visible:outline-white"
                : "text-[color:var(--cs-text-secondary)] hover:text-[color:var(--cs-signal)] focus-visible:outline-[color:var(--cs-focus-ring)]"
            }`}
          >
            <span>{link.label}</span>
            <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function TechStackSection({ id, capabilities }: { id: string; capabilities: HomepageCapability[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lead, ...rest] = capabilities;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative w-full overflow-hidden flex flex-col items-center">
      
      {/* Top Tilted Marquee (Option 2) */}
      <div className="w-full overflow-hidden ticker-fade border-y border-border py-4 bg-zinc-900 dark:bg-zinc-800 text-white transform -rotate-2 scale-[1.05] origin-center z-20 relative shadow-xl mt-8">
        <div className="ticker-track flex min-w-max items-center" style={{ animationDuration: "45s" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="pr-8 font-black text-xl lg:text-2xl uppercase tracking-tighter text-white/90">
              {"PLAN · DESIGN · DEVELOP · TEST · DEPLOY · REVIEW · ITERATE · "}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1400px] px-6 py-24 relative z-10">
        {/* Architectural / Geometric Backdrop Lines & Crop Marks */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block" aria-hidden="true">
          {/* Vertical Guide Lines */}
          <div className="absolute top-12 left-12 bottom-12 w-[1px] bg-border opacity-30" />
          <div className="absolute top-12 right-12 bottom-12 w-[1px] bg-border opacity-30" />
          
          {/* Targeting Crop Marks (Corners) */}
          <div className="absolute top-12 left-12 w-6 h-6 border-t-2 border-l-2 border-foreground/30 -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-12 right-12 w-6 h-6 border-t-2 border-r-2 border-foreground/30 translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-12 left-12 w-6 h-6 border-b-2 border-l-2 border-foreground/30 -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-12 right-12 w-6 h-6 border-b-2 border-r-2 border-foreground/30 translate-x-[1px] translate-y-[1px]" />
        </div>

        {/* Section Title */}
        <div className="mb-16 relative z-10">
          <h2 id={`${id}-heading`} className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground uppercase perspective-1000">
            <SplitText text="Capabilities" />
          </h2>
        </div>

        {/* Asymmetric Bento Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border bg-background relative z-10"
        >
          {/* What I build: lead plate (5 cols) + numbered records (7 cols), aligned to the Build/Tools split below */}
          <motion.div
            {...fadeUpReveal(reducedMotion)}
            className="lg:col-span-5 border-b lg:border-r border-border bg-[color:var(--cs-signal)] dark:bg-zinc-800 text-white p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-hidden isolate"
          >
            {/* Compass swung from the bottom-left, registration mark bleeding off the top-right */}
            <CompassArc className="absolute bottom-0 left-0 z-0 w-[85%] text-white/20" />
            <RegistrationMark className="absolute -top-16 -right-16 z-0 w-48 text-white/20" />
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/80 mb-4 relative z-10">
              What I build
            </p>
            {/* Dimension line spanning the plate's content width */}
            <svg aria-hidden="true" className="relative z-10 mb-16 lg:mb-24 block h-3 w-full text-white/40 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 12">
              <path d="M0 0 V12 M100 0 V12 M0 6 H100" fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="mt-auto relative z-10">
              <span className="block font-[family-name:var(--font-display)] text-5xl font-black leading-none text-white/40 mb-4">
                01
              </span>
              <h3 className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase tracking-tighter leading-[0.9] text-white">
                {lead.name}
              </h3>
              <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-white/85">
                {lead.description}
              </p>
              <ProofLinks links={lead.proof} inverse />
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col border-b border-border">
            {rest.map((capability, idx) => (
              <motion.div
                key={capability.name}
                {...fadeUpReveal(reducedMotion, 0.1 + idx * 0.08)}
                className="group/row relative flex-1 grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto] gap-x-8 gap-y-2 p-8 lg:px-12 xl:px-16 border-b last:border-b-0 border-border"
              >
                <IndexMark position={idx + 2} className="sm:self-start sm:pt-1" />
                <div className="min-w-0">
                  <h3 className="text-2xl xl:text-3xl font-black uppercase tracking-tighter leading-none text-foreground">
                    {capability.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
                <div className="sm:col-start-2 xl:col-start-3 xl:self-center">
                  <ProofLinks links={capability.proof} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cell 1: BUILD (Large Left Column) */}
          <motion.div 
            {...fadeUpReveal(reducedMotion, 0.1)}
            className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-hidden isolate"
          >
            {/* Architectural Grid and Asymmetrical Routing Lines */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
            
            <div className="absolute top-[25%] right-[15%] w-[45%] h-[60%] border-t border-r border-border/80 z-0 hidden sm:block" aria-hidden="true" />
            <div className="absolute bottom-0 left-[20%] w-[1px] h-[40%] bg-primary/40 z-0 hidden sm:block" aria-hidden="true" />
            
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-12 relative z-10">
              Build
            </p>
            <motion.div 
              {...clipReveal(reducedMotion)}
              className="flex flex-col gap-2 mt-auto relative z-10"
            >
              {buildItems.map((item, idx) => (
                <span 
                  key={idx} 
                  className="text-[clamp(1.75rem,3.5vw,3rem)] font-black uppercase tracking-tighter leading-none text-foreground hover:text-primary transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side Container */}
          <div className="lg:col-span-7 flex flex-col perspective-1000">
            {/* Cell 2: TOOLS (Dark/Terminal) */}
            <motion.div 
              {...peelReveal(reducedMotion, 0.2)}
              className="border-b border-border p-8 lg:p-12 xl:p-16 bg-zinc-900 dark:bg-zinc-800 text-white flex-auto flex flex-col relative overflow-hidden isolate transform-style-3d origin-bottom"
            >
              {/* Asymmetrical Measurement Marks / Engineering Scales */}
              <div className="absolute top-0 right-1/3 w-[1px] h-4 bg-white/20 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-0 right-[35%] w-[1px] h-2 bg-white/20 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-0 right-[37%] w-[1px] h-8 bg-white/30 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-8 left-0 w-8 md:w-16 h-[1px] bg-primary pointer-events-none" aria-hidden="true" />
              
              {/* Vertical Alignment Track */}
              <div className="absolute top-0 bottom-0 right-[10%] md:right-[20%] w-[1px] bg-white/[0.05] pointer-events-none hidden sm:block" aria-hidden="true" />
              <div className="absolute top-[40%] right-[10%] md:right-[20%] w-2 h-[1px] bg-white/20 pointer-events-none hidden sm:block" aria-hidden="true" />
              <div className="absolute top-[60%] right-[10%] md:right-[20%] w-4 h-[1px] bg-white/20 -translate-x-1 pointer-events-none hidden sm:block" aria-hidden="true" />

              {/* Surveyor's Registration Mark (Geometric Target) */}
              <div className="absolute top-[20%] right-[25%] w-16 h-16 pointer-events-none hidden md:block" aria-hidden="true">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute top-1/2 left-[-25%] w-[150%] h-[1px] bg-white/10 -translate-y-1/2" />
                <div className="absolute top-[-25%] left-1/2 w-[1px] h-[150%] bg-white/10 -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 border border-white/40 -translate-x-1/2 -translate-y-1/2 rounded-full" />
              </div>

              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-8 relative z-10">
                Tools
              </p>
              <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 font-mono text-sm lg:text-base tracking-tight mt-auto relative z-10">
                {toolsItems.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    {...fadeUpReveal(reducedMotion, 0.4 + (idx * 0.05))}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <span className="text-primary dark:text-zinc-400 shrink-0" aria-hidden="true">{`>`}</span>
                    <span className="opacity-90 truncate">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Cell 3: DEPLOY (Data-dense List) */}
            <motion.div 
              {...peelReveal(reducedMotion, 0.3)}
              className="p-8 lg:p-12 xl:p-16 flex-auto flex flex-col bg-muted/10 relative overflow-hidden isolate transform-style-3d origin-bottom"
            >
              {/* Architectural layout lines */}
              <div className="absolute top-[40%] left-[-10%] w-[120%] h-[1px] bg-border pointer-events-none opacity-60" aria-hidden="true" />
              <div className="absolute top-[-10%] right-[25%] w-[1px] h-[120%] bg-border pointer-events-none opacity-60" aria-hidden="true" />
              
              {/* Target bracket (Asymmetrical bottom right corner) */}
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-foreground/30 pointer-events-none hidden sm:block" aria-hidden="true" />

              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-8 relative z-10 bg-background/80 px-2 -ml-2 inline-block w-fit backdrop-blur-sm">
                Deploy
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 mt-auto relative z-10">
                {deployItems.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    {...fadeUpReveal(reducedMotion, 0.6 + (idx * 0.05))}
                    className="flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-primary transition-colors shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium tracking-tight uppercase text-foreground/80 group-hover:text-foreground transition-colors truncate">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-4 border border-t-0 border-border bg-zinc-900 dark:bg-zinc-800 text-white p-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-sm leading-relaxed">
            Also taking freelance work: AI/RAG features · workflow automation · custom web apps · business systems
          </p>
          <a
            href={getDestinationHref(DESTINATIONS.contact)}
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start font-mono text-xs font-bold uppercase tracking-widest hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          >
            Start a project
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Bottom Tilted Marquee (Option 2) */}
      <div className="w-full overflow-hidden ticker-fade border-y border-border py-4 bg-zinc-900 dark:bg-zinc-800 text-white transform rotate-2 scale-[1.05] origin-center z-20 relative shadow-xl mb-8">
        <div className="ticker-track-reverse flex min-w-max items-center" style={{ animationDuration: "45s" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="pr-8 font-black text-xl lg:text-2xl uppercase tracking-tighter text-white/90">
              {"BRAINSTORM · SPEC · PLAN · IMPLEMENT · REVIEW · PUSH · "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
