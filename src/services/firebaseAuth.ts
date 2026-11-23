import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseApp } from './firebaseApp'

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()
  await auth.authStateReady()
  return auth.currentUser ?? (await signInWithPopup(auth, new GoogleAuthProvider())).user
}

export async function signOutFromGoogle() {
  await signOut(getFirebaseAuth())
}
