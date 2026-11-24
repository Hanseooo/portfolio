"use client";

import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { HomepageSceneFrame } from "@/components/frames";
import StructuredReveal from "@/components/motion/StructuredReveal";
import SplitText from "@/components/motion/SplitText";
import { SECTION_IDS } from "@/lib/anchor-navigation";
import type { HomepageContactProjection } from "@/lib/content/homepage-projections";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import ContactDialog from "@/components/homepage/ContactDialog";

interface SceneContactProps {
  data: HomepageContactProjection;
}

const ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SceneContact({ data }: SceneContactProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <HomepageSceneFrame
      id={SECTION_IDS.contact}
      sceneNumber="06"
      heading="Contact"
      ownsHeading
      surface="foundation"
      className="relative py-16 md:py-24 lg:py-32 border-t border-[color:var(--cs-structural-line)] text-[color:var(--cs-text-primary)] overflow-hidden"
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
            <h2
              id={`${SECTION_IDS.contact}-heading`}
              className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-[color:var(--cs-text-primary)] perspective-1000"
            >
              <SplitText text={data.closeStatement as string} />
            </h2>
            {/* Status line: signal leader, live dot, availability */}
            <p className="mt-6 flex max-w-2xl items-start gap-3 font-[family-name:var(--font-mono)] text-xs uppercase leading-relaxed tracking-widest text-[color:var(--cs-text-secondary)] md:mt-8">
              <span aria-hidden="true" className="mt-[0.6rem] h-px w-8 shrink-0 bg-[color:var(--cs-signal)] md:w-12" />
              <span aria-hidden="true" className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-[color:var(--cs-status-online)]" />
              {/* Wrap only at the separators, never inside "Remote-friendly" */}
              <span>
                {data.availability.split(" · ").map((part, i, parts) => (
                  <Fragment key={part}>
                    {i > 0 && " "}
                    <span className="whitespace-nowrap">{i < parts.length - 1 ? `${part} ·` : part}</span>
                  </Fragment>
                ))}
              </span>
            </p>

            {/* One action, then the direct channels as quiet links */}
            <motion.div
              className="mt-10 flex w-full flex-col gap-6 sm:w-auto sm:flex-row sm:items-center sm:gap-10 md:mt-12"
              initial={reducedMotion ? false : "hidden"}
              animate={reducedMotion ? "visible" : undefined}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: { transition: reducedMotion ? { staggerChildren: 0, delayChildren: 0 } : { staggerChildren: 0.1, delayChildren: 0.5 } },
                hidden: {}
              }}
            >
              <motion.div variants={ITEM}>
                <ContactDialog />
              </motion.div>
              <motion.ul variants={ITEM} role="list" className="flex flex-wrap items-center gap-x-6 gap-y-1">
                {data.channels.map((channel) => (
                  <li key={channel.type}>
                    <a
                      href={channel.href}
                      target={channel.type !== "email" ? "_blank" : undefined}
                      rel={channel.type !== "email" ? "noopener noreferrer" : undefined}
                      className="group inline-flex min-h-11 items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] underline decoration-transparent underline-offset-[6px] transition-colors hover:text-[color:var(--cs-text-primary)] hover:decoration-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                    >
                      {channel.label}
                      {channel.type !== "email" && (
                        <ArrowUpRight size={12} aria-hidden="true" className="opacity-60 transition-opacity group-hover:opacity-100" />
                      )}
                    </a>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </StructuredReveal>
      </div>
    </HomepageSceneFrame>
  );
}
