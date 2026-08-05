import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };
export const alt = "Share card for the projects index of Hans Amoguis' portfolio";

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Projects",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
