"use client";

import { useLayoutEffect, useRef } from "react";
import { Github, ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { BBH_Bartle } from "next/font/google";
import { motion } from "framer-motion";
import { getRuntimeEnv } from "../utils/browserInfo";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL, PHONE_NUMBER } from "../utils/externalLinks";
import ContactDialogTrigger from "../dialogs/ContactDialogTrigger";


const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const isWebView = getRuntimeEnv().isWebView

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if(isWebView) return;

    const ctx = gsap.context(() => {

      // First name — slow
      gsap.to(firstNameRef.current, {
        yPercent: -90,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Last name — faster
      gsap.to(lastNameRef.current, {
        yPercent: -150,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.25 }}
        viewport={{ once: false, amount: 0.75 }}
        className="mt-4 text-sm uppercase tracking-[0.3em] opacity-80"
      >
        Full-Stack Web Developer
      </motion.p>

      {/* BUTTONS */}
      <div ref={buttonsRef} className="mt-10 flex items-center gap-6">
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
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-xs opacity-60">
        <span>Scroll</span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
}
