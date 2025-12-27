"use client";

import { useEffect } from "react";

export default function HomeScrollHandler() {
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");
    if (!target) return;

    sessionStorage.removeItem("scrollTarget");

    const scrollWithRetry = (attempts = 0) => {
      const element = document.getElementById(target);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 750);
      } else if (attempts < 10) {
        requestAnimationFrame(() => scrollWithRetry(attempts + 1));
      }
    };

    scrollWithRetry();
  }, []);

  return null;
}
