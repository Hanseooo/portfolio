import type { ReactNode } from "react";

type ProviderState = "loading" | "success" | "unavailable" | "error";

interface LiveProviderRegionProps {
  /** Provider identity for stable ID and aria */
  providerId: string;
  /** Current provider state */
  state: ProviderState;
  /** Accessible label */
  label: string;
  /** Content for each state */
  children: ReactNode;
  /** Optional minimum height to prevent layout shift */
  minHeight?: string;
}

/**
 * Stable live-provider region primitive — S3 Scene 05, S5 §16.2, S6 §6.4.
 *
 * Maintains stable footprint across loading/success/unavailable/error states.
 * Updates replace content inside the footprint — no slide, no layout shift.
 * State announcements are polite and non-interruptive.
 */
export default function LiveProviderRegion({
  providerId,
  state,
  label,
  children,
  minHeight = "auto",
}: LiveProviderRegionProps) {
  return (
    <div
      id={`provider-${providerId}`}
      role="region"
      aria-label={label}
      aria-live="polite"
      aria-atomic="true"
      className="relative"
      style={{ minHeight }}
      data-provider-state={state}
    >
      {children}
    </div>
  );
}
