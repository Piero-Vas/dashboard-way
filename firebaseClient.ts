import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDM21AJnL8ewQJL5eBo5tCcbHVBDmEXfZI",
  authDomain: "wayapps-81989.firebaseapp.com",
  projectId: "wayapps-81989",
  storageBucket: "wayapps-81989.firebasestorage.app",
  messagingSenderId: "530130091566",
  appId: "1:530130091566:web:c05efda8ef5f390d8ee9bf",
  measurementId: "G-K007K21KFQ",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
