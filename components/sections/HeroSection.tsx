"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionTokens } from "@/lib/motion";
import ConnectModal from "@/components/dialogs/ConnectModal";

const EASE = motionTokens.framerEase.enter;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.feature, ease: EASE, delay },
  }),
};

const bloom = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

export default function HeroSection({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = isClient ? getRuntimeEnv().isMobile : false;
  const [entered, setEntered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);

  // Fire entry after overlay/preloader clears:
  // first visit = 2600ms (preloader exits at ~2800ms, slight overlap feels smooth)
  // return visit / navigation = 1000ms (PageOverlay holds 950ms then exits)
  useEffect(() => {
    if (!isClient) return;
    let delay = 0;
    if (!reducedMotion) {
      const isFirstVisit = !sessionStorage.getItem("hasVisited");
      sessionStorage.setItem("hasVisited", "1");
      delay = isFirstVisit ? 2000 : 1750;
    }
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [isClient, reducedMotion]);

  // Portrait parallax on desktop only (GSAP scroll trigger)
  useEffect(() => {
    if (!isClient || isMobile) return;
    const ctx = gsap.context(() => {
      if (sectionRef.current && portraitColRef.current && window.innerWidth >= 1024) {
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
    return () => ctx.revert();
  }, [isClient, isMobile]);

  // Reduced motion: bypass variants, stay in final state
  const textInitial = reducedMotion ? { opacity: 1, y: 0 } : "hidden";
  const textAnimate = reducedMotion ? { opacity: 1, y: 0 } : (entered ? "visible" : "hidden");
  const portraitInitial = reducedMotion ? { opacity: 1, scale: 1 } : "hidden";
  const portraitAnimate = reducedMotion ? { opacity: 1, scale: 1 } : (entered ? "visible" : "hidden");

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-350 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <motion.p
            variants={fadeUp}
            initial={textInitial}
            animate={textAnimate}
            custom={0}
            className="mb-6 font-bold text-xs uppercase tracking-[0.2em] text-primary"
          >
            Hans Amoguis
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial={textInitial}
            animate={textAnimate}
            custom={0.12}
            aria-label="Building With Intent."
            className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
          >
            Building
            <br />
            <span className="text-muted-foreground">With Intent.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={textInitial}
            animate={textAnimate}
            custom={0.24}
            className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            I build maintainable systems with proper architecture, modular
            implementation, and good user experience. A Full-stack architect
            &amp; AI product engineer focused on providing solutions that are not
            only functional but also intuitive and scalable.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial={textInitial}
            animate={textAnimate}
            custom={0.36}
          >
            <ConnectModal>
              <button className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-sm uppercase tracking-widest text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Let&apos;s Connect
              </button>
            </ConnectModal>
          </motion.div>
        </div>

        {/* Outer motion.div handles entry (scale + opacity); inner div is GSAP parallax target */}
        <motion.div
          variants={bloom}
          initial={portraitInitial}
          animate={portraitAnimate}
          custom={0.08}
          className="lg:col-span-5 w-full mt-12 lg:mt-0"
        >
          <div
            ref={portraitColRef}
            className="group relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden"
          >
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
        </motion.div>
      </div>
    </section>
  );
}
