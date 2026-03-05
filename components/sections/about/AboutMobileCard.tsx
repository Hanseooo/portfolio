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
        "rounded-xl border border-foreground/20 bg-background/85 p-5 shadow-primary-sharp sm:p-6",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-foreground/70">{eyebrow}</p>
      <h3 className="mt-3 break-words text-lg font-bold leading-tight text-primary sm:text-2xl">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}
