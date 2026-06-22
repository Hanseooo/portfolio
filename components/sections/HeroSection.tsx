"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type SplitTextInstance = InstanceType<typeof SplitText>;

export default function HeroSection({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;

    if (reducedMotion) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      if (paragraphRef.current) gsap.set(paragraphRef.current, { opacity: 1 });
      return;
    }

    let animSplit: SplitTextInstance | null = null;
    let rafId = 0;

    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        if (!headingRef.current || !paragraphRef.current) return;

        const isFirstVisit = !sessionStorage.getItem("hasVisited");
        const delay = isFirstVisit ? 3.5 : 0.2;

        animSplit = new SplitText(headingRef.current, { type: "chars" });

        const tl = gsap.timeline({ delay });
        tl.from(animSplit.chars, {
          y: 60,
          opacity: 0,
          rotationX: -90,
          stagger: 0.025,
          duration: 0.6,
          ease: "back.out(1.4)",
          onComplete: () => {
            animSplit?.revert();
            animSplit = null;
          },
        });
        tl.from(
          paragraphRef.current,
          { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
          "-=0.2"
        );

        // Parallax: portrait column moves up at 40% scroll speed
        if (sectionRef.current && portraitColRef.current) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              gsap.set(portraitColRef.current, { y: -80 * self.progress });
            },
          });
        }
      });
    });

    // Debounced resize: if split still active during resize, revert + restore visible state
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (animSplit) {
          animSplit.revert();
          animSplit = null;
        }
        if (headingRef.current) gsap.set(headingRef.current, { clearProps: "all" });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isClient, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <p className="mb-6 font-bold text-xs uppercase tracking-[0.2em] text-primary">
            Hans Amoguis
          </p>
          <h1
            ref={headingRef}
            aria-label="Building With Intent."
            className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
          >
            Building
            <br />
            <span className="text-muted-foreground">With Intent.</span>
          </h1>
          <p
            ref={paragraphRef}
            className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            I build maintainable systems with proper architecture, modular
            implementation, and good user experience. A Full-stack architect
            &amp; AI product engineer focused on providing solutions that are not
            only functional but also intuitive and scalable.
          </p>
        </div>

        <div ref={portraitColRef} className="lg:col-span-5 w-full mt-12 lg:mt-0">
          <div className="group relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden">
            <Image
              src={currentImage}
              alt="Hanseo portrait"
              className="block w-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 w-full bg-background/80 px-4 py-3 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                Hanseo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
