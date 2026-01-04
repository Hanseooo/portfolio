import { useMemo } from "react";
import { useHorizontalScrollToVertical } from "./useHorizontalScrollToVertical";

export function useHorizontalDrag(enabled: boolean) {
  const bind = useHorizontalScrollToVertical();

  return useMemo(() => {
    if (!enabled) return {};
    return bind();
  }, [enabled, bind]);
}
