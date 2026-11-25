"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { CropMarks } from "@/components/geometry";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export type Shot = { src: StaticImageData; alt: string };

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXIT_EASE = "cubic-bezier(0.55, 0.08, 0.68, 0.53)";
const pad = (n: number) => String(n).padStart(2, "0");

/** Transform that lays `to` over `from` (both viewport rects), origin top-left. */
function flipFrom(from: DOMRect, to: DOMRect) {
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
}

type ViewerApi = {
  count: number;
  open: (i: number) => void;
  thumbRef: (i: number) => (el: HTMLDivElement | null) => void;
};
const ViewerContext = createContext<ViewerApi | null>(null);

/**
 * Full-screen screenshot viewer (native <dialog>) for every `ShotThumb` inside it. The shot
 * grows out of its thumbnail and shrinks back into the current one on close; crop marks settle
 * around each shot (`.shot-viewer`, globals.css). Arrow keys and Previous/Next move between
 * shots; Esc, Close or a click on empty space closes. A thumbnail that is hidden or off-screen
 * when the viewer closes (a collapsed <details>, a scrolled page) gets an instant close.
 */
export function ScreenshotViewer({ shots, label, children }: { shots: Shot[]; label: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLDivElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const reducedMotion = usePrefersReducedMotion();
  const { stop: suspendScroll, resume: resumeScroll } = useScrollEnhancement();
  const count = shots.length;

  const chrome = () => dialogRef.current?.querySelectorAll<HTMLElement>("[data-viewer-chrome]") ?? [];
  const shot = () => stageRef.current?.querySelector<HTMLElement>("[data-viewer-shot]");

  const open = (i: number) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setIndex(i);
    dialog.showModal();
    closeRef.current?.focus();
    suspendScroll();
    if (reducedMotion) return;
    // After React commits the new index, grow the shot out of its thumbnail.
    requestAnimationFrame(() => {
      const el = shot();
      const thumb = thumbs.current[i]?.getBoundingClientRect();
      if (!el || !thumb) return;
      el.animate([{ transform: flipFrom(thumb, el.getBoundingClientRect()) }, { transform: "none" }], {
        duration: 420,
        easing: EASE,
        fill: "backwards",
      });
      chrome().forEach((c) => c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: EASE }));
    });
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing.current) return;
    const el = shot();
    const thumb = thumbs.current[index]?.getBoundingClientRect();
    const thumbOnScreen = thumb && thumb.width > 0 && thumb.bottom > 0 && thumb.top < window.innerHeight;
    if (reducedMotion || !el || !thumbOnScreen) {
      dialog.close();
      return;
    }
    closing.current = true;
    const opts = { duration: 260, easing: EXIT_EASE, fill: "forwards" as const };
    chrome().forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], opts));
    el.animate([{ transform: "none" }, { transform: flipFrom(thumb, el.getBoundingClientRect()) }], opts).finished.then(
      () => dialog.close(),
      () => dialog.close()
    );
  };

  const step = (delta: number) => setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));
  const thumbRef = (i: number) => (el: HTMLDivElement | null) => {
    thumbs.current[i] = el;
  };

  const control =
    "inline-flex min-h-11 items-center gap-2 px-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";

  return (
    <ViewerContext.Provider value={{ count, open, thumbRef }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClose={() => {
          closing.current = false;
          chrome().forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
          shot()?.getAnimations().forEach((a) => a.cancel());
          resumeScroll();
        }}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          else if (e.key === "ArrowLeft") step(-1);
        }}
        className="shot-viewer m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-[color:var(--cs-text-primary)] backdrop:bg-transparent"
      >
        <div data-viewer-chrome aria-hidden="true" className="absolute inset-0 bg-[color:var(--cs-foundation)]" />
        <div className="relative flex h-full flex-col">
          <div
            data-viewer-chrome
            className="flex shrink-0 items-center justify-between gap-4 border-b border-[color:var(--cs-structural-line)] py-2 pr-2 pl-[var(--cs-gutter-portfolio)]"
          >
            <p aria-live="polite" className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
              <span aria-hidden="true" className="h-px w-8 bg-[color:var(--cs-signal)]" />
              <span>
                {pad(index + 1)} <span className="text-[color:var(--cs-text-secondary)]">/ {pad(count)}</span>
              </span>
            </p>
            <div className="flex items-center">
              {count > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous screenshot" className={control}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button type="button" onClick={() => step(1)} disabled={index === count - 1} aria-label="Next screenshot" className={control}>
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              )}
              <button ref={closeRef} type="button" onClick={close} className={control}>
                Close
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Empty space around the shot closes the viewer. */}
          <div
            ref={stageRef}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            className="flex min-h-0 flex-1 items-center justify-center p-6 md:p-12"
          >
            {/* Sized from the aspect ratio, not the loaded file, so the grow lands on the final box. */}
            <div
              key={index}
              data-viewer-shot
              style={{ "--shot-ratio": shots[index].src.width / shots[index].src.height } as CSSProperties}
              className="relative w-[min(100%,calc((100dvh-8rem)*var(--shot-ratio)))] origin-top-left md:w-[min(100%,calc((100dvh-10rem)*var(--shot-ratio)))]"
            >
              <CropMarks className="text-[color:var(--cs-structural-line-strong)]" />
              {failed.has(index) ? (
                <p className="flex aspect-video w-full items-center justify-center border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-raised-neutral)] px-6 text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Couldn&apos;t load this screenshot
                </p>
              ) : (
                <Image
                  src={shots[index].src}
                  alt={shots[index].alt}
                  sizes="100vw"
                  placeholder="blur"
                  onError={() => setFailed((f) => new Set(f).add(index))}
                  className="block h-auto w-full border border-[color:var(--cs-structural-line)]"
                />
              )}
            </div>
          </div>
        </div>
      </dialog>
    </ViewerContext.Provider>
  );
}

/** A thumbnail that opens shot `index` of the surrounding ScreenshotViewer. */
export function ShotThumb({ index, children }: { index: number; children: ReactNode }) {
  const viewer = useContext(ViewerContext);
  if (!viewer) throw new Error("ShotThumb must sit inside a ScreenshotViewer");
  return (
    <div ref={viewer.thumbRef(index)} className="relative">
      {children}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Open screenshot ${index + 1} of ${viewer.count}`}
        onClick={() => viewer.open(index)}
        className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      />
    </div>
  );
}
