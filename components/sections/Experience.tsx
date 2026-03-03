"use client";

import { experience } from "@/lib/experience";
import { motion } from "framer-motion";
import {
  getEnterY,
  getMotionDistance,
  getMotionMode,
  motionTokens,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { useClientReady } from "@/components/utils/useClientReady";


export default function Experience() {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const motionMode = getMotionMode({
    reducedMotion,
    isMobile: runtimeEnv.isMobile,
  });

  const headingEnter = getEnterY("accent", motionMode);
  const itemEnter = getEnterY("subtle", motionMode);
  const pointDistance = getMotionDistance("subtle", motionMode) * 0.6;

  const itemVariants = {
    hidden: itemEnter,
    visible: { y: 0, opacity: 1 },
  };

  const pointsVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren:
          motionMode === "desktop"
            ? motionTokens.stagger.text
            : motionTokens.stagger.text * 0.7,
        delayChildren: motionTokens.stagger.text,
      },
    },
  };

  const pointVariants = {
    hidden: { y: pointDistance, opacity: motionMode === "reduced" ? 1 : 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-32">
      <motion.div
        initial={headingEnter}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto mb-20 max-w-3xl text-center"
      >
        <h2 className="font-black text-primary">
          <span className="mb-3 block text-xs uppercase tracking-[0.26em] text-primary/80">
            Timeline
          </span>
          <span className="text-[clamp(2rem,7vw,4rem)]">Experience</span>
        </h2>
        <p className="mt-5 text-sm leading-relaxed opacity-75 sm:text-base">
          Academic and project-led roles that shaped collaboration, delivery speed, and systems thinking.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          staggerChildren: motionTokens.stagger.list,
        }}
        className="space-y-16"
      >
        {experience.map((item, i) => (
          <motion.div
            variants={itemVariants}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
            }}
            key={i}
            className="exp-item border-l border-foreground/20 pl-6"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{item.role}</h3>
              <span className="text-sm opacity-60">{item.period}</span>
            </div>

            <p className="mb-4 opacity-80">{item.company}</p>

            <motion.ul
              variants={pointsVariants}
              className="list-disc space-y-2 pl-5 opacity-80"
            >
              {item.points.map((point, idx) => (
                <motion.li
                  key={idx}
                  variants={pointVariants}
                  transition={{
                    duration: motionTokens.duration.base,
                    ease: motionTokens.framerEase.enter,
                  }}
                >
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
