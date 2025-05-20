import { storage } from '@/lib/firebase/firebase.ts';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
