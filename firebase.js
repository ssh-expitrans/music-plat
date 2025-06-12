import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Get this from Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBZj4CGlLYj_vW_Mpin7x5_mjX8Cf5zwW8",
  authDomain: "musicplatform0909.firebaseapp.com",
  projectId: "musicplatform0909",
  storageBucket: "musicplatform0909.firebasestorage.app",
  messagingSenderId: "929184075484",
  appId: "1:929184075484:web:95b0d6d4d72085d1afae19"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);