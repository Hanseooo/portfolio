import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AboutMobileCardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function AboutMobileCard({
  eyebrow,
  title,
  children,
  className,
}: AboutMobileCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-foreground/15 bg-background/90 p-5 shadow-primary-sharp backdrop-blur sm:p-6 dark:bg-background/70",
        className
      )}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.28em] opacity-60">{eyebrow}</p>
      <h3 className="mt-3 break-words text-lg font-bold leading-tight text-primary sm:text-2xl">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}
