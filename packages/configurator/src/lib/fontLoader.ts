import type { Font, FontStyle } from '@clab/types';

const loadedFontUrls = new Set<string>();

/**
 * Loads a single font style (if not already loaded)
 */
function loadFontStyle(fontName: string, fontStyle: FontStyle): Promise<void> {
  if (loadedFontUrls.has(fontStyle.url)) {
    console.debug(
      `[FontLoader] Font style already loaded: ${fontName} (${fontStyle.weight}, ${fontStyle.style})`
    );
    return Promise.resolve();
  }

  console.debug(
    `[FontLoader] Loading font style: ${fontName} (${fontStyle.weight}, ${fontStyle.style}) from ${fontStyle.url}`
  );

  const fontFace = new FontFace(fontName, `url(${fontStyle.url})`, {
    style: fontStyle.style,
    weight: fontStyle.weight,
  });

  const loadPromise = fontFace
    .load()
    .then((loadedFace) => {
      document.fonts.add(loadedFace);
      loadedFontUrls.add(fontStyle.url);
      console.debug(
        `[FontLoader] Loaded and registered font style: ${fontName} (${fontStyle.weight}, ${fontStyle.style})`
      );
    })
    .catch((err) => {
      console.debug(
        `[FontLoader] Failed to load font style: ${fontName} (${fontStyle.weight}, ${fontStyle.style})`,
        err
      );
      throw err;
    });

  return loadPromise;
}

/**
 * Loads all available font styles for a font (caching internally)
 */
export function loadFont(font: Font): Promise<void[]> {
  console.debug(`[FontLoader] Preparing to load font: ${font.name}`);

  const styleEntries = Object.entries(font.styles).filter(([_, style]) => style !== null) as [
    string,
    FontStyle,
  ][];

  if (styleEntries.length === 0) {
    console.debug(`[FontLoader] No styles to load for font: ${font.name}`);
    return Promise.resolve([]); // ✅ Now explicitly returning void[]
  }

  const loadPromises = styleEntries.map(([styleType, style]) => {
    console.debug(`[FontLoader] Queueing font style "${styleType}" for font "${font.name}"`);
    return loadFontStyle(font.name, style);
  });

  return Promise.all(loadPromises).then((result) => {
    console.debug(`[FontLoader] Finished loading font: ${font.name}`);
    return result; // ✅ Ensures return type is void[]
  });
}
