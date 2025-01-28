import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import auth
import { getFirestore } from "firebase/firestore";  // If you're using Firestore

// Your Firebase config (replace with your actual Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyDQEqH8innfYBF6aQCLNEMazLNTdWw2_so",
  authDomain: "hackthaon-c9cd6.firebaseapp.com",
  databaseURL: "https://hackthaon-c9cd6-default-rtdb.firebaseio.com",
  projectId: "hackthaon-c9cd6",
  storageBucket: "hackthaon-c9cd6.firebasestorage.app",
  messagingSenderId: "683334858738",
  appId: "1:683334858738:web:44fec19ec881e2e080dd6b",
  measurementId: "G-KD8RWZ8PKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
