"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { clipReveal, fadeUpReveal } from "@/lib/motion";

export default function ExperienceSnapshotSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!timelineRef.current || !lineRef.current) return;

    // Resolve CSS variable to a concrete color GSAP can parse — hsl(var(--x)) fails GSAP's color parser
    const primaryColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()})`;

    const ctx = gsap.context(() => {
      // Animated line draws as user scrolls through the timeline section
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // Per-entry: dot activates then text slides in
      gsap.utils.toArray<HTMLElement>(".experience-entry").forEach((entry) => {
        const dot = entry.querySelector<HTMLElement>(".entry-dot");

        // Set initial hidden state only after animation guard has passed
        gsap.set(entry, { opacity: 0, x: -20 });
        if (dot) gsap.set(dot, { scale: 0.5 });

        const tl = gsap.timeline({ paused: true });
        if (dot) {
          tl.to(dot, {
            scale: 1,
            backgroundColor: primaryColor,
            duration: 0.3,
            ease: "back.out(1.4)",
          });
        }
        tl.to(
          entry,
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );

        ScrollTrigger.create({
          trigger: entry,
          start: "top 65%",
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id={id} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
          <motion.h2
            {...clipReveal(reducedMotion)}
            className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
          >
            Experience
          </motion.h2>
          <motion.div {...fadeUpReveal(reducedMotion, 0.15)}>
            <Link
              href="/experience"
              className="group flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <span>View All</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Timeline wrapper — single animated line replaces per-entry border-l */}
        <div
          ref={timelineRef}
          className="relative flex flex-col gap-12 lg:w-2/3 lg:gap-24"
        >
          {/* Animated line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 w-px h-full bg-border"
            style={{ transformOrigin: "top" }}
          />

          {/* Entry 1 */}
          <div className="experience-entry group relative pl-8">
            <span className="entry-dot absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border" />
            <h3 className="text-2xl font-bold text-foreground mb-2 transition-colors group-hover:text-primary">
              AI Solutions Development Intern
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-primary mb-6">
              Eskwelabs // 2026
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Designed and built an internal full-stack Recruitment Automation
              System. Reduced manual workload by 80%, turning day-long
              operations into workflows completed in minutes.
            </p>
          </div>

          {/* Entry 2 */}
          <div className="experience-entry group relative pl-8">
            <span className="entry-dot absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border" />
            <h3 className="text-2xl font-bold text-foreground mb-2 transition-colors group-hover:text-primary">
              Full-Stack Web Developer
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground/80 mb-6">
              Freelance
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Built a custom ordering form for a cookie seller with a dynamic form builder, analytics, ocr for extracting reference numbers from receipts, and CRM. The client was able to process orders 75% faster compared to using google forms where visuals were limited and inneficient workflows for order management and verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
