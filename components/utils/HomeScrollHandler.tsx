"use client";

import { useEffect } from "react";

export default function HomeScrollHandler() {
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");
    if (!target) return;

    // Remove it so it doesn't trigger on every refresh
    sessionStorage.removeItem("scrollTarget");

    // Give Next.js a moment to mount the components
    const scrollWithRetry = (attempts = 0) => {
      const element = document.getElementById(target);

      if (element) {
        // Use a slight delay to ensure layout shifts (images/grids) are settled
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else if (attempts < 10) {
        // If element not found, try again in the next frame (up to 10 times)
        requestAnimationFrame(() => scrollWithRetry(attempts + 1));
      }
    };

    scrollWithRetry();
  }, []);

  return null;
}
