export const motionTokens = {
  duration: {
    fast: 0.22,
    base: 0.38,
    feature: 0.72,
  },
  stagger: {
    text: 0.06,
    list: 0.09,
  },
  framerEase: {
    enter: [0.22, 0.61, 0.36, 1] as const,
    exit: [0.55, 0.08, 0.68, 0.53] as const,
    emphasis: [0.4, 0, 0.2, 1] as const,
  },
  gsapEase: {
    enter: "power3.out",
    exit: "power3.in",
    emphasis: "power2.inOut",
  },
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
