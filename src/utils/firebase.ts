import {getFirestore} from "@firebase/firestore";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "gogobar-737d2.firebaseapp.com",
  projectId: "gogobar-737d2",
  storageBucket: "gogobar-737d2.appspot.com",
  messagingSenderId: "848158639971",
  appId: "1:848158639971:web:3edcd4a98d0700d988f556",
  measurementId: "G-QSJV8JCLC5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
