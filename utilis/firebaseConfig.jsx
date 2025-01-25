import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import auth
import { getFirestore } from "firebase/firestore";  // If you're using Firestore

// Your Firebase config (replace with your actual Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyCAvVbZEoYGG_XSlDBsjiP5a--T-TlIzj8",
    authDomain: "shoessss-fee20.firebaseapp.com",
    databaseURL: "https://shoessss-fee20-default-rtdb.firebaseio.com",
    projectId: "shoessss-fee20",
    storageBucket: "shoessss-fee20.firebasestorage.app",
    messagingSenderId: "269779273584",
    appId: "1:269779273584:web:23dfce7bdf8d63a26131b5",
    measurementId: "G-LF7DK2G69Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
