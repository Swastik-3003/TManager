// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCR8z_ypk4VfY2y0AnPSxpLTN88qff7MNo",
  authDomain: "taskmanager-6b1b0.firebaseapp.com",
  projectId: "taskmanager-6b1b0",
  storageBucket: "taskmanager-6b1b0.firebasestorage.app",
  messagingSenderId: "775464226486",
  appId: "1:775464226486:web:4c45f643ad3ccc6deca017",
  measurementId: "G-EVQEBX44T9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
