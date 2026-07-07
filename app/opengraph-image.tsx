import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Full-Stack Engineer",
    subtitle:
      "Full-stack engineer focused on AI product engineering with Next.js, TypeScript, LangChain, and FastAPI.",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
