import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAztdBLSed0sbErD67FRPANS1mG24moDl8",
  authDomain: "hello-2b182.firebaseapp.com",
  projectId: "hello-2b182",
  storageBucket: "hello-2b182.firebasestorage.app",
  messagingSenderId: "493573441718",
  appId: "1:493573441718:web:2f8fb354fc5f986201fe17",
  measurementId: "G-WQ4VRD120Q"
  };
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
