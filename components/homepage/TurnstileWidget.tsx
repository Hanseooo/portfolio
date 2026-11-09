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
 * Turnstile widget for the enclosing form. The script loads only once that form comes within
 * 200px of the viewport. The widget adds a `cf-turnstile-response` field to the form.
 * `resetKey` changing resets the widget, since each token is single-use.
 */
export default function TurnstileWidget({ resetKey, onLoadError }: { resetKey: unknown; onLoadError: () => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!siteKey) onLoadError();
  }, [siteKey, onLoadError]);

  useEffect(() => {
    const target = containerRef.current?.closest("form") ?? containerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

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
      {near && siteKey && (
        <Script src={SCRIPT_SRC} strategy="lazyOnload" onReady={() => setLoaded(true)} onError={onLoadError} />
      )}
      <div ref={containerRef} />
    </>
  );
}
