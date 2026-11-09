"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance: "interaction-only";
      theme: "light" | "dark" | "auto";
      "refresh-expired": "auto";
      callback: () => void;
      "before-interactive-callback": () => void;
      "after-interactive-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Turnstile widget for the enclosing form. The script loads when this mounts, so mount it only once
 * the form is shown (the contact dialog mounts its form on first open). The widget adds a
 * `cf-turnstile-response` field to the form.
 * `resetKey` changing resets the widget, since each token is single-use. `onToken` runs each time
 * a token lands in that field. `onInteractive` reports whether a visible challenge is showing.
 */
export default function TurnstileWidget({
  resetKey,
  onLoadError,
  onToken,
  onInteractive,
}: {
  resetKey: unknown;
  onLoadError: () => void;
  onToken: () => void;
  onInteractive: (shown: boolean) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // The widget keeps the callback it was rendered with: read the latest through a ref.
  const onTokenRef = useRef(onToken);
  const onInteractiveRef = useRef(onInteractive);
  useEffect(() => {
    onTokenRef.current = onToken;
    onInteractiveRef.current = onInteractive;
  }, [onToken, onInteractive]);

  useEffect(() => {
    if (!siteKey) onLoadError();
  }, [siteKey, onLoadError]);

  // Re-render on theme change: Turnstile can't switch theme on a live widget.
  useEffect(() => {
    const container = containerRef.current;
    if (!loaded || !siteKey || !container || !window.turnstile) return;
    const turnstile = window.turnstile;
    const id = turnstile.render(container, {
      sitekey: siteKey,
      appearance: "interaction-only",
      theme: resolvedTheme === "dark" ? "dark" : resolvedTheme === "light" ? "light" : "auto",
      "refresh-expired": "auto",
      callback: () => onTokenRef.current(),
      "before-interactive-callback": () => onInteractiveRef.current(true),
      "after-interactive-callback": () => onInteractiveRef.current(false),
    });
    widgetId.current = id;
    return () => {
      turnstile.remove(id);
      widgetId.current = null;
    };
  }, [loaded, siteKey, resolvedTheme]);

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return (
    <>
      {siteKey && (
        <Script src={SCRIPT_SRC} strategy="lazyOnload" onReady={() => setLoaded(true)} onError={onLoadError} />
      )}
      <div ref={containerRef} />
    </>
  );
}
