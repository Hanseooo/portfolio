"use client";

import { useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  getEnterY,
  getMotionDistance,
  getMotionMode,
  motionTokens,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { useClientReady } from "@/components/utils/useClientReady";

export default function Projects() {
  const [active, setActive] = useState(projects[0]);
  const previewRef = useRef<HTMLDivElement>(null);
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const motionMode = getMotionMode({
    reducedMotion,
    isMobile: runtimeEnv.isMobile,
  });
  const subtleEnter = getEnterY("subtle", motionMode);
  const accentEnter = getEnterY("accent", motionMode);
  const parallaxDistance = getMotionDistance("parallax", motionMode);

  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end start"],
  });
  const previewImageY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxDistance, -parallaxDistance]
  );
  const previewOverlayY = useTransform(
    scrollYProgress,
    [0, 1],
    [-parallaxDistance * 0.35, parallaxDistance * 0.35]
  );

  return (
    <section id="projects" className="relative min-h-screen  px-6 py-32">
      {/* Heading */}
      <motion.div
        initial={accentEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <h2 className="font-black leading-none text-primary">
          <span className="mb-3 block text-xs uppercase tracking-[0.26em] text-primary/80">
            Selected Work
          </span>
          <span className="text-[clamp(2.2rem,8vw,5rem)]">Projects</span>
        </h2>
        <p className="mt-5 text-sm leading-relaxed opacity-75 sm:text-base">
          Real projects focused on architecture clarity, interaction quality, and production-minded implementation.
        </p>
      </motion.div>

      <motion.div
        initial={subtleEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
          delay: motionTokens.stagger.text,
        }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[420px_1fr]"
      >
        {/* LEFT — PROJECT LIST */}
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(project)}
              onFocus={() => setActive(project)}
              className="
                group block
                border border-foreground/20
                px-6 py-5
                transition-colors
                hover:border-primary
                focus-visible:border-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                shadow-primary-sharp
                bg-background/50
              "
            >
              <Image
                className="border-secondary border-2 mb-4  lg:hidden"
                src={project.heroImage}
                alt={`${project.title} image`}
              />
              <h3 className="text-xl font-semibold group-hover:text-primary">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-72">
                {project.subtitle}
              </p>
            </Link>
          ))}
        </div>

        {/* RIGHT — PREVIEW (desktop only) */}
        <div ref={previewRef} className="relative hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: motionTokens.duration.base,
                ease: motionTokens.framerEase.enter,
              }}
              className="
                relative
                aspect-video
                w-full
                overflow-hidden
                shadow-2xl shadow-muted-foreground/75
                dark:shadow-muted-foreground/20 shadow-primary-sharp
                border-primary border
              "
            >
              <motion.div style={{ y: previewImageY }} className="absolute inset-0">
                <Image
                  src={active.heroImage}
                  alt={active.title}
                  fill
                  sizes="(min-width: 1280px) 55vw, 100vw"
                  className="object-cover"
                />
              </motion.div>

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/38 to-black/12" />
              <motion.div
                style={{ y: previewOverlayY }}
                className="absolute inset-x-6 bottom-6 border border-white/24 bg-black/48 p-5 backdrop-blur-md"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary/90">
                  Featured Preview
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {active.title}
                </h4>
                <p className="mt-3 line-clamp-2 border-l-2 border-primary/70 pl-3 text-sm leading-relaxed text-white/84">
                  {active.subtitle}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
