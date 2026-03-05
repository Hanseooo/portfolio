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
      className="relative z-[60] flex h-11 w-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controlsId}
    >
      <motion.span
        className="absolute top-3.5 left-1.5 h-0.5 w-8 bg-current"
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 4 : 0,
        }}
        transition={{
          duration: motionTokens.duration.fast,
          ease: motionTokens.framerEase.emphasis,
        }}
      />
      <motion.span
        className="absolute bottom-3.5 left-1.5 h-0.5 w-8 bg-current"
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -4 : 0,
        }}
        transition={{
          duration: motionTokens.duration.fast,
          ease: motionTokens.framerEase.emphasis,
        }}
      />
    </button>
  );
}
