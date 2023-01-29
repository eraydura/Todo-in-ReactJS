// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD2PoMO2r61mlKImD0aG_cTSN2mHwzTqA",
  authDomain: "todo-b8e25.firebaseapp.com",
  databaseURL: "https://todo-b8e25-default-rtdb.firebaseio.com",
  projectId: "todo-b8e25",
  storageBucket: "todo-b8e25.appspot.com",
  messagingSenderId: "1082634141430",
  appId: "1:1082634141430:web:91fd49f59527d430ffb6d7",
  measurementId: "G-T4E1LVW8B9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage(app);