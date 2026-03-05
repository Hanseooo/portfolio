"use client";

import { useRef, useState } from "react";
import { certificates } from "@/lib/certificates";
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
import { sectionListCardClassName } from "@/components/sections/cardStyles";

export default function Certificates() {
  const [active, setActive] = useState(certificates[0]);
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
    [parallaxDistance * 0.8, -parallaxDistance * 0.8]
  );
  const previewOverlayY = useTransform(
    scrollYProgress,
    [0, 1],
    [-parallaxDistance * 0.25, parallaxDistance * 0.25]
  );

  return (
    <section id="certificates" className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={accentEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <h2 className="font-black text-primary">
          <span className="mb-3 block text-xs uppercase tracking-[0.26em] text-primary/80">
            Credentials
          </span>
          <span className="text-[clamp(2rem,7vw,4rem)]">Certificates</span>
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
          Verified training and industry learning milestones that support practical engineering decisions.
        </p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
        {/* LEFT COLUMN — LIST */}
        <motion.div
          initial={subtleEnter}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
          }}
          className="space-y-4"
        >
          {certificates.map((cert) => (
            <Link
              key={cert.slug}
              href={`/certificates/${cert.slug}`}
              onMouseEnter={() => setActive(cert)}
              onFocus={() => setActive(cert)}
              className={`${sectionListCardClassName} lg:rounded-none lg:bg-background/50 lg:px-5 lg:py-4`}
            >
              <Image
                className="mb-4 w-full border-2 border-secondary md:hidden"
                src={cert.image}
                alt={`${cert.title} preview`}
                sizes="(max-width: 767px) 100vw, 0px"
              />
              <h3 className="font-semibold group-hover:text-primary">
                {cert.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/80">
                {cert.issuer} · {cert.date}
              </p>
            </Link>
          ))}
        </motion.div>

        {/* RIGHT COLUMN — PREVIEW (hidden on mobile) */}
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
                aspect-4/3
                w-full
                overflow-hidden
                bg-background/75 dark:bg-background/50
                shadow-primary-sharp
                border-primary border
              "
            >
              <motion.div style={{ y: previewImageY }} className="absolute inset-0">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain p-6"
                  sizes="600px"
                />
              </motion.div>

              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
              <motion.div
                style={{ y: previewOverlayY }}
                className="absolute inset-x-5 bottom-5 border border-white/22 bg-black/45 p-4 backdrop-blur-md"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-primary/90">
                  Credential Preview
                </p>
                <h4 className="mt-2 text-lg font-black text-white">{active.title}</h4>
                <p className="mt-2 border-l-2 border-primary/70 pl-3 text-xs text-white/80">
                  {active.issuer}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
