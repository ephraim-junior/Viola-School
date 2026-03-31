import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, check if supported in environment)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});
export const storage = getStorage(app);

export const isFirebaseConfigured = !!firebaseConfig.apiKey && 
                                   firebaseConfig.apiKey !== "TODO_KEYHERE" && 
                                   firebaseConfig.apiKey.startsWith("AIza");

if (!isFirebaseConfigured) {
  console.error("Firebase API Key is missing or invalid.");
}
