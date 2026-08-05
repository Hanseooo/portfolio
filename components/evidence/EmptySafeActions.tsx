import type { ReactNode } from "react";

interface ActionItem {
  /** Unique key */
  key: string;
  /** The rendered action element (Link, button, etc.) */
  element: ReactNode;
}

interface EmptySafeActionsProps {
  /** List of possible actions — may include nulls for absent actions */
  actions: (ActionItem | null | undefined)[];
  /** Layout direction */
  direction?: "row" | "column";
}

/**
 * Empty-safe optional action group — S4 §11, S6 §6.4.
 *
 * Renders nothing when all actions are absent.
 * No empty container, no misleading disabled controls.
 * Truthful omission per S1 content-validation rules.
 */
export default function EmptySafeActions({
  actions,
  direction = "row",
}: EmptySafeActionsProps) {
  const validActions = actions.filter(
    (a): a is ActionItem => a != null
  );

  if (validActions.length === 0) return null;

  return (
    <div
      className={`flex gap-3 ${
        direction === "column" ? "flex-col" : "flex-row flex-wrap"
      }`}
      role="group"
      aria-label="Actions"
    >
      {validActions.map((action) => (
        <div key={action.key}>{action.element}</div>
      ))}
    </div>
  );
}
