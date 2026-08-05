import type { ProofFigure as ProofFigureData } from "@/lib/content/types";

interface ProofFigureProps {
  data: ProofFigureData;
  /** Size variant — compact for inline use, standard for standalone */
  size?: "compact" | "standard";
}

/**
 * Qualified proof figure with attribution — S1 §5, S6 §6.4.
 *
 * Displays a numeric value with its label and attribution.
 * Attribution and qualifiers always visible — never hidden behind interaction.
 */
export default function ProofFigure({ data, size = "standard" }: ProofFigureProps) {
  const isCompact = size === "compact";

  return (
    <figure
      className={`flex flex-col ${isCompact ? "gap-0.5" : "gap-1"}`}
      role="group"
      aria-label={`${data.value} ${data.label}`}
    >
      <span
        className={`font-[family-name:var(--font-display)] uppercase leading-none text-[color:var(--cs-signal-text)] ${
          isCompact ? "text-2xl" : "text-[clamp(2.5rem,6vw,4rem)]"
        }`}
      >
        {data.value}
      </span>
      <span
        className={`text-[color:var(--cs-text-primary)] ${
          isCompact ? "text-sm" : "text-base md:text-lg"
        }`}
      >
        {data.label}
      </span>
      <figcaption
        className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]"
      >
        {data.attribution}
      </figcaption>
    </figure>
  );
}
