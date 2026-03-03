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
  distance: {
    subtle: {
      desktop: 16,
      mobile: 10,
      reduced: 0,
    },
    accent: {
      desktop: 26,
      mobile: 16,
      reduced: 0,
    },
    parallax: {
      desktop: 18,
      mobile: 0,
      reduced: 0,
    },
  },
};

export type MotionMode = "desktop" | "mobile" | "reduced";
export type MotionDistanceToken = keyof typeof motionTokens.distance;

type MotionModeInput = {
  reducedMotion: boolean;
  isMobile: boolean;
};

export function getMotionMode({ reducedMotion, isMobile }: MotionModeInput): MotionMode {
  if (reducedMotion) return "reduced";
  if (isMobile) return "mobile";
  return "desktop";
}

export function getMotionDistance(token: MotionDistanceToken, mode: MotionMode) {
  return motionTokens.distance[token][mode];
}

export function getEnterY(token: MotionDistanceToken, mode: MotionMode) {
  return { y: getMotionDistance(token, mode), opacity: mode === "reduced" ? 1 : 0 };
}

export function getEnterYTransition(mode: MotionMode) {
  if (mode === "reduced") {
    return {
      duration: motionTokens.duration.fast,
      ease: motionTokens.framerEase.enter,
    };
  }

  return {
    duration: mode === "mobile" ? motionTokens.duration.base : motionTokens.duration.feature,
    ease: motionTokens.framerEase.enter,
  };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
