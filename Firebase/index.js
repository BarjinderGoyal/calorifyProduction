// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDshUI0g6PjjAeADDchj2RCBEV81Qkwj9Q",
  authDomain: "calorify-9a6ee.firebaseapp.com",
  projectId: "calorify-9a6ee",
  storageBucket: "calorify-9a6ee.appspot.com",
  messagingSenderId: "14057899659",
  appId: "1:14057899659:web:dca05496635407f798368e",
  measurementId: "G-S033P9HKM7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
