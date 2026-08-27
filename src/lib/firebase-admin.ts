import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let dbInstance: any = null;

try {
  if (!getApps().length) {
    initializeApp({
      projectId: firebaseConfig.projectId || 'gen-lang-client-0965724398',
    });
  }
  dbInstance = getFirestore(firebaseConfig.firestoreDatabaseId || '(default)');
} catch (err) {
  console.warn('[Firebase Admin] Initialization warning or missing credentials, using resilient fallback:', err);
}

export const adminDb = dbInstance || {
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: false, data: () => ({}) }),
      set: async () => {},
      update: async () => {},
    }),
    where: () => ({
      limit: () => ({
        get: async () => ({ empty: true, docs: [] }),
      }),
    }),
  }),
};
