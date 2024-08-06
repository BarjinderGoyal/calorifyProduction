// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDtHEKLQfYxUFRCP6Yu3bSiCN7KI0BBXns",
//   authDomain: "calorify-89e8e.firebaseapp.com",
//   projectId: "calorify-89e8e",
//   storageBucket: "calorify-89e8e.appspot.com",
//   messagingSenderId: "254552787517",
//   appId: "1:254552787517:web:c02a648cf52070a7c1f854",
//   measurementId: "G-T7W337KNTD",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// isSupported().then((yes) => {
//   if (yes) {
//     const analytics = getAnalytics(app);
//   }
// });

// export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
  apiKey: `${FIREBASE_API_KEY}`,
  authDomain: `${FIREBASE_AUTH_DOMAIN}`,
  projectId: `${FIREBASE_PROJECT_ID}`,
  storageBucket: `${FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${FIREBASE_MESAGING_SENDER_ID}`,
  appId: `${FIREBASE_APP_ID}`,
  measurementId: `${FIREBASE_MEASUREMENT_ID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
isSupported().then((yes) => {
  if (yes) {
    const analytics = getAnalytics(app);
  }
});

export const auth = getAuth(app);
