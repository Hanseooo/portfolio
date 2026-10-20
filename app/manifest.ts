import type { MetadataRoute } from "next";
import { SITE_HEADLINE } from "@/lib/content/homepage-projections";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Hans Amoguis — ${SITE_HEADLINE}`,
    short_name: "Hans Amoguis",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#000000",
    background_color: "#000000",
  };
}
