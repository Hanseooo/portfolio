import Image, { type StaticImageData } from "next/image";

interface DocumentaryArtifactProps {
  src: StaticImageData;
  alt: string;
  /** Large variant for detail page hero display */
  large?: boolean;
}

/**
 * Documentary artifact frame — S2 §Truthful imagery, S4 §10.
 *
 * Certificate/credential image on a quiet mat surface.
 * Uncropped, undistorted, full-color.
 * Subordinate to project imagery but recognizable.
 */
export default function DocumentaryArtifact({
  src,
  alt,
  large = false,
}: DocumentaryArtifactProps) {
  return (
    <figure
      className={`relative overflow-hidden border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-reading-surface)] p-4 md:p-6 ${
        large ? "max-w-3xl" : "max-w-sm"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        className="h-auto w-full object-contain"
        sizes={large ? "(max-width: 768px) 100vw, 768px" : "(max-width: 768px) 50vw, 384px"}
      />
    </figure>
  );
}
