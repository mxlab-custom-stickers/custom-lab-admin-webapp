import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?';

  // Remove non-letter characters and extra spaces
  const cleaned = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-ZÀ-ÿ]/g, '')) // Keep accented letters
    .filter(Boolean); // Remove empty strings

  if (cleaned.length === 0) return '?';

  const initials = cleaned
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
  return initials || '?';
}

export function filterMap<K, V>(
  map: Map<K, V>,
  predicate: (key: K, value: V) => boolean
): Map<K, V> {
  return new Map(Array.from(map.entries()).filter(([key, value]) => predicate(key, value)));
}

/**
 * Sanitizes a numeric input string by:
 * - Allowing only digits and an optional leading minus sign (`-`)
 * - Removing any other characters
 * - Truncating at the first decimal point (`.`) or comma (`,`)
 * - Parsing the cleaned string into an integer
 * - Clamping the parsed number between optional min and max bounds
 *
 * Returns `undefined` if the input is not a valid integer number (e.g., empty string or just "-").
 *
 * @param {string} value - The raw input string to sanitize.
 * @param {{ min?: number; max?: number }} [opts] - Optional clamping boundaries.
 * @param {number} [opts.min] - Minimum allowed value (inclusive).
 * @param {number} [opts.max] - Maximum allowed value (inclusive).
 * @returns {number | undefined} The sanitized and clamped integer, or `undefined` if invalid.
 */
export function sanitizeNumericInput(
  value: string,
  opts?: { min?: number; max?: number }
): number | undefined {
  // Allow leading "-" and digits, remove other characters
  let cleaned = value.replace(/[^\d\-,.]/g, '');

  // Handle a single leading "-" for negative numbers
  const isNegative = cleaned.startsWith('-');
  cleaned = cleaned.replace(/-/g, '');
  if (isNegative) cleaned = '-' + cleaned;

  // Truncate at the first decimal point or comma
  cleaned = cleaned.split(/[.,]/)[0];

  // If input is just "-" or empty, it's not a valid number yet
  if (cleaned === '-' || cleaned === '') return undefined;

  const parsed = parseInt(cleaned, 10);
  if (isNaN(parsed)) return undefined;

  let num = parsed;
  if (opts?.min !== undefined) num = Math.max(opts.min, num);
  if (opts?.max !== undefined) num = Math.min(opts.max, num);

  return num;
}

export function serializeNameToId(name: string): string {
  return name
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^a-z0-9\-]/g, '') // remove non-alphanumeric/hyphen
    .replace(/\-+/g, '-'); // collapse multiple hyphens
}

export function serializeFilenameToName(filename: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  return nameWithoutExt
    .replace(/[_\-]+/g, ' ') // Replace underscores and hyphens with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .replace(/\s*\(.*?\)\s*/g, '') // Remove things in parentheses
    .replace(/\b(v|ver|final|copy)[0-9]*\b/gi, '') // Remove versioning hints
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
}
