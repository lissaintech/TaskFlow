// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEf1MDjVJZzeQw4sOokaTuKyWbiR84xPU",
  authDomain: "taskflow-prod-ed8a6.firebaseapp.com",
  projectId: "taskflow-prod-ed8a6",
  storageBucket: "Ytaskflow-prod-ed8a6.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:834507076446:web:e4bcf8555154507f1ed5cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
