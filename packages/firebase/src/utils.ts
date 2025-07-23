import type { Timestamp } from 'firebase/firestore';

export function timestampToISOString(timestamp?: Timestamp | null): string {
  if (!timestamp) return '';
  try {
    return timestamp.toDate().toISOString();
  } catch {
    return '';
  }
}
