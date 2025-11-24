

import meBg from "@/assets/images/me-bg.png";
import me from "@/assets/images/me.png";
import waves from "@/assets/svg/topography.svg";
import myImg from "@/assets/images/me2.jpg";

// Marquee logos (public folder paths)
const marqueeLogos = [
  "/logo/HTML5.svg",
  "/logo/CSS3.svg",
  "/logo/JavaScript.svg",
  "/logo/React.svg",
  "/logo/TypeScript.svg",
  "/logo/Tailwind-CSS.svg",
  "/logo/Python.svg",
  "/logo/Django.svg",
  "/logo/PostgresSQL.svg",
  "/logo/MySQL.svg",
  "/logo/PHP.svg",
  "/logo/Bootstrap.svg",
  "/logo/Firebase.svg",
  "/logo/zustand-original.svg",
  "/logo/shadcn-ui-seeklogo.svg",
  "/logo/supabase-icon.svg",
  "/logo/scikit-learn.svg",
];

const projectImages = [
  // Podium
  "/projects/Podium/1.png",
  "/projects/Podium/2.png",
  "/projects/Podium/3.png",
  // ...
  "/projects/Podium/16.png",

  // LFMS
  "/projects/lfms/1.png",
  "/projects/lfms/2.png",
  "/projects/lfms/3.png",
  // ...

  // H-Lens
  "/projects/H-Lens/1.png",
  "/projects/H-Lens/2.png",
  // ...

  // QuickFlash
  "/projects/QuickFlash/hero.png",
  "/projects/QuickFlash/cards.png",
  "/projects/QuickFlash/quiz.png",
  "/projects/QuickFlash/about.png",

  // Other
  "/projects/Other/dummy-game.gif",
  "/projects/Other/dummy-game2.gif",
  "/projects/Other/simon-memory-game.jpg",
  "/projects/Other/simon-memory-game2.gif",
];


// All assets exported as one array
export const ASSETS_TO_LOAD = [
  meBg,
  me,
  waves,
  myImg,
  ...marqueeLogos,
  ...projectImages,
];
