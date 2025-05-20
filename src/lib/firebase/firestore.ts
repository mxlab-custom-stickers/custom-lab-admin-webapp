import { db } from '@/lib/firebase/firebase.ts';
import { App } from '@/models/settings.ts';
import { Template } from '@/models/template.ts';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

export async function getApps(): Promise<App[]> {
  const querySnapshot = await getDocs(collection(db, 'apps'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as App[];
}

export async function getTemplateById(
  id: string
): Promise<Template | undefined> {
  const snapshot = await getDoc(doc(db, 'templates', id));
  return snapshot.exists() ? (snapshot.data() as Template) : undefined;
}

export async function addTemplate(template: Template) {
  await setDoc(doc(db, 'templates', template.id), template);
}

export async function updateTemplate(template: Template) {
  await updateDoc(doc(db, 'templates', template.id), { ...template });
}

export async function getTemplatesByAppId(appId: string): Promise<Template[]> {
  const templatesRef = collection(db, 'templates');
  const q = query(templatesRef, where('appId', '==', appId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Template);
}
