// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD93wAdVJjwX3ZUfx0GR0co5bqt1I7so48",
  authDomain: "vue-dtfood.firebaseapp.com",
  databaseURL: "https://vue-dtfood-default-rtdb.firebaseio.com",
  projectId: "vue-dtfood",
  storageBucket: "vue-dtfood.appspot.com",
  messagingSenderId: "692286664670",
  appId: "1:692286664670:web:5910b22edc60cfc5aa374f",
  measurementId: "G-GYYG9RZ96H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
