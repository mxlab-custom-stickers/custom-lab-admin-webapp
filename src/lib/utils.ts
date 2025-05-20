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
