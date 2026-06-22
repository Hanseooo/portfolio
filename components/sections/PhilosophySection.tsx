"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function PhilosophySection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

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

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center px-6 py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter text-foreground">
              Design Systems, <br />
              <span className="text-primary">Then Ship Them.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-center space-y-12 lg:col-span-6 lg:col-start-7">
            <div ref={principle01Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">01 /</span>Architecture
              </h3>
              <p className="text-xl text-muted-foreground">
                I design the system before I write the code. Clear structure upfront means less firefighting later.
              </p>
            </div>

            <div
              ref={dividerRef}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
            />

            <div ref={principle02Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">02 /</span>Execution
              </h3>
              <p className="text-xl text-muted-foreground">
                I build interfaces that work on any device, backed by APIs that hold up under real usage.
              </p>
            </div>

            <div
              ref={divider02Ref}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
            />

            <div ref={principle03Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">03 /</span>Intelligence
              </h3>
              <p className="text-xl text-muted-foreground">
                I treat AI as a system concern. Quota management, usage windows, and evaluation logic are designed in from the start, not added when things break.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
