import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '@/firebaseConfig';

const firebaseApp = (() => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
})();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
