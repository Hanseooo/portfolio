import { useMagnetic } from "@/components/motion/useMagnetic";
import TechStackSvg from "@/components/svg/TechStackSvg";
import { SvgId } from "@/lib/svgMap";
import { useRef } from "react";

export function ToolItem({ label, id }: { label: string; id: SvgId }) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref);

  return (
    <div
      ref={ref}
      className="flex bg-muted-foreground/5 dark:bg-accent items-center gap-2 rounded-full border border-foreground/20 px-4 py-1 sm:py-2 text-sm transition hover:border-primary hover:text-primary"
    >
      <TechStackSvg id={id} />
      <p >{label}</p>
    </div>
  );
}
