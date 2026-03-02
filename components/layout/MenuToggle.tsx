"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import { motionTokens } from "@/lib/motion";

export default function MenuToggle({
  open,
  toggle,
  buttonRef,
  controlsId,
}: {
  open: boolean;
  toggle: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  controlsId: string;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      className="relative z-[60] h-6 w-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controlsId}
    >
      <motion.span
        className="absolute top-1 left-0 h-0.5 w-full bg-current"
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 8 : 0,
        }}
        transition={{
          duration: motionTokens.duration.fast,
          ease: motionTokens.framerEase.emphasis,
        }}
      />
      <motion.span
        className="absolute bottom-1 left-0 h-0.5 w-full bg-current"
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -8 : 0,
        }}
        transition={{
          duration: motionTokens.duration.fast,
          ease: motionTokens.framerEase.emphasis,
        }}
      />
    </button>
  );
}
