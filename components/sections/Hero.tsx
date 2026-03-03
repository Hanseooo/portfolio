"use client";

import { useLayoutEffect, useRef } from "react";
import { Github, ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { BBH_Bartle } from "next/font/google";
import { motion } from "framer-motion";
import { getRuntimeEnv } from "../utils/browserInfo";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL, PHONE_NUMBER } from "../utils/externalLinks";
import ContactDialogTrigger from "../dialogs/ContactDialogTrigger";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import {
  getEnterY,
  getEnterYTransition,
  getMotionDistance,
  getMotionMode,
  motionTokens,
} from "@/lib/motion";
import { useClientReady } from "@/components/utils/useClientReady";


const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});


export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const isClient = useClientReady();
  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const isWebView = runtimeEnv.isWebView;
  const isMobile = runtimeEnv.isMobile;
  const reducedMotion = usePrefersReducedMotion();
  const motionMode = getMotionMode({ reducedMotion, isMobile });
  const subtleEnter = getEnterY("subtle", motionMode);
  const accentEnter = getEnterY("accent", motionMode);
  const enterTransition = getEnterYTransition(motionMode);
  const parallaxDistance = getMotionDistance("parallax", motionMode);


  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (isWebView || reducedMotion || parallaxDistance === 0) return;

    const ctx = gsap.context(() => {
      const start = "top top";
      const end = "bottom top";

      // First name — slow
      gsap.to(firstNameRef.current, {
        yPercent: -90,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      // Last name — faster
      gsap.to(lastNameRef.current, {
        yPercent: -150,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(roleRef.current, {
        y: -parallaxDistance * 0.4,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(buttonsRef.current, {
        y: -parallaxDistance * 0.75,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(scrollHintRef.current, {
        y: -parallaxDistance,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isWebView, reducedMotion, parallaxDistance]);

  return (
    <motion.section
      id="home"
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reducedMotion ? motionTokens.duration.fast : motionTokens.duration.base,
        ease: motionTokens.framerEase.enter,
        delay: reducedMotion ? 0 : 1.5,
      }}
      className={`relative will-change-transform flex min-h-screen flex-col items-center justify-center overflow-hidden text-center ${bbhBartle.className}`}
    >
      {/* NAME */}
      <h1 className="leading-[0.9] will-change-transform tracking-tight text-[clamp(2.75rem,10vw,9rem)] text-primary">
        <span ref={firstNameRef} className="block">
          Hans 
        </span>
        <span ref={lastNameRef} className="block z-5">
          Amoguis
        </span>
      </h1>

      {/* ROLE */}
      <motion.p
        ref={roleRef}
        initial={subtleEnter}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...enterTransition, delay: 0.12 }}
        className="mt-4 text-sm uppercase tracking-[0.3em] opacity-80"
      >
        Full-Stack Web Developer
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        ref={buttonsRef}
        initial={accentEnter}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...enterTransition, delay: 0.2 }}
        className="mt-10 flex items-center gap-6"
      >
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-foreground/30 px-5 py-3 text-sm transition hover:border-primary hover:text-primary"
        >
          <Github size={16} />
          GitHub
        </a>

        <ContactDialogTrigger email={EMAIL_ADDRESS} linkedinUrl={LINKEDIN_URL} phone={PHONE_NUMBER} />
      </motion.div>

      {/* SCROLL INDICATOR */}
      {!isWebView && (
        <motion.div
          ref={scrollHintRef}
          initial={subtleEnter}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ ...enterTransition, delay: 0.3 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-xs"
        >
          <span>Scroll</span>
          <ArrowDown size={16} />
        </motion.div>
      )}
    </motion.section>
  );
}
