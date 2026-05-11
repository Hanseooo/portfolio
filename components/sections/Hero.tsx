"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Github, ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "../utils/browserInfo";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getEnterY, getEnterYTransition, getMotionDistance, getMotionMode, motionTokens } from "@/lib/motion";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL, PHONE_NUMBER } from "@/components/utils/externalLinks";
import ContactDialogTrigger from "@/components/dialogs/ContactDialogTrigger";

const bbhBartle = Playfair_Display({
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
  const [isShortViewport, setIsShortViewport] = useState(false);
  const motionMode = getMotionMode({ reducedMotion, isMobile });
  const subtleEnter = getEnterY("subtle", motionMode);
  const accentEnter = getEnterY("accent", motionMode);
  const enterTransition = getEnterYTransition(motionMode);
  const parallaxDistance = getMotionDistance("parallax", motionMode);
  const effectiveParallaxDistance =
    isMobile && isShortViewport ? parallaxDistance * 0.45 : parallaxDistance;

  useEffect(() => {
    if (!isClient) return;

    let resizeFrame = 0;
    const updateViewportHeight = () => {
      setIsShortViewport(window.innerHeight < 760);
    };

    updateViewportHeight();

    const onResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(updateViewportHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [isClient]);


  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (isWebView || reducedMotion || effectiveParallaxDistance === 0) return;

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
        y: -effectiveParallaxDistance * 0.4,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(buttonsRef.current, {
        y: -effectiveParallaxDistance * 0.75,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(scrollHintRef.current, {
        y: -effectiveParallaxDistance,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isWebView, reducedMotion, effectiveParallaxDistance]);

  const showScrollHint = !isWebView && !isShortViewport && !isMobile;

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
      className={`relative flex flex-col items-center justify-center overflow-hidden text-center will-change-transform ${
        isMobile
          ? isShortViewport
            ? "min-h-[74svh] px-4 pb-8 pt-20 sm:min-h-[80svh] sm:px-6 sm:pt-24"
            : "min-h-[78svh] px-4 pb-10 pt-24 sm:min-h-[84svh] sm:px-6 sm:pt-28"
          : "min-h-screen"
      } ${bbhBartle.className}`}
    >
      {/* NAME */}
      <h1
        className={`tracking-tight text-primary will-change-transform ${
          isMobile
            ? "leading-[0.95] text-[clamp(2rem,11.5vw,3.7rem)]"
            : "leading-[0.9] text-[clamp(2.75rem,10vw,9rem)]"
        }`}
      >
        <span ref={firstNameRef} className="block">
          Hans 
        </span>
        <span ref={lastNameRef} className="block z-5">
          Amoguis
        </span>
      </h1>

      <div
        className={
          isMobile
            ? `${isShortViewport ? "mt-4" : "mt-6"} w-full max-w-md rounded-xl border border-foreground/20 bg-background/90 px-4 py-5 shadow-primary-sharp`
            : ""
        }
      >
        {/* ROLE */}
        <motion.p
          ref={roleRef}
          initial={subtleEnter}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...enterTransition, delay: 0.12 }}
          className={`uppercase ${
            isMobile
              ? "text-xs tracking-[0.24em] text-foreground/82"
              : "text-xs tracking-[0.34em] text-foreground/75"
          }`}
        >
          Full-Stack Engineer
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          ref={buttonsRef}
          initial={accentEnter}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...enterTransition, delay: 0.2 }}
          className={
            isMobile
              ? `${isShortViewport ? "mt-4" : "mt-5"} grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2`
              : "mt-7 flex items-center justify-center gap-4"
          }
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex min-h-11 items-center justify-center gap-2 border px-5 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isMobile
                ? "w-full rounded-md border-foreground/20 bg-background/70 font-sans hover:border-primary hover:text-primary"
                : "rounded-none border-foreground/30 bg-background/65 font-sans uppercase tracking-[0.14em] hover:border-primary hover:text-primary"
            }`}
          >
            <Github size={16} />
            GitHub
          </a>

          <ContactDialogTrigger
            email={EMAIL_ADDRESS}
            linkedinUrl={LINKEDIN_URL}
            phone={PHONE_NUMBER}
            className={
              isMobile
                ? "w-full justify-center border-foreground/20 bg-background/70 text-primary"
                : "rounded-none border-foreground/30 bg-background/65 font-sans uppercase tracking-[0.14em]"
            }
          />
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      {showScrollHint && (
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
