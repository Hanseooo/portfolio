import Image, { type StaticImageData } from "next/image";

interface ScreenshotFrameProps {
  src: StaticImageData;
  alt: string;
  /** Optional: priority loading for above-fold images */
  priority?: boolean;
  /** Optional: wide variant uses full available width */
  wide?: boolean;
}

/**
 * Full-color screenshot evidence frame — S2 §Truthful imagery, S6 §6.4.
 *
 * Preserves identity and informational value.
 * No darkening, no full-bleed background treatment.
 * Flat architectural plane with minimal frame.
 */
export default function ScreenshotFrame({
  src,
  alt,
  priority = false,
  wide = false,
}: ScreenshotFrameProps) {
  return (
    <figure
      className={`relative overflow-hidden border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-raised-neutral)] ${
        wide ? "w-full" : "max-w-4xl"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        className="h-auto w-full object-contain"
        sizes={wide ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"}
      />
    </figure>
  );
}
