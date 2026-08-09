"use client";

import { motion, type Variants } from "framer-motion";
import type { HomepageIdentityProjection } from "@/lib/content/homepage-projections";

const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

/**
 * The only client-requiring part of scene 01 — the staggered proof cards.
 * Kept as an island so SceneIdentity itself stays a server component.
 */
export default function HeroProofCards({
  proof,
}: {
  proof: HomepageIdentityProjection["immediateProof"];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[color:var(--cs-structural-line)]">
      {proof.map((item, idx) => (
        <motion.div
          key={idx}
          variants={staggerItem}
          className={`flex flex-col justify-start p-4 md:p-5 lg:p-6 min-h-[104px] border-zinc-800 ${
            idx === 0 ? 'border-b md:border-b-0 md:border-r' : ''
          }`}
        >
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
            {item.attribution}
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
            {item.value}
          </span>
          <span className="mt-2 text-xs text-zinc-400">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
