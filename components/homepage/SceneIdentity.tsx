"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HomepageSceneFrame } from "@/components/frames";
import StructuredReveal from "@/components/motion/StructuredReveal";
import HeroDepthEffect from "@/components/motion/HeroDepthEffect";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import { DESTINATIONS, getDestinationHref } from "@/lib/destinations";
import type { HomepageIdentityProjection } from "@/lib/content/homepage-projections";
import { motion, type Variants } from "framer-motion";

const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

interface SceneIdentityProps {
  data: HomepageIdentityProjection;
}

export default function SceneIdentity({ data }: SceneIdentityProps) {
  const contactDest = DESTINATIONS["scene-contact"];
  const flagshipsDest = DESTINATIONS["scene-flagships"];

  return (
    <HomepageSceneFrame
      id={SECTION_IDS.identity}
      sceneNumber="01"
      heading="Identity"
      surface="foundation"
      isHero
      className="relative min-h-[max(680px,90vh)] overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12 lg:pb-32 lg:pt-16 border-b border-[color:var(--cs-structural-line)]"
    >
      {/* Shadcn-style Grid Background (Subtle, masked) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.07]"
        aria-hidden="true"
        data-parallax-speed="0.45"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '128px 128px',
          maskImage: 'radial-gradient(circle at 50% 30%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 30%, transparent 80%)'
        }}
      />

      {/* Signal Ribbon backdrop field (gray in dark mode as requested by user) */}
      <div className="absolute top-0 right-0 w-full md:w-[45%] h-full bg-[color:var(--cs-signal)] dark:bg-zinc-800/80 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Architectural Cross Intersection (Top Right) */}
        <div className="absolute top-[15%] right-[-10%] w-[150%] h-[1px] bg-white/20 hidden md:block" />
        <div className="absolute top-[-10%] right-[15%] w-[1px] h-[150%] bg-white/20 hidden md:block" />
        <div className="absolute top-[15%] right-[15%] w-12 h-12 border border-white/30 rounded-full -translate-y-1/2 translate-x-1/2 hidden md:block" />
      </div>

      {/* ARTS & CHAOS 12-COLUMN LAYOUT */}
      <div className="hp-grid relative z-10 min-h-[60vh] isolate">
        
        {/* Eyebrow / Chapter Mark */}
        <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-1 lg:row-start-1 pt-4 lg:pt-8">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--cs-signal-text)] dark:text-zinc-400">
            01 / Identity<br className="hidden lg:block" />
            <span className="hidden lg:inline"> Architecture</span>
          </p>
        </div>

        {/* Massive Title */}
        <div className="col-span-4 md:col-span-8 lg:col-span-11 lg:col-start-2 lg:row-start-2 mt-8 lg:mt-4 z-20">
          <h1
            id={`${SECTION_IDS.identity}-heading`}
            className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,13vw,13rem)] font-black uppercase leading-[0.72] tracking-[-0.105em] text-[color:var(--cs-text-primary)]"
            data-motion-target="hero-name"
          >
            <span
              className="block text-[color:var(--cs-text-primary)]"
              data-parallax-speed="1"
            >
              Hans
            </span>
            <span
              className="block text-[color:var(--cs-text-primary)] lg:ml-[7%]"
              data-parallax-speed="0.55"
            >
              Amoguis
            </span>
          </h1>
        </div>

        {/* Brief / Introduction */}
        <div className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-2 lg:row-start-3 self-end mt-12 lg:mt-16 z-30 lg:mb-12">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-white md:text-[color:var(--cs-text-primary)] font-bold">
            {data.roleStatement}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/90 md:text-[color:var(--cs-text-secondary)]">
            {data.introduction}
          </p>
        </div>

        {/* The Blueprint Portrait Slot */}
        <div 
          className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-8 lg:row-start-2 lg:row-end-4 self-end mt-16 lg:mt-0 lg:-mb-16 relative z-10 mx-auto w-full max-w-sm lg:max-w-none"
          data-motion-target="hero-portrait"
          data-parallax-speed="-0.6"
        >
          {/* Geometric lines and orbs matching the editorial prototype */}
          <div
            className="absolute -inset-16 pointer-events-none z-0 hidden lg:block"
            aria-hidden="true"
            data-parallax-speed="-1.1"
          >
            {/* Geometric Outlines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square rounded-full border border-[color:var(--cs-structural-line)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square border border-[color:var(--cs-structural-line-strong)]" style={{ borderRadius: '48% 48% 12% 12%' }} />
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full border border-dashed border-[color:var(--cs-structural-line-strong)] opacity-50" />
            <div className="absolute top-[60%] left-[20%] w-[30%] aspect-square border border-[color:var(--cs-structural-line-strong)] opacity-30 rotate-12" />

            {/* Dark orb (gray in dark mode) */}
            <div className="absolute top-[10%] left-[37%] w-[33%] aspect-square rounded-full bg-[color:var(--cs-signal)] dark:bg-zinc-700 blur-2xl opacity-60" />
          </div>

          {/* Cyber-Brutalist Solid Offset (High Contrast - Locked to Light Mode) */}
          <div 
            className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 bg-zinc-900 z-0 pointer-events-none" 
            aria-hidden="true"
          />

          <div className="relative z-10 border-4 md:border-[8px] border-[#F3F0E9] bg-[color:var(--cs-reading-surface)] overflow-hidden shadow-2xl h-[404px]">
            {/* Oversized so the image can drift inside the fixed frame without exposing an edge */}
            <div className="absolute inset-x-0 -top-[18%] h-[140%]" data-parallax-speed="-0.4">
              <Image
                src={data.portrait}
                alt="Hans Amoguis — Full-stack engineer"
                priority
                className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 35vw, 400px"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-4 md:col-span-8 lg:col-span-3 lg:col-start-2 lg:row-start-4 flex flex-col sm:flex-row lg:flex-col gap-3 mt-12 lg:mt-0 z-30 lg:self-end">
          <a
            href={getDestinationHref(flagshipsDest)}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-between border-2 border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-foundation)] transition-transform hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          >
            See selected work
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            href={getDestinationHref(contactDest)}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-between border border-[color:var(--cs-text-primary)] bg-transparent px-5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:bg-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-foundation)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          >
            Start a conversation
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

      </div>

      {/* Structured Telemetry Strip — The Credibility Strip from prototype */}
      <div className="hp-grid relative z-10 mt-20 lg:mt-32 border-t border-[color:var(--cs-structural-line)] bg-zinc-900">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <StructuredReveal recipe="hero-proof" revealId="hero-proof">
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[color:var(--cs-structural-line)]">
              {data.immediateProof.map((proof, idx) => (
                <motion.div 
                  key={idx} 
                  variants={staggerItem}
                  className={`flex flex-col justify-start p-4 md:p-5 lg:p-6 min-h-[104px] border-zinc-800 ${
                    idx === 0 ? 'border-b md:border-b-0 md:border-r' : ''
                  }`}
                >
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
                    {proof.attribution}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                    {proof.value}
                  </span>
                  <span className="mt-2 text-xs text-zinc-400">
                    {proof.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </StructuredReveal>
        </div>
      </div>

      {/* Parallax layers opt in above via data-parallax-speed (x18px, nested values are relative to their parent layer). */}
      <HeroDepthEffect containerId={SECTION_IDS.identity} />
    </HomepageSceneFrame>
  );
}

