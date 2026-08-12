export const firestoreCollections = {
  users: "users",
  employees: "employees",
  teams: "teams",
  roles: "roles",
  permissions: "permissions",
  userRoles: "userRoles",
  shiftTypes: "shiftTypes",
  shiftTypeVersions: "shiftTypeVersions",
  schedulePeriods: "schedulePeriods",
  scheduleVersions: "scheduleVersions",
  shiftAssignments: "shiftAssignments",
  requests: "requests",
  workforceExceptions: "workforceExceptions",
  replacementAssignments: "replacementAssignments",
  shiftSwapRequests: "shiftSwapRequests",
  overtimeRecords: "overtimeRecords",
  employeeSalaryVersions: "employeeSalaryVersions",
  shiftIncentiveVersions: "shiftIncentiveVersions",
  payrollPeriods: "payrollPeriods",
  payrollRecords: "payrollRecords",
  payrollRevisions: "payrollRevisions",
  payrollItems: "payrollItems",
  payrollAdjustments: "payrollAdjustments",
  holidays: "holidays",
  systemSettings: "systemSettings",
  notifications: "notifications",
  auditEvents: "auditEvents",
  idempotencyKeys: "idempotencyKeys",
} as const;

export type FirestoreCollectionName = (typeof firestoreCollections)[keyof typeof firestoreCollections];

export interface VersionedDocument {
  rowVersion: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface EffectiveRange {
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface EmployeeDocument extends VersionedDocument {
  employeeCode: string;
  displayName: string;
  teamId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  userId: string | null;
  joinDate: string;
}

export interface ShiftTypeDocument extends VersionedDocument {
  code: "S1" | "S2" | "S3";
  isActive: boolean;
}

export interface ShiftTypeVersionDocument extends EffectiveRange {
  shiftTypeId: string;
  name: string;
  shortName: string;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
  displayOrder: number;
}

export interface ScheduleVersionDocument extends VersionedDocument {
  schedulePeriodId: string;
  revisionNumber: number;
  state: "DRAFT" | "PUBLISHED" | "SUPERSEDED" | "ARCHIVED";
  publishedAt: unknown | null;
}

export interface ShiftAssignmentDocument extends VersionedDocument {
  schedulePeriodId: string;
  scheduleVersionId: string;
  employeeId: string;
  workDate: string;
  primaryState: "SHIFT" | "OFF";
  shiftTypeId: string | null;
  shiftTypeVersionId: string | null;
  sourceType: "MANUAL" | "COPY" | "TEMPLATE" | "CORRECTION";
}

export interface PayrollRecordDocument extends VersionedDocument {
  payrollPeriodId: string;
  employeeId: string;
  status: "OPEN" | "CALCULATED" | "FINALIZED" | "LOCKED";
  currentRevisionId: string | null;
  isDirty: boolean;
  calculatedTakeHomePay: number;
}

export interface AuditEventDocument {
  occurredAt: unknown;
  actorUserId: string | null;
  actorType: "USER" | "SYSTEM";
  severity: "INFO" | "NOTICE" | "WARNING" | "CRITICAL";
  action: string;
  entityType: string;
  entityId: string;
  reason: string | null;
  beforeSnapshot: Record<string, unknown> | null;
  afterSnapshot: Record<string, unknown> | null;
  correlationId: string | null;
}
