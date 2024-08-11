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

console.log(
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
);

// const firebaseConfig = {
//   apiKey: `${FIREBASE_API_KEY}`,
//   authDomain: `${FIREBASE_AUTH_DOMAIN}`,
//   projectId: `${FIREBASE_PROJECT_ID}`,
//   storageBucket: `${FIREBASE_STORAGE_BUCKET}`,
//   messagingSenderId: `${FIREBASE_MESAGING_SENDER_ID}`,
//   appId: `${FIREBASE_APP_ID}`,
//   measurementId: `${FIREBASE_MEASUREMENT_ID}`,
// };

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: FIREBASE_MESAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
//   measurementId: FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDAXX2RqYz7vSMz07C7DcL-qNFXqpopjdA",
  authDomain: "calorify-6de29.firebaseapp.com",
  projectId: "calorify-6de29",
  storageBucket: "calorify-6de29.appspot.com",
  messagingSenderId: "1003689514928",
  appId: "1:1003689514928:web:7c426b48d0da2fc4612875",
  measurementId: "G-0QBBS7CG18",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
isSupported().then((yes) => {
  if (yes) {
    const analytics = getAnalytics(app);
  }
});

export const auth = getAuth(app);
