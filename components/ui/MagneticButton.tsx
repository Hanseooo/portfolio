"use client";

import React, { useRef } from "react";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref);

  return (
    <div ref={ref} className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  );
}
