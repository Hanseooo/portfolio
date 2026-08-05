"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { fadeUpReveal, clipReveal } from "@/lib/motion";

const buildItems = [
  "React", "Next.js", "Langchain",
  "LangGraph", "LangSmith", "Redis",
  "FastAPI", "PostgreSQL", "Tailwind CSS",
  "Zustand", "Tanstack Query", "Tanstack Router",
];

const toolsItems = [
  "Claude Code",
  "Codex",
  "Antigravity CLI",
  "OpenCode",
  "Playwright CLI",
  "Github CLI",
  "Docker",
  "Langfuse",
  "Langsmith",
  "Sentry",
  "Posthog",
];

// Brevo removed per previous project requirements
const deployItems = [
  "Vercel", "Supabase", "Firebase", "Cloudinary", 
  "Neon", "Render", "Railway", "Upstash", 
  "Cloudflare", "Clerk"
];

export default function TechStackSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id={id} className="relative w-full overflow-hidden flex flex-col items-center">
      
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
          <motion.h2
            {...clipReveal(reducedMotion)}
            className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground uppercase"
          >
            Capabilities
          </motion.h2>
        </div>

        {/* Asymmetric Bento Grid */}
        <motion.div 
          {...fadeUpReveal(reducedMotion, 0.1)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border bg-background relative z-10"
        >
          {/* Cell 1: BUILD (Large Left Column) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-hidden isolate">
            {/* Architectural Grid and Asymmetrical Routing Lines */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
            
            <div className="absolute top-[25%] right-[15%] w-[45%] h-[60%] border-t border-r border-border/80 z-0 hidden sm:block" aria-hidden="true" />
            <div className="absolute bottom-0 left-[20%] w-[1px] h-[40%] bg-primary/40 z-0 hidden sm:block" aria-hidden="true" />
            
            {/* Engineering Marker */}
            <div className="absolute top-[25%] right-[15%] -translate-y-1/2 translate-x-1/2 bg-background px-2 z-0 hidden sm:block" aria-hidden="true">
              <span className="font-mono text-[8px] text-muted-foreground tracking-widest">FIG.1A</span>
            </div>
            
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-12 relative z-10">
              01 / Build
            </p>
            <div className="flex flex-col gap-2 mt-auto relative z-10">
              {buildItems.map((item, idx) => (
                <span 
                  key={idx} 
                  className="text-[clamp(1.75rem,3.5vw,3rem)] font-black uppercase tracking-tighter leading-none text-foreground hover:text-primary transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side Container */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Cell 2: TOOLS (Dark/Terminal) */}
            <div className="border-b border-border p-8 lg:p-12 xl:p-16 bg-zinc-900 dark:bg-zinc-800 text-white flex-auto flex flex-col relative overflow-hidden isolate">
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

              <span className="absolute bottom-9 left-4 md:left-6 font-mono text-[8px] text-primary tracking-[0.2em] hidden sm:block" aria-hidden="true">EL.02</span>

              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-8 relative z-10">
                02 / Tools
              </p>
              <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 font-mono text-sm lg:text-base tracking-tight mt-auto relative z-10">
                {toolsItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-primary dark:text-zinc-400 shrink-0" aria-hidden="true">{`>`}</span>
                    <span className="opacity-90 truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Cell 3: DEPLOY (Data-dense List) */}
            <div className="p-8 lg:p-12 xl:p-16 flex-auto flex flex-col bg-muted/10 relative overflow-hidden isolate">
              {/* Architectural layout lines */}
              <div className="absolute top-[40%] left-[-10%] w-[120%] h-[1px] bg-border pointer-events-none opacity-60" aria-hidden="true" />
              <div className="absolute top-[-10%] right-[25%] w-[1px] h-[120%] bg-border pointer-events-none opacity-60" aria-hidden="true" />
              
              {/* Target bracket (Asymmetrical bottom right corner) */}
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-foreground/30 pointer-events-none hidden sm:block" aria-hidden="true" />

              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-8 relative z-10 bg-background/80 px-2 -ml-2 inline-block w-fit backdrop-blur-sm">
                03 / Deploy
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 mt-auto relative z-10">
                {deployItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-primary transition-colors shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium tracking-tight uppercase text-foreground/80 group-hover:text-foreground transition-colors truncate">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
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
