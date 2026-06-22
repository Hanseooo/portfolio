"use client";

const categories = [
  {
    label: "Build",
    items: [
      "React", "Next.js", "TypeScript", "Python",
      "Django REST Framework", "PostgreSQL", "Tailwind CSS",
      "Shadcn/ui", "Zustand", "Tanstack Query", "Tanstack Router",
    ],
    duration: "50s",
  },
  {
    label: "Augment",
    items: ["Claude Code", "Codex", "Gemini CLI", "OpenCode", "Playwright", "Cursor"],
    duration: "65s",
  },
  {
    label: "Deploy",
    items: ["Vercel", "Supabase", "Firebase", "Cloudinary", "Brevo"],
    duration: "40s",
  },
];

export default function TechStackSection({ id }: { id: string }) {
  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
          Stack
        </h2>
      </div>

      {/* Desktop md+: scrolling tickers */}
      <div className="hidden md:flex flex-col gap-8">
        {categories.map((cat, index) => {
          const reverse = index % 2 !== 0;
          const trackClass = reverse ? "ticker-track-reverse" : "ticker-track";
          // ponytail: 4 copies so shortest row (Deploy ~750px) × 4 = 3000px > 2 × max-viewport
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

      {/* Mobile below md: badge grid */}
      <div className="md:hidden px-6 flex flex-col gap-10">
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
              {cat.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
