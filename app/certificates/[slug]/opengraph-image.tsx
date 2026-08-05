import { renderOgImage, size, contentType } from "@/lib/og-image";
import { certificates } from "@/lib/certificates";

export const runtime = "nodejs";
export { size, contentType };
export const alt = "Share card for a certificate from Hans Amoguis' portfolio";

export async function generateStaticParams() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return renderOgImage({ kicker: "CERTIFICATE", title: "Certificate" });
  }

  return renderOgImage({
    kicker: "CERTIFICATE",
    title: certificate.title,
    subtitle: `${certificate.issuer} — ${certificate.date}`,
    imagePath: certificate.ogImageSrc,
  });
}
