import { renderOgImage, size, contentType } from "@/lib/og-image";
import { projects } from "@/lib/projects";

export const runtime = "nodejs";
export { size, contentType };
export const alt = "Share card for a project from Hans Amoguis' portfolio";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return renderOgImage({ kicker: "PROJECT", title: "Project" });
  }

  return renderOgImage({
    kicker: "PROJECT",
    title: project.title,
    subtitle: project.subtitle,
    imagePath: project.ogImageSrc,
  });
}
