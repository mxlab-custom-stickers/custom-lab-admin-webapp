import { Font, FontStyle } from '@/models/text.ts';

const loadedFontKeys = new Set<string>();

export async function loadFont(font: Font) {
  return await Promise.all(
    Object.entries(font.styles).map(async ([styleKey, style]) => {
      if (!style) return null;

      const key = `${font.id}-${styleKey}`;
      if (loadedFontKeys.has(key)) {
        console.debug(`Font already loaded: ${key}`);
        return null;
      }

      const fontFace = new FontFace(font.name, `url(${style.url})`, {
        weight: style.weight,
        style: style.style,
      });

      try {
        await fontFace.load();
        document.fonts.add(fontFace);
        loadedFontKeys.add(key);
        console.debug(
          `Loaded font: ${font.name} (${style.weight} ${style.style})`
        );
        return fontFace;
      } catch (error) {
        console.error(
          `Failed to load font ${font.name} (${style.weight} ${style.style})`,
          error
        );
        return null;
      }
    })
  );
}

export function countAvailableFontStyles(font: Font): number {
  return Object.values(font.styles).filter(
    (style): style is FontStyle => style !== null
  ).length;
}
