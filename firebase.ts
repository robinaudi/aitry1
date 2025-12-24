
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configured with the user's specific project details
const firebaseConfig = {
  apiKey: "AIzaSyDMoGafZftKams9xV1ZpQy9I9Q6RDV4r2o",
  authDomain: "robin-portfolio-app.firebaseapp.com",
  projectId: "robin-portfolio-app",
  storageBucket: "robin-portfolio-app.firebasestorage.app",
  messagingSenderId: "78343247672",
  appId: "1:78343247672:web:973969e9406713343053cd",
  measurementId: "G-43B2GGEQB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;