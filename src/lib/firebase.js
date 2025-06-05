// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgwQGhkc9JPP67ny_H7hs0QuwfANdgXJM",
  authDomain: "music-platform-3cd20.firebaseapp.com",
  projectId: "music-platform-3cd20",
  storageBucket: "music-platform-3cd20.firebasestorage.app",
  messagingSenderId: "1055014994233",
  appId: "1:1055014994233:web:b4bdfb442dd9fe649b68e8",
  measurementId: "G-1W3ET1Q5EN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);