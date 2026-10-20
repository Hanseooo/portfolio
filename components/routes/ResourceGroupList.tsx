"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import type { ResourceEntry, ResourceGroup } from "@/lib/resources";

const VISIBLE = 3;
const LINK_FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";
const FADE_MASK = "linear-gradient(to bottom, black, transparent)";

function ExternalMark() {
  return (
    <>
      <ArrowUpRight size={12} aria-hidden="true" />
      <span className="sr-only"> (opens in new tab)</span>
    </>
  );
}

function Row({
  entry,
  index,
  faded,
}: {
  entry: ResourceEntry;
  index: number;
  faded?: boolean;
}) {
  return (
    <li
      aria-hidden={faded || undefined}
      inert={faded}
      style={faded ? { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK } : undefined}
      className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-4"
    >
      <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest text-[color:var(--cs-text-secondary)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-semibold text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal-text)] ${LINK_FOCUS}`}
        >
          {entry.name}
          <ExternalMark />
        </a>
        {entry.note && (
          <p className="mt-1 text-sm text-[color:var(--cs-text-secondary)]">{entry.note}</p>
        )}
      </div>
      <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
        {entry.secondary && (
          <a
            href={entry.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 transition-colors hover:text-[color:var(--cs-signal-text)] ${LINK_FOCUS}`}
          >
            {entry.secondary.label}
            <ExternalMark />
          </a>
        )}
        {entry.meta && <span>{entry.meta}</span>}
      </div>
    </li>
  );
}

/** Show three rows, fade the fourth, expand the rest. The full list is always in the DOM. */
export default function ResourceGroupList({ group }: { group: ResourceGroup }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { entries } = group;
  const collapsible = entries.length > VISIBLE + 1;
  const head = collapsible ? entries.slice(0, VISIBLE + 1) : entries;
  const rest = collapsible ? entries.slice(VISIBLE + 1) : [];
  const listId = `${group.id}-list`;
  const ruled = "divide-y divide-[color:var(--cs-structural-line)]";

  return (
    <div>
      <div id={listId} className="border-y border-[color:var(--cs-structural-line)]">
        <ul role="list" className={ruled}>
          {head.map((entry, i) => (
            <Row key={entry.href} entry={entry} index={i} faded={collapsible && !expanded && i === VISIBLE} />
          ))}
        </ul>
        {rest.length > 0 && (
          <motion.ul
            role="list"
            inert={!expanded}
            initial={false}
            animate={expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className={`${ruled} overflow-hidden border-t border-[color:var(--cs-structural-line)]`}
          >
            {rest.map((entry, i) => (
              <Row key={entry.href} entry={entry} index={VISIBLE + 1 + i} />
            ))}
          </motion.ul>
        )}
      </div>
      {collapsible && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className={`mt-3 inline-flex h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal-text)] hover:underline ${LINK_FOCUS}`}
        >
          {expanded ? "Show fewer" : `Show all ${entries.length} ${group.id}`}
        </button>
      )}
    </div>
  );
}
