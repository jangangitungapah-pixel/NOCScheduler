import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import { getFirebaseWebConfig, shouldUseFirebaseEmulators } from "./config";

let emulatorsConnected = false;

export function getFirebaseClientServices() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client services may only be initialized in the browser.");
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseWebConfig());
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (shouldUseFirebaseEmulators() && !emulatorsConnected) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
    emulatorsConnected = true;
  }

  return { app, auth, firestore };
}
