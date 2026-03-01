"use client";

import { useEffect } from "react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="text-3xl font-bold text-primary">Could not load project</h1>
      <p className="max-w-xl text-sm opacity-80">
        Something went wrong while rendering this project page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded border border-primary px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-background"
      >
        Try again
      </button>
    </main>
  );
}
