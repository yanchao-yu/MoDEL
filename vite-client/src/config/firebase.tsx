// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWuOHPsfkhpkta6Q2uKvGKi80SdTpAwaA",
  authDomain: "reactjs-dnd-assignment-fc5e9.firebaseapp.com",
  projectId: "reactjs-dnd-assignment-fc5e9",
  storageBucket: "reactjs-dnd-assignment-fc5e9.appspot.com",
  messagingSenderId: "868040460326",
  appId: "1:868040460326:web:3764b2b2c8889e11edbee7",
  measurementId: "G-GYGZLBK4KZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
