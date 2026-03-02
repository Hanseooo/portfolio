import { SvgId } from "@/lib/svgMap";
import { ToolItem } from "./ToolItem";

export function ToolGroup({
  title,
  tools,
}: {
  title: string;
  tools: {
    label: string;
    id: SvgId;
  }[];
}) {
  return (
    <div className="tool-group border-l border-foreground/20 pl-4 sm:pl-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h3>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {tools.map(({ label, id }) => (
          <ToolItem key={label} label={label} id={id} />
        ))}
      </div>
    </div>
  );
}
