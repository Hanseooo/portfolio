"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const chars = text.split("");

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.02, delayChildren: delay } },
        hidden: {},
      }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.2em", rotateX: 90 },
            visible: { 
              opacity: 1, 
              y: "0em", 
              rotateX: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
            },
          }}
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
