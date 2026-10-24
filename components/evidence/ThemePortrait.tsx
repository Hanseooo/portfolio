import Image, { type StaticImageData } from "next/image";

interface ThemePortraitProps {
  light: StaticImageData;
  dark: StaticImageData;
  alt: string;
  sizes: string;
  /** On the wrapper: effects that apply to whichever image shows. */
  className?: string;
  /** On the light image, which sets the box; the dark image fills it. */
  imageClassName?: string;
  /** Above-the-fold use: preload the light image, load the dark one eagerly. */
  priority?: boolean;
}

/**
 * Portrait that follows the theme. The dark image covers the light one and
 * shows under `.dark`, so the theme toggle's circle reveal carries the swap
 * (no transition of its own). The dark copy is hidden from assistive tech so
 * the portrait is announced once.
 */
export default function ThemePortrait({
  light,
  dark,
  alt,
  sizes,
  className = "",
  imageClassName = "",
  priority = false,
}: ThemePortraitProps) {
  return (
    <span className={`relative block ${className}`}>
      <Image src={light} alt={alt} sizes={sizes} priority={priority} className={imageClassName} />
      <Image
        src={dark}
        alt=""
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className="invisible absolute inset-0 size-full object-cover dark:visible"
      />
    </span>
  );
}
