import { SvgId, SVG_MAP } from "@/lib/svgMap";
import { cloneElement } from "react";

type TechStackSvgProps = {
  id: SvgId;
  className?: string;
};

export default function TechStackSvg({ id, className }: TechStackSvgProps) {
  const Svg = SVG_MAP[id];

  if (!Svg) return null;

  return (
    <span className={className}>
      {cloneElement(Svg, {
        className: "w-4 h-4 md:w-6 md:h-6",
        "aria-hidden": true,
      })}
    </span>
  );
}
