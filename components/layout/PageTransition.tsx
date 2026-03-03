"use client";

import { motion } from "framer-motion";
import {
  getMotionDistance,
  getMotionMode,
  motionTokens,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { useClientReady } from "@/components/utils/useClientReady";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const motionMode = getMotionMode({
    reducedMotion,
    isMobile: runtimeEnv.isMobile,
  });
  const enterOffset = getMotionDistance("subtle", motionMode) * 0.5;
  const exitOffset = getMotionDistance("subtle", motionMode) * 0.35;

  return (
    <motion.div
      initial={{ opacity: 0, y: enterOffset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -exitOffset }}
      transition={{
        duration: reducedMotion ? motionTokens.duration.fast : motionTokens.duration.base,
        ease: motionTokens.framerEase.enter,
      }}
    >
      {children}
    </motion.div>
  );
}
