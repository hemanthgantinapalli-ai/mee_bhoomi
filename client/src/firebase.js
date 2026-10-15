import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA51-tYPSBsQVji4x3aPEfQSkqXJgqRDK0",
  authDomain: "meebhoomi-5a7a7.firebaseapp.com",
  projectId: "meebhoomi-5a7a7",
  storageBucket: "meebhoomi-5a7a7.firebasestorage.app",
  messagingSenderId: "978775576820",
  appId: "1:978775576820:web:02c8301b342a7b644a4ea1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
