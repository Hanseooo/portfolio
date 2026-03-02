"use client";

import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";

export default function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.framerEase.enter,
      }}
      viewport={{ once: true, amount: 0.6 }}
      className="mx-auto max-w-5xl px-6"
    >
      <div className="relative h-px bg-foreground/15">
        {/* accent */}
        <div className="absolute left-0 top-0 h-px w-16 bg-primary" />
      </div>
    </motion.div>
  );
}
