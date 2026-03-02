import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AboutPanelShellProps = {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
};

type AboutPanelHeadingProps = {
  eyebrow: string;
  title: string;
  className?: string;
  titleClassName?: string;
};

export function AboutPanelShell({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
}: AboutPanelShellProps) {
  return (
    <div
      className={cn(
        "about-panel flex min-h-screen w-screen flex-col items-center justify-center gap-12 px-6 py-16 md:h-screen md:min-h-0 md:flex-row md:px-12 md:py-0",
        className
      )}
    >
      <div className={cn("w-full md:w-1/2", leftClassName)}>{left}</div>
      <div className={cn("w-full md:w-1/2", rightClassName)}>{right}</div>
    </div>
  );
}

export function AboutPanelHeading({
  eyebrow,
  title,
  className,
  titleClassName,
}: AboutPanelHeadingProps) {
  return (
    <div className={cn("flex flex-col text-center md:text-left", className)}>
      <span className="text-xs uppercase tracking-[0.3em] opacity-60">{eyebrow}</span>
      <h2
        className={cn(
          "mt-4 text-4xl font-bold leading-tight text-primary md:mt-5 md:text-5xl",
          titleClassName
        )}
      >
        {title.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
