import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCDgl3HNIkFiFmUvd6o4ORWhFr_v4K6Kvk',
  authDomain: 'ecommerce-terreno-4acba.firebaseapp.com',
  projectId: 'ecommerce-terreno-4acba',
  storageBucket: 'ecommerce-terreno-4acba.firebasestorage.app',
  messagingSenderId: '134335381103',
  appId: '1:134335381103:web:f6cc2c3aa37365bc99579a',
  measurementId: 'G-2HNMDF0P35'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

analyticsSupported().then((supported) => {
  if (supported) getAnalytics(app)
})

export async function ensureAnonymousAuth() {
  if (auth.currentUser) return auth.currentUser
  const cred = await signInAnonymously(auth)
  return cred.user
}

