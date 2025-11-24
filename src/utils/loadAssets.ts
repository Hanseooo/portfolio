
export function waitForImages(
  selectors: string[] = ["img"]
): Promise<void> {
  return new Promise((resolve) => {
    const images = selectors
      .flatMap((sel) => Array.from(document.querySelectorAll<HTMLImageElement>(sel)));

    if (images.length === 0) {
      resolve();
      return;
    }

    let loaded = 0;

    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) resolve();
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === images.length) resolve();
        };
      }
    });
  });
}

export function waitForFonts(): Promise<void> {
  return document.fonts
    ? document.fonts.ready.then(() => {})
    : Promise.resolve();
}
