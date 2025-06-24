import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export interface FileNode {
  name: string;
  url: string;
}

export interface FolderNode {
  name: string;
  fullPath: string;
}

export async function listFiles(
  path: string
): Promise<{ files: FileNode[]; folders: FolderNode[] }> {
  const storageRef = ref(storage, path);
  const listResult = await listAll(storageRef);

  const files: FileNode[] = [];

  for (const item of listResult.items) {
    const url = await getDownloadURL(item);
    files.push({
      name: item.name,
      url: url,
    });
  }

  const folders: FolderNode[] = listResult.prefixes.map((prefix) => ({
    name: prefix.name,
    fullPath: prefix.fullPath, // Full path of the folder
  }));

  return { files, folders };
}
