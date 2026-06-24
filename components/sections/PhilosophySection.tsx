"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { motionTokens, clipReveal } from "@/lib/motion";

export default function PhilosophySection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const isClient = useClientReady();
  const runtimeEnv = isClient ? getRuntimeEnv() : { isMobile: false, isWebView: false };
  const isMobile = runtimeEnv.isMobile;

  const sectionRef = useRef<HTMLElement>(null);
  const principle01Ref = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const principle02Ref = useRef<HTMLDivElement>(null);
  const divider02Ref = useRef<HTMLDivElement>(null);
  const principle03Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return;
    if (
      !sectionRef.current ||
      !principle01Ref.current ||
      !dividerRef.current ||
      !principle02Ref.current ||
      !divider02Ref.current ||
      !principle03Ref.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=450vh",
          scrub: true,
        },
      });

      tl.fromTo(
        principle01Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0
      );
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.2 },
        0.35
      );
      tl.fromTo(
        principle02Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.55
      );
      tl.fromTo(
        divider02Ref.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.2 },
        0.75
      );
      tl.fromTo(
        principle03Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.90
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mobile FM entry props — only applied when isMobile and not reducedMotion
  const mobileEntry = (delayIndex: number) =>
    isMobile && !reducedMotion
      ? {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: {
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
            delay: delayIndex * 0.12,
          },
        }
      : {};

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center px-6 py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.h2
              {...clipReveal(reducedMotion)}
              className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter text-foreground"
            >
              Design Systems, <br />
              <span className="text-primary">Then Ship Them.</span>
            </motion.h2>
          </div>

          <div className="flex flex-col justify-center space-y-12 lg:col-span-6 lg:col-start-7">
            <motion.div ref={principle01Ref} {...mobileEntry(0)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">01 /</span>Architecture
              </h3>
              <p className="text-xl text-muted-foreground">
                I design the system by creating PRDs, ADRs, and specs before I write the code. Clear structure upfront means less problems later.
              </p>
            </motion.div>

            <motion.div
              ref={dividerRef}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
              {...mobileEntry(1)}
            />

            <motion.div ref={principle02Ref} {...mobileEntry(2)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">02 /</span>Execution
              </h3>
              <p className="text-xl text-muted-foreground">
                I make the most of my resources, combining with efficient workflows, and using AI as a multiplier to ship high-quality work faster. I focus on the right things, not just doing things right.
              </p>
            </motion.div>

            <motion.div
              ref={divider02Ref}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
              {...mobileEntry(3)}
            />

            <motion.div ref={principle03Ref} {...mobileEntry(4)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">03 /</span>Workflows
              </h3>
              <p className="text-xl text-muted-foreground">
                Identifying problems, designing solutions, and shipping them to production is my favorite part. I love seeing my work in the hands of real users.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
