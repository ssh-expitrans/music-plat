// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgwQGhkc9JPP67ny_H7hs0QuwfANdgXJM",
  authDomain: "music-platform-3cd20.firebaseapp.com",
  projectId: "music-platform-3cd20",
  storageBucket: "music-platform-3cd20.appspot.com",
  messagingSenderId: "1055014994233",
  appId: "1:1055014994233:web:f64d0ce4a18c4ba59b68e8",
  measurementId: "G-F71G5BTQMV"
};

// Initialize Firebase app only once (important in Next.js since it reloads a lot)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, auth, analytics };
