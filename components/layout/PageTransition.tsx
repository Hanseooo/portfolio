"use client";

import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
      transition={{
        duration: reducedMotion ? motionTokens.duration.fast : motionTokens.duration.feature,
        ease: motionTokens.framerEase.enter,
      }}
    >
      {children}
    </motion.div>
  );
}
