import { ToolItem } from "./ToolItem";

export function ToolGroup({
  title,
  tools,
}: {
  title: string;
  tools: {
    label: string;
    icon: React.ElementType;
  }[];
}) {
  return (
    <div className="tool-group">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h3>

      <div className="flex flex-wrap gap-4">
        {tools.map(({ label, icon: Icon }) => (
          <ToolItem key={label} label={label} Icon={Icon} />
        ))}
      </div>
    </div>
  );
}
