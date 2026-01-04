"use client";

import { useHorizontalScrollToVertical } from "../utils/useHorizontalScrollToVertical";

export default function GestureScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bind = useHorizontalScrollToVertical();

  return (
    <div {...bind()} className="touch-pan-y">
      {children}
    </div>
  );
}
