import { useMagnetic } from "@/components/motion/useMagnetic";
import { useRef } from "react";

export function ToolItem({ label, Icon }: { label: string; Icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref);

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}
