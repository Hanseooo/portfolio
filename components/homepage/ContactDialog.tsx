"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { CropMarks } from "@/components/geometry";
import ContactForm from "@/components/homepage/ContactForm";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";

/**
 * "Write a message" opener and the native modal that holds the contact form. The form mounts on
 * the first open (so Turnstile loads then, never on scroll) and stays mounted after close, so a
 * draft survives closing and reopening.
 */
export default function ContactDialog() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const [mounted, setMounted] = useState(false);
  const { stop: suspendScroll, resume: resumeScroll } = useScrollEnhancement();

  const open = () => {
    setMounted(true);
    dialogRef.current?.showModal();
    suspendScroll();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className="group inline-flex h-12 items-center gap-2 border border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-6 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-widest text-[color:var(--cs-foundation)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      >
        <span>Write a message</span>
        <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Native close returns focus to the opener.
        onClose={resumeScroll}
        // Backdrop click closes, but not a drag that started inside the sheet (selecting text).
        onPointerDown={(e) => {
          pressedBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressedBackdrop.current && e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-none w-[min(42rem,calc(100vw-2*var(--cs-gutter-portfolio)))] max-w-none overflow-visible border-0 bg-transparent p-0 text-[color:var(--cs-text-primary)] backdrop:bg-[color-mix(in_srgb,var(--cs-text-primary)_55%,transparent)] dark:backdrop:bg-[color-mix(in_srgb,var(--cs-foundation)_85%,transparent)]"
      >
        {/* The transmittal sheet. Not a scroll container itself, so the crop marks and the sent
            registration mark can sit outside its edge while the body scrolls. */}
        <div className="relative flex max-h-[calc(100dvh-2*var(--cs-gutter-portfolio))] flex-col border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] starting:translate-y-3 starting:opacity-0 motion-reduce:transition-none">
          <CropMarks className="hidden text-[color:var(--cs-structural-line-strong)] md:block" />
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[color:var(--cs-structural-line)] py-4 pr-3 pl-6 md:py-5 md:pl-8 lg:pl-10">
            <h2
              id={titleId}
              className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2.25rem)] font-black uppercase leading-[0.95] tracking-tight"
            >
              Write a message
            </h2>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 px-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Close
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div data-lenis-prevent className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain p-6 md:p-8 lg:p-10">
            {mounted && <ContactForm />}
          </div>
        </div>
      </dialog>
    </>
  );
}
