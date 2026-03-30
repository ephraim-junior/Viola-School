import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Placeholder config - user will need to provide real values if set_up_firebase fails
// In AI Studio, this is usually provided via firebase-applet-config.json
const firebaseConfig = {
  apiKey: "TODO_API_KEY",
  authDomain: "TODO_AUTH_DOMAIN",
  projectId: "TODO_PROJECT_ID",
  storageBucket: "TODO_STORAGE_BUCKET",
  messagingSenderId: "TODO_MESSAGING_SENDER_ID",
  appId: "TODO_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
