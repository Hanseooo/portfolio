"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { clipReveal } from "@/lib/motion";
import ProjectCard from "@/components/cards/ProjectCard";

const FEATURED = projects.slice(0, 3);
const CARD_VW = 1; // 100vw per card — full viewport, no bleed-through

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturedProjectsSection({ id }: { id: string }) {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeIdxRef = useRef(0);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Viewport detection
  useEffect(() => {
    if (!isClient) return;
    let rafId = 0;
    const check = () => setIsDesktop(window.innerWidth >= 1240);
    check();
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isClient]);

  const useHorizontalMode = isDesktop && !reducedMotion;

  // GSAP horizontal scroll pin
  useEffect(() => {
    if (!isClient || !useHorizontalMode) return;
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const useSnap = window.innerHeight >= 860;

      gsap.to(trackRef.current, {
        x: () => -(FEATURED.length - 1) * window.innerWidth * CARD_VW,
        ease: "none",
        scrollTrigger: {
          id: "projects-horizontal",
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          start: "top top",
          end: () =>
            `+=${(FEATURED.length - 1) * window.innerWidth * CARD_VW}`,
          snap: useSnap
            ? {
                snapTo: 1 / (FEATURED.length - 1),
                duration: { min: 0.35, max: 0.65 },
                delay: 0.05,
                ease: "power2.inOut",
              }
            : undefined,
          onUpdate: (self) => {
            const newIdx = Math.round(
              self.progress * (FEATURED.length - 1)
            );
            if (activeIdxRef.current !== newIdx) {
              activeIdxRef.current = newIdx;
              setActiveCardIndex(newIdx);
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient, useHorizontalMode]);

  if (!isClient) {
    // SSR: render vertical layout to avoid hydration mismatch
    return (
      <section id={id} className="relative min-h-screen px-6 py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
              Projects
            </h2>
            <Link
              href="/projects"
              className="group flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <span>View All</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {FEATURED.map((project, idx) => (
              <ProjectCard key={project.title} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={
        useHorizontalMode
          ? "relative h-screen overflow-hidden"
          : "relative min-h-screen px-6 py-32"
      }
    >
      {/* Header — stays visible above track during horizontal pin */}
      <div
        className={`flex items-end justify-between border-b border-border ${
          useHorizontalMode
            ? "px-6 pt-20 pb-6"
            : "mx-auto w-full max-w-[1400px] mb-20 pb-8"
        }`}
      >
        <motion.h2
          {...clipReveal(reducedMotion)}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Projects
        </motion.h2>
        <Link
          href="/projects"
          className="group flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <span>All Projects</span>
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>

      {useHorizontalMode ? (
        /* Horizontal track */
        <div ref={trackRef} className="flex h-[calc(100%-5.5rem)]">
          {FEATURED.map((project, idx) => (
            <Link
              key={project.title}
              href={`/projects/${project.slug}`}
              className="group relative shrink-0 w-screen h-full flex"
              aria-hidden={activeCardIndex !== idx ? true : undefined}
              tabIndex={activeCardIndex !== idx ? -1 : 0}
            >
              {/* Left: full-height image */}
              <div className="relative w-[60%] h-full overflow-hidden shrink-0">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  sizes="60vw"
                  priority={idx === 0}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                {project.client && (
                  <span className="absolute top-4 left-4 border border-primary/30 dark:border-primary/60 bg-white/90 dark:bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm shadow-sm">
                    Client
                  </span>
                )}
              </div>

              {/* Right: metadata panel */}
              <div className="flex-1 h-full flex flex-col justify-center px-10 gap-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-primary">0{idx + 1}</span>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground">{project.year}</span>
                </div>
                <div className="h-px bg-border" />
                <h3 className="text-[clamp(2rem,3.5vw,4rem)] font-black tracking-tight leading-none text-foreground transition-colors group-hover:text-primary flex items-start gap-3">
                  {project.title}
                  <ArrowUpRight
                    size={24}
                    className="mt-1.5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {project.role}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-sm">
                  {project.subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="bg-foreground/5 border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/80 transition-colors group-hover:bg-foreground/10 group-hover:border-foreground/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="font-mono text-[9px] text-muted-foreground self-center">
                      +{project.stack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Vertical fallback — original Framer Motion grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto w-full max-w-[1400px] grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {FEATURED.map((project, idx) => (
            <motion.div variants={itemVariants} key={project.title}>
              <ProjectCard project={project} idx={idx} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
