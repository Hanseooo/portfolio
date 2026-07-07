import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Certificates",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
