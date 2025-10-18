// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWGmSTd2qiic7NmYOKlZ3tV-FGfBloe0o",
  authDomain: "handbag-api.firebaseapp.com",
  projectId: "handbag-api",
  storageBucket: "handbag-api.firebasestorage.app",
  messagingSenderId: "628322443419",
  appId: "1:628322443419:web:1cc816260e7377cfe2663e",
  measurementId: "G-J4NTS0HVYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('6LdScsorAAAAACBWq953SAtm0xcFiOzpHzT-ScDM'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });

export const db = getFirestore(app);