"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { motionTokens, clipReveal, fadeUpReveal } from "@/lib/motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = [
  {
    label: "Build",
    items: [
      "React", "Next.js", "Langchain",
      "FastAPI", "PostgreSQL", "Tailwind CSS",
      "Zustand", "Tanstack Query", "Tanstack Router",
    ],
    duration: "50s",
  },
  {
    label: "Tools",
    items: ["Claude Code", "Codex", "Antigravity CLI", "OpenCode", "Playwright CLI", "Github CLI", "Docker"],
    duration: "45s",
  },
  {
    label: "Deploy",
    items: ["Vercel", "Supabase", "Firebase", "Cloudinary", "Brevo", "Neon", "Render", "Railway", "Upstash", "Cloudflare", "Clerk", "Posthog", "Sentry"],
    duration: "65s",
  },
];

function StackBadge({ item }: { item: string }) {
  return (
    <li className="bg-foreground/5 border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80">
      {item}
    </li>
  );
}

export default function TechStackSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16 flex items-end justify-between">
        <motion.h2
          {...clipReveal(reducedMotion)}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Stack
        </motion.h2>

        <motion.div {...fadeUpReveal(reducedMotion, 0.15)}>
        <Dialog>
          <DialogTrigger asChild>
            <button className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors border-b border-muted-foreground/30 hover:border-foreground/50 pb-px">
              View all
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-0.75rem)] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-black tracking-tighter text-xl">Stack</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6 mt-2 overflow-y-auto max-h-[60vh] pr-1">
              {categories.map((cat) => (
                <div key={cat.label}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                    {cat.label}
                  </p>
                  <div className="h-px bg-border mb-3" />
                  <ul className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <StackBadge key={item} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        </motion.div>
      </div>

      {/* Desktop md+: scrolling tickers */}
      <div className="hidden md:flex flex-col gap-8">
        {categories.map((cat, index) => {
          const reverse = index % 2 !== 0;
          const trackClass = reverse ? "ticker-track-reverse" : "ticker-track";
          // ponytail: 4 copies so shortest row (Tools ~450px) × 4 = 1800px > 2 × max-viewport
          const items = [...cat.items, ...cat.items, ...cat.items, ...cat.items];
          return (
            <div key={cat.label} className="ticker-row">
              <p className="px-6 mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                {cat.label}
              </p>
              <div className="overflow-hidden ticker-fade">
                <div
                  className={`${trackClass} flex min-w-max`}
                  style={{ animationDuration: cat.duration }}
                >
                  {/* ponytail: key={i} intentional — quadrupled array makes string keys collide */}
                  {items.map((item, i) => (
                    <span key={i} className="pr-8 font-bold text-sm uppercase tracking-[0.15em] text-foreground/80">
                      {item}
                      <span className="text-primary/40 ml-8" aria-hidden="true">/</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile below md: all rows as marquees */}
      <div className="md:hidden flex flex-col gap-10">
        {categories.map((cat, index) => {
          const reverse = index % 2 !== 0;
          const trackClass = reverse ? "ticker-track-reverse" : "ticker-track";
          const items = [...cat.items, ...cat.items, ...cat.items, ...cat.items];
          return (
            <motion.div
              key={cat.label}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: motionTokens.duration.base,
                ease: motionTokens.framerEase.enter,
                delay: index * 0.1,
              }}
            >
              <p className="px-6 mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                {cat.label}
              </p>
              <div className="mx-6 h-px w-[calc(100%-3rem)] bg-border mb-3" aria-hidden="true" />
              <div className="overflow-hidden ticker-fade">
                <div
                  className={`${trackClass} flex min-w-max`}
                  style={{ animationDuration: cat.duration }}
                >
                  {items.map((item, i) => (
                    <span key={i} className="pr-8 font-bold text-sm uppercase tracking-[0.15em] text-foreground/80">
                      {item}
                      <span className="text-primary/40 ml-8" aria-hidden="true">/</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
