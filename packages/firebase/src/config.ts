import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD4b2DkVs24ml1se_TcYcGoobFE77OOjiI',
  authDomain: 'custom-lab-dev.firebaseapp.com',
  projectId: 'custom-lab-dev',
  storageBucket: 'custom-lab-dev.firebasestorage.app',
  messagingSenderId: '779116112345',
  appId: '1:779116112345:web:133b8ae93949fc948711c8',
  measurementId: 'G-YF948PLTLT',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
