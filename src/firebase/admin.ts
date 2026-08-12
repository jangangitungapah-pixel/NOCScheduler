import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { getFirebaseProjectId } from "./config";

export function getFirebaseAdminApp() {
  return getApps().length > 0 ? getApp() : initializeApp({ projectId: getFirebaseProjectId() });
}

export function getAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}
