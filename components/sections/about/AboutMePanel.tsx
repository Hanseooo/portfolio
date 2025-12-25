"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function AboutMePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const secondParaRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
        },
      });

      tl.from(photoRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.from(
        textRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );

      tl.from(
        secondParaRef.current,
        {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="about-panel flex flex-col md:flex-row h-screen w-screen items-center px-6 md:px-12 gap-12"
    >
      {/* LEFT — PHOTO */}
      <div
        ref={photoRef}
        className="relative w-full max-w-xs md:max-w-[280px] flex-shrink-0 mx-auto"
      >
        <Image
          src="/me.jpg"
          alt="Hanseo portrait"
          width={280}
          height={360}
          className="object-cover rounded-2xl w-full"
          priority
        />
        <div className="absolute bottom-0 w-full bg-background/80 px-4 py-2 text-center backdrop-blur">
          <span className="text-sm font-semibold tracking-wide">Hanseo</span>
        </div>
      </div>

      {/* RIGHT — TEXT */}
      <div
        ref={textRef}
        className="flex flex-col justify-center text-center md:text-left max-w-xl mx-auto"
      >
        <span className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60">
          About Me
        </span>

        <p className="text-lg md:text-xl leading-relaxed opacity-85">
          I’m a full-stack developer who builds thoughtful, animation-driven web
          experiences with a strong focus on structure, performance, and visual
          clarity.
        </p>

        <p
          ref={secondParaRef}
          className="mt-4 md:mt-6 text-lg md:text-xl leading-relaxed opacity-85"
        >
          I enjoy blending engineering discipline with bold design systems and
          motion to create interfaces that feel intentional, expressive, and
          memorable.
        </p>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-center md:justify-start gap-4 flex-wrap">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
          >
            <Linkedin size={16} /> LinkedIn
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
          >
            <Github size={16} /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
