"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const RESET_MS = 2000;

type CopyState = "idle" | "copied" | "manual";

function copyShortcut(): string {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || navigator.platform || navigator.userAgent;
  return /mac|iphone|ipad|ipod/i.test(platform) ? "⌘C" : "Ctrl+C";
}

interface ContactEmailRowProps {
  email: string;
}

export default function ContactEmailRow({ email }: ContactEmailRowProps) {
  const addressRef = useRef<HTMLAnchorElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [state, setState] = useState<CopyState>("idle");
  const [shortcut, setShortcut] = useState("Ctrl+C");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(next: CopyState, message: string) {
    setState(next);
    setAnnouncement(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setState("idle");
      setAnnouncement("");
    }, RESET_MS);
  }

  function selectAddress() {
    const node = addressRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function handleCopy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      show("copied", "Email address copied");
    } catch {
      const keys = copyShortcut();
      setShortcut(keys);
      selectAddress();
      show("manual", `Email address selected. Press ${keys} to copy`);
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10">
      <a
        ref={addressRef}
        href={`mailto:${email}`}
        className="inline-flex min-h-12 items-center break-all font-[family-name:var(--font-mono)] text-base text-[color:var(--cs-text-primary)] underline decoration-[color:var(--cs-structural-line-strong)] underline-offset-4 transition-colors hover:decoration-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] md:text-lg"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="group inline-flex h-12 items-center gap-2 border border-[color:var(--cs-text-primary)] bg-transparent px-5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:bg-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-foundation)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      >
        {state === "copied" ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        <span>
          {state === "copied" ? "Copied" : state === "manual" ? `Press ${shortcut}` : "Copy"}
        </span>
      </button>
      <span className="sr-only" aria-live="polite" role="status">
        {announcement}
      </span>
    </div>
  );
}
