"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
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
        className="group inline-flex h-12 w-full items-center justify-between gap-6 border border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-6 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-widest text-[color:var(--cs-foundation)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      >
        <span>Write a message</span>
        <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
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
        className="contact-dialog m-0 h-dvh max-h-none w-screen max-w-none overflow-visible border-0 bg-transparent p-0 text-[color:var(--cs-text-primary)] backdrop:bg-[color-mix(in_srgb,var(--cs-text-primary)_70%,transparent)] md:m-auto md:h-fit md:w-[min(40rem,calc(100vw-2*var(--cs-gutter-portfolio)))] dark:backdrop:bg-[color-mix(in_srgb,var(--cs-foundation)_85%,transparent)]"
      >
        {/* The transmittal sheet. Not a scroll container itself, so the crop marks and the sent
            registration mark can sit outside its edge while the body scrolls. */}
        <div className="contact-sheet relative flex h-full flex-col bg-[color:var(--cs-foundation)] md:h-auto md:max-h-[calc(100dvh-2*var(--cs-gutter-portfolio))] md:border md:border-[color:var(--cs-structural-line-strong)]">
          <CropMarks className="hidden text-[color:var(--cs-structural-line-strong)] md:block" />
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[color:var(--cs-structural-line)] py-2 pr-3 pl-6 md:pl-8 lg:pl-10">
            {/* Status-line grammar: signal leader, then the title in mono caps */}
            <h2
              id={titleId}
              className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)]"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[color:var(--cs-signal)]" />
              New message
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
