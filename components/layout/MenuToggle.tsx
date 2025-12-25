"use client";

import { motion } from "framer-motion";

export default function MenuToggle({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className="relative z-60 h-6 w-8 focus:outline-none"
      aria-label="Menu"
    >
      <motion.span
        className="absolute top-1 left-0 h-0.5 w-full bg-current"
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 8 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute bottom-1 left-0 h-0.5 w-full bg-current"
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -8 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </button>
  );
}
