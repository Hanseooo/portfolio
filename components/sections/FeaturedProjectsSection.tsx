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

const FEATURED = projects.slice(0, 3);
const CARD_VW = 0.85; // 85vw per card

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
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          start: "top top",
          end: () =>
            `+=${(FEATURED.length - 1) * window.innerWidth * CARD_VW}`,
          snap: useSnap
            ? {
                snapTo: 1 / (FEATURED.length - 1),
                duration: { min: 0.18, max: 0.42 },
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
              className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <span>View All</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {FEATURED.map((project, idx) => (
              <VerticalCard key={project.title} project={project} idx={idx} />
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Projects
        </motion.h2>
        <Link
          href="/projects"
          className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <span>View All</span>
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
              className="group relative flex-shrink-0 w-[85vw] h-full block"
              aria-hidden={activeCardIndex !== idx ? true : undefined}
              tabIndex={activeCardIndex !== idx ? -1 : 0}
            >
              <div className="relative h-[65%] overflow-hidden">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                {project.client && (
                  <span className="absolute top-4 left-4 border border-primary/60 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                    Client
                  </span>
                )}
              </div>
              <div className="h-[35%] flex flex-col justify-center px-8 gap-3">
                <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span className="font-mono mr-2">
                    0{idx + 1} {"//"}
                  </span>{" "}
                  {project.subtitle.substring(0, 40)}
                  {project.subtitle.length > 40 ? "..." : ""}
                </span>
                <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </h3>
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
              <VerticalCard project={project} idx={idx} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function VerticalCard({
  project,
  idx,
}: {
  project: (typeof FEATURED)[number];
  idx: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden relative">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
        {project.client && (
          <span className="absolute top-3 left-3 border border-primary/60 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
            Client
          </span>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          <span className="font-mono mr-2">0{idx + 1} {"//"}</span>{" "}
          {project.subtitle.substring(0, 40)}
          {project.subtitle.length > 40 ? "..." : ""}
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
