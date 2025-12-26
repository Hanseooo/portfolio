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
    <div className="tool-group">
      <h3 className="mb-2 sm:mb-4 text-sm font-semibold uppercase tracking-wide opacity-70">
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
