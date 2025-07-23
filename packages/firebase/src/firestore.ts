import { App, Font, Template } from '@clab/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { timestampToISOString } from './utils';

export async function getUserApps(userId: string): Promise<App[]> {
  const membershipsRef = collection(db, 'memberships');
  const userMembershipsQuery = query(membershipsRef, where('userId', '==', userId));
  const userMembershipSnaps = await getDocs(userMembershipsQuery);

  const appIds = userMembershipSnaps.docs.map((doc) => doc.data().appId);

  const apps: App[] = [];

  for (const appId of appIds) {
    const appRef = doc(db, 'apps', appId);
    const appMembershipsQuery = query(membershipsRef, where('appId', '==', appId));
    const appMembershipSnaps = await getDocs(appMembershipsQuery);

    const appSnap = await getDoc(appRef);
    if (appSnap.exists()) {
      const data = appSnap.data();
      apps.push({
        id: appSnap.id,
        ...(data as Omit<App, 'id'>),
        createdAt: timestampToISOString(data.createdAt as Timestamp),
        memberships: appMembershipSnaps.docs.map((doc) => ({
          userId: doc.data().userId,
          role: doc.data().role,
          addedAt: timestampToISOString(doc.data().addedAt as Timestamp),
        })),
      });
    }
  }

  return apps;
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
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

export async function addFont(font: Font) {
  await setDoc(doc(db, 'fonts', font.id), font);
}

export async function getFontsByAppId(appId: string): Promise<Font[]> {
  const fontsRef = collection(db, 'fonts');
  const q = query(fontsRef, where('appId', '==', appId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Font);
}

export async function getFontById(id: string): Promise<Font | undefined> {
  const snapshot = await getDoc(doc(db, 'fonts', id));
  return snapshot.exists() ? (snapshot.data() as Font) : undefined;
}
