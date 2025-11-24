import { useEffect, useState } from "react";
import { ASSETS_TO_LOAD } from "@/utils/assetsToLoad";

export function useAssetPreloader() {
  const [loadedCount, setLoadedCount] = useState(0);
  const total = ASSETS_TO_LOAD.length;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function preloadAssets() {
      const loadImage = (src: string) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // don't block load
          img.src = src;
        });

      for (const src of ASSETS_TO_LOAD) {
        if (cancelled) return;
        await loadImage(src);
        setLoadedCount((c) => c + 1);
      }

      if (!cancelled) setIsLoaded(true);
    }

    preloadAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = Math.round((loadedCount / total) * 100);

  return {
    isLoaded,
    progress,
    loadedCount,
    total,
    setIsLoaded,
  };
}
