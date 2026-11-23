import type { User } from 'firebase/auth'
import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import type { BuilderState } from '@/types/builder'
import { getFirebaseApp } from './firebaseApp'

export async function loadResumeForUser(user: User): Promise<unknown | null> {
  const db = getFirestore(getFirebaseApp())
  const resumeRef = doc(db, 'users', user.uid, 'resumes', 'default')
  const snapshot = await getDoc(resumeRef)

  if (!snapshot.exists()) return null
  const document = snapshot.data()
  return document.data ?? (document.header || document.p || document.exp ? document : null)
}

export async function saveResumeForUser(user: User, state: BuilderState) {
  const db = getFirestore(getFirebaseApp())
  const resumeRef = doc(db, 'users', user.uid, 'resumes', 'default')
  const resumeData = JSON.parse(JSON.stringify(state)) as BuilderState

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(resumeRef)
    transaction.set(resumeRef, {
      title: state.header.name.trim() || 'My resume',
      data: resumeData,
      createdAt: snapshot.exists() ? snapshot.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
}
