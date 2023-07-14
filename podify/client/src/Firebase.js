// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtYqGu50vozjOMQQFDyifbvUI27eP_BGk",
  authDomain: "podcast-app-94680.firebaseapp.com",
  projectId: "podcast-app-94680",
  storageBucket: "podcast-app-94680.appspot.com",
  messagingSenderId: "666142251306",
  appId: "1:666142251306:web:4fb135b479614519cc6653"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)