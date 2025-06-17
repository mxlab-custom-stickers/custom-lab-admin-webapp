import { Color, ColorPalette } from '@/models/color.ts';

/**
 * Converts a hex color to its RGB components.
 * @param hex - The color in hex format (e.g., '#FFFFFF').
 * @returns An object with r, g, and b properties.
 */
function hexToRgb(hex: string) {
  const cleanedHex = hex.replace('#', '');
  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Calculates the luminance of an RGB color.
 * @param r - The red component (0-255).
 * @param g - The green component (0-255).
 * @param b - The blue component (0-255).
 * @returns The luminance value.
 */
function calculateLuminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Comparator function to sort colors from white to black.
 * @param a - The first color in hex format (e.g., '#FFFFFF').
 * @param b - The second color in hex format (e.g., '#000000').
 * @returns A negative number if a is closer to white, a positive number if b is closer to white, or 0 if they are equal.
 */
export function compareColorsByLuminance(a: Color, b: Color) {
  const { r: rA, g: gA, b: bA } = hexToRgb(a.value);
  const { r: rB, g: gB, b: bB } = hexToRgb(b.value);
  const luminanceA = calculateLuminance(rA, gA, bA);
  const luminanceB = calculateLuminance(rB, gB, bB);
  return luminanceB - luminanceA;
}

/**
 * Determines if a color is closer to black or white, but returns 'black' if closer to white and 'white' if closer to black.
 * @param color - The color in hex format (e.g., '#FFFFFF').
 * @returns 'black' if the color is closer to white, 'white' if closer to black.
 */
export function isColorCloserToBlackOrWhite(color: string): 'black' | 'white' {
  // Convert hex color to RGB
  const { r, g, b } = hexToRgb(color);

  // Calculate luminance
  const luminance = calculateLuminance(r, g, b);

  // Determine if the color is closer to black or white
  return luminance > 128 ? 'black' : 'white';
}

/**
 * Merges and deduplicates colors from an array of standalone colors and an array of color palettes.
 *
 * @param {Color[]} colors - A list of individual Color objects.
 * @param {ColorPalette[]} palettes - A list of ColorPalette objects containing colors.
 * @returns {Color[]} A deduplicated array of Color objects based on unique `id`.
 */
export function mergeUniqueColors(
  colors: Color[],
  palettes: ColorPalette[]
): Color[] {
  const allColors = [
    ...colors,
    ...palettes.flatMap((palette) => palette.colors),
  ];

  const uniqueMap = new Map<string, Color>();
  for (const color of allColors) {
    if (!uniqueMap.has(color.id)) {
      uniqueMap.set(color.id, color);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Checks whether all colors in the given palette are present in the provided array of colors.
 *
 * @param {ColorPalette} palette - The color palette to check.
 * @param {Color[]} availableColors - The array of available colors to compare against.
 * @returns {boolean} True if all colors in the palette are found in availableColors, false otherwise.
 */
export function arePaletteColorsAvailable(
  palette: ColorPalette,
  availableColors: Color[]
): boolean {
  const availableColorIds = new Set(availableColors.map((color) => color.id));
  return palette.colors.every((color) => availableColorIds.has(color.id));
}

/**
 * Returns a slightly brighter version of the given hex color.
 * @param hex - The hex color string, e.g. "#336699"
 * @param amount - How much to brighten (0-255), default is 20
 * @returns The brightened hex color string
 */
export function brightenHexColor(hex: string, amount = 20): string {
  // Remove the leading '#' if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

  // Parse r, g, b components
  const num = parseInt(cleanHex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Increase each by amount, capped at 255
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  // Convert back to hex with leading zeros if needed
  const brightened =
    '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

  return brightened;
}
