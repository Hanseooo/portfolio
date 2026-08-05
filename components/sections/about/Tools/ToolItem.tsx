import TechStackSvg from "@/components/svg/TechStackSvg";
import { SvgId } from "@/lib/svgMap";

export function ToolItem({ label, id }: { label: string; id: SvgId }) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-full border border-foreground/20 bg-muted-foreground/5 px-4 py-1 text-sm leading-none transition hover:border-primary hover:text-primary dark:bg-accent sm:py-2">
      <TechStackSvg id={id} />
      <p>{label}</p>
    </div>
  );
}
