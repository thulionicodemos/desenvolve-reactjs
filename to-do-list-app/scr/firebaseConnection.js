// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFg0EB6TOPH_uirunT2TA-46FmnSdSI0c",
  authDomain: "app-react-ec8ce.firebaseapp.com",
  projectId: "app-react-ec8ce",
  storageBucket: "app-react-ec8ce.firebasestorage.app",
  messagingSenderId: "570752258924",
  appId: "1:570752258924:web:a3b30bc8de3e732afb9949",
  measurementId: "G-Z1LNLKEHPN"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);

export { db, auth, analytics };