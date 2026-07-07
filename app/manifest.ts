import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hans Amoguis — Full-Stack Engineer",
    short_name: "Hans Amoguis",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    theme_color: "#00E5FF",
    background_color: "#000000",
  };
}
