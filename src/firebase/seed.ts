import { Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "./admin";
import { firestoreCollections } from "./model";

const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("firebase:seed is emulator-only. FIRESTORE_EMULATOR_HOST is not set.");
}

if (!projectId?.startsWith("demo-")) {
  throw new Error("firebase:seed requires a demo-* Firebase project ID.");
}

const db = getAdminFirestore();
const createdAt = Timestamp.fromDate(new Date("2026-08-01T00:00:00.000Z"));

const batch = db.batch();

batch.set(db.collection(firestoreCollections.teams).doc("noc"), {
  code: "NOC",
  name: "Network Operations Center",
  isActive: true,
  rowVersion: 1,
  createdAt,
  updatedAt: createdAt,
});

for (const role of [
  { id: "administrator", code: "ADMINISTRATOR", name: "Administrator" },
  { id: "scheduler", code: "SCHEDULER", name: "Scheduler / Supervisor" },
  { id: "member", code: "NOC_MEMBER", name: "NOC Member" },
]) {
  batch.set(db.collection(firestoreCollections.roles).doc(role.id), {
    ...role,
    isSystemRole: true,
    isActive: true,
    rowVersion: 1,
    createdAt,
    updatedAt: createdAt,
  });
}

for (const permission of [
  { id: "schedule.read", domain: "schedule", riskLevel: "LOW" },
  { id: "schedule.manage", domain: "schedule", riskLevel: "HIGH" },
  { id: "payroll.read", domain: "payroll", riskLevel: "MEDIUM" },
  { id: "access.manage", domain: "access", riskLevel: "CRITICAL" },
]) {
  batch.set(db.collection(firestoreCollections.permissions).doc(permission.id), {
    code: permission.id,
    domain: permission.domain,
    riskLevel: permission.riskLevel,
    createdAt,
  });
}

const users = [
  ["uid-admin", "NOC Administrator", "admin@nocscheduler.local", "emp-admin", "NOC-001"],
  ["uid-scheduler", "NOC Scheduler", "scheduler@nocscheduler.local", "emp-scheduler", "NOC-002"],
  ["uid-member", "NOC Member", "member@nocscheduler.local", "emp-member", "NOC-003"],
] as const;

for (const [userId, displayName, email, employeeId, employeeCode] of users) {
  batch.set(db.collection(firestoreCollections.users).doc(userId), {
    displayName,
    email,
    emailNormalized: email,
    status: "ACTIVE",
    rowVersion: 1,
    createdAt,
    updatedAt: createdAt,
  });

  batch.set(db.collection(firestoreCollections.employees).doc(employeeId), {
    employeeCode,
    displayName,
    teamId: "noc",
    status: "ACTIVE",
    userId,
    joinDate: "2026-01-01",
    rowVersion: 1,
    createdAt,
    updatedAt: createdAt,
  });
}

for (const shift of [
  { id: "shift-s1", code: "S1", versionId: "shift-s1-v1", name: "Shift 1 / Pagi", start: "07:00", end: "15:00", crossesMidnight: false, order: 1 },
  { id: "shift-s2", code: "S2", versionId: "shift-s2-v1", name: "Shift 2 / Siang", start: "15:00", end: "23:00", crossesMidnight: false, order: 2 },
  { id: "shift-s3", code: "S3", versionId: "shift-s3-v1", name: "Shift 3 / Malam", start: "23:00", end: "07:00", crossesMidnight: true, order: 3 },
]) {
  batch.set(db.collection(firestoreCollections.shiftTypes).doc(shift.id), {
    code: shift.code,
    isActive: true,
    rowVersion: 1,
    createdAt,
    updatedAt: createdAt,
  });

  batch.set(db.collection(firestoreCollections.shiftTypeVersions).doc(shift.versionId), {
    shiftTypeId: shift.id,
    name: shift.name,
    shortName: shift.code,
    startTime: shift.start,
    endTime: shift.end,
    crossesMidnight: shift.crossesMidnight,
    displayOrder: shift.order,
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    createdAt,
  });
}

batch.set(db.collection(firestoreCollections.systemSettings).doc("default_timezone"), {
  key: "default_timezone",
  value: "Asia/Jakarta",
  valueType: "STRING",
  rowVersion: 1,
  createdAt,
  updatedAt: createdAt,
});

batch.set(db.collection(firestoreCollections.systemSettings).doc("default_currency"), {
  key: "default_currency",
  value: "IDR",
  valueType: "STRING",
  rowVersion: 1,
  createdAt,
  updatedAt: createdAt,
});

await batch.commit();
console.log("Firebase demo seed completed.");
