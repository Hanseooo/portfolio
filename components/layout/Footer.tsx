"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Github, Linkedin, Mail } from "lucide-react";
import { BBH_Bartle } from "next/font/google";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        yPercent: -45,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Divider counter-motion (subtle)
      gsap.to(dividerRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-foreground/10 bg-background px-6 py-32"
    >
      <div className="mx-auto max-w-6xl space-y-20">
        {/* CTA */}
        <h2
          ref={titleRef}
          className={`
            ${bbhBartle.className}
            text-primary font-black leading-[0.95] mb-[-10] tracking-tight
            text-[clamp(2.5rem,7vw,5rem)]
          `}
        >
          Let’s
          <br />
          Connect
        </h2>

        {/* RED DIVIDER */}
        <div ref={dividerRef} className="h-px w-full bg-primary opacity-80" />

        {/* LINKS */}
        <div className="flex flex-wrap items-center gap-10 text-sm uppercase tracking-widest">
          <a
            href="mailto:amoguishans@gmail.com"
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Mail size={14} />
            Email
          </a>

          <a
            href="https://www.linkedin.com/in/hanseooo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>

          <a
            href="https://github.com/Hanseooo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-primary hover:text-primary"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>

        {/* META */}
        <div className="flex flex-col gap-1 text-xs opacity-60">
          <span>© {new Date().getFullYear()} Hanseo</span>
          <span>Designed & built with intent</span>
        </div>
      </div>
    </footer>
  );
}
