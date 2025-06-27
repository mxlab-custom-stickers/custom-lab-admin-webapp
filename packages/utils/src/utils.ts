import { clsx, type ClassValue } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the alphabet to include only letters and digits
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet);

/**
 * Generates a unique ID like firestore document ID.
 */
export function generateId() {
  return nanoid();
}

export function hasProperties<T extends object, K extends keyof any>(
  obj: T,
  props: K[]
): obj is T & Record<K, unknown> {
  return props.every((prop) => prop in obj);
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
