import { ArrowUpRight } from "lucide-react";
import { GITHUB_HANDLE, GITHUB_URL } from "@/components/utils/externalLinks";

/**
 * Ink link block to the GitHub profile: the second move after a project catalogue CTA.
 * A full-width bar by default; `beside` turns it into a column from lg, sitting to the
 * right of the red "View All Projects" block (SceneFlagships), its title in the top-left
 * corner and its arrow in the bottom-left, so nothing near-misses the red block's centre line.
 */
export default function GitHubPanel({ beside = false }: { beside?: boolean }) {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative z-10 flex items-center justify-between gap-6 bg-zinc-900 px-6 py-6 text-white focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-white md:px-10 md:py-8 ${
        beside ? "lg:flex-col lg:items-start lg:p-10 xl:p-12" : ""
      }`}
    >
      {/* Beside the red block, its horizontal rule carries on through this panel. */}
      {beside && <span aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full bg-white/20 lg:block" />}
      <span className="relative">
        <span
          className={`block font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] font-black uppercase leading-[0.85] tracking-tight transition-transform duration-500 group-hover:scale-[1.02] ${
            beside ? "lg:text-[clamp(2rem,3.5vw,3.5rem)]" : ""
          }`}
        >
          More on <span className={beside ? "lg:block" : ""}>GitHub</span>
        </span>
        <span className={`mt-3 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-zinc-400 ${beside ? "lg:mt-4" : ""}`}>
          {GITHUB_HANDLE}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white group-hover:text-zinc-900 ${
          beside ? "lg:h-16 lg:w-16" : ""
        }`}
      >
        <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </a>
  );
}
