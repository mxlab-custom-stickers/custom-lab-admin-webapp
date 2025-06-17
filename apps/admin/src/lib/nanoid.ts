import { customAlphabet } from 'nanoid';

// Define the alphabet to include only letters and digits
const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet);

/**
 * Generates a unique ID like firestore document ID.
 */
export function generateId() {
  return nanoid();
}
