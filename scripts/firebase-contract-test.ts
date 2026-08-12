import assert from "node:assert/strict";

import { getAdminFirestore } from "../src/firebase/admin";
import { firestoreCollections } from "../src/firebase/model";
import {
  createImmutableDocument,
  updateWithExpectedVersion,
} from "../src/firebase/repository-guards";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("firebase:contract requires the Firestore emulator.");
}

const db = getAdminFirestore();

const employees = await db.collection(firestoreCollections.employees).get();
const shifts = await db.collection(firestoreCollections.shiftTypes).get();
assert.equal(employees.size, 3, "deterministic seed must create three employees");
assert.equal(shifts.size, 3, "deterministic seed must create three shift identities");

const timezone = await db
  .collection(firestoreCollections.systemSettings)
  .doc("default_timezone")
  .get();
assert.equal(timezone.data()?.value, "Asia/Jakarta");

const immutableRef = db.collection(firestoreCollections.auditEvents).doc("f04r-contract-audit");
const immutablePayload = {
  occurredAt: new Date("2026-08-01T00:00:00.000Z"),
  actorUserId: null,
  actorType: "SYSTEM",
  severity: "INFO",
  action: "f04r.contract",
  entityType: "foundation",
  entityId: "firebase",
  reason: "Firebase foundation contract",
  beforeSnapshot: null,
  afterSnapshot: { provider: "firebase" },
  correlationId: "f04r-contract",
};

await createImmutableDocument(immutableRef, immutablePayload);
await assert.rejects(
  () => createImmutableDocument(immutableRef, immutablePayload),
  /already exists|6 ALREADY_EXISTS/i,
  "append-oriented helper must not overwrite an existing historical document",
);

const versionedRef = db.collection(firestoreCollections.teams).doc("noc");
const nextVersion = await updateWithExpectedVersion(db, versionedRef, 1, {
  name: "Network Operations Center",
  updatedAt: new Date("2026-08-02T00:00:00.000Z"),
});
assert.equal(nextVersion, 2);
await assert.rejects(
  () => updateWithExpectedVersion(db, versionedRef, 1, { name: "Stale update" }),
  /version conflict/i,
  "stale optimistic mutation must fail",
);

console.log("F04R Firebase contract tests passed.");
