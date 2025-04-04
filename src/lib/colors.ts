import { Color } from '@/models/color.ts';

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
