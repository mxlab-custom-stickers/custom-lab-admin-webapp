// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD4b2DkVs24ml1se_TcYcGoobFE77OOjiI',
  authDomain: 'custom-lab-dev.firebaseapp.com',
  projectId: 'custom-lab-dev',
  storageBucket: 'custom-lab-dev.firebasestorage.app',
  messagingSenderId: '779116112345',
  appId: '1:779116112345:web:133b8ae93949fc948711c8',
  measurementId: 'G-YF948PLTLT',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
