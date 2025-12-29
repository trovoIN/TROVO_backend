import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { config } from './config.js'

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    })

export const db = getFirestore(app)
