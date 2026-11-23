import { getApp, getApps, initializeApp } from 'firebase/app'
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig'

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Add the required VITE_FIREBASE_* values.')
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}
