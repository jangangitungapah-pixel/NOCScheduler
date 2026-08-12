import type { DocumentData, DocumentReference, Firestore } from "firebase-admin/firestore";

import { assertPositiveRowVersion } from "./invariants";

export async function createImmutableDocument(reference: DocumentReference, data: DocumentData) {
  await reference.create(data);
}

export async function updateWithExpectedVersion(
  firestore: Firestore,
  reference: DocumentReference,
  expectedVersion: number,
  patch: DocumentData,
) {
  assertPositiveRowVersion(expectedVersion);

  return firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("Versioned document does not exist.");

    const current = snapshot.data();
    if (!current || current.rowVersion !== expectedVersion) {
      throw new Error("Version conflict.");
    }

    transaction.update(reference, {
      ...patch,
      rowVersion: expectedVersion + 1,
    });

    return expectedVersion + 1;
  });
}
