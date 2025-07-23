import * as firebase from 'firebase/auth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { auth } from './config';

export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const { user } = await firebase.createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await firebase.updateProfile(user, { displayName });
  }
  return user;
}

export async function signInWithEmailAndPassword(email: string, password: string): Promise<User> {
  const { user } = await firebase.signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function sendEmailVerification(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Cannot send verification email: no user is currently signed in.');
  }
  await firebase.sendEmailVerification(auth.currentUser);
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  await firebase.sendPasswordResetEmail(auth, email);
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

export async function signOut(): Promise<void> {
  return firebase.signOut(auth);
}

export const listenToAuthChanges = (
  callback: Parameters<typeof onAuthStateChanged>[1],
  errorCallback?: Parameters<typeof onAuthStateChanged>[2]
) => {
  return onAuthStateChanged(auth, callback, errorCallback);
};
