import { pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "DISABLED", "INVITED"]);
export const employeeStatusEnum = pgEnum("employee_status", ["ACTIVE", "INACTIVE", "ARCHIVED"]);
export const permissionRiskEnum = pgEnum("permission_risk", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const scopeTypeEnum = pgEnum("scope_type", ["SELF", "TEAM", "ALL"]);
export const schedulePeriodStatusEnum = pgEnum("schedule_period_status", ["OPEN", "CLOSED", "ARCHIVED"]);
export const scheduleVersionStateEnum = pgEnum("schedule_version_state", [
  "DRAFT",
  "PUBLISHED",
  "SUPERSEDED",
  "ARCHIVED",
]);
export const primaryWorkStateEnum = pgEnum("primary_work_state", ["SHIFT", "OFF"]);
export const assignmentSourceEnum = pgEnum("assignment_source", [
  "MANUAL",
  "COPY",
  "TEMPLATE",
  "CORRECTION",
]);
export const exceptionTypeEnum = pgEnum("exception_type", [
  "LEAVE",
  "SICK",
  "PERMISSION",
  "TRAINING",
  "BUSINESS_DUTY",
  "UNAVAILABLE",
  "EMERGENCY",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "SUPERSEDED",
]);
export const exceptionEffectEnum = pgEnum("exception_effect", [
  "REPLACES_WORK_STATE",
  "NON_INCENTIVE_ELIGIBLE",
  "COVERAGE_REMOVAL",
]);
export const payrollStatusEnum = pgEnum("payroll_status", ["OPEN", "CALCULATED", "FINALIZED", "LOCKED"]);
export const payrollDirectionEnum = pgEnum("payroll_direction", ["EARNING", "DEDUCTION"]);
export const adjustmentStatusEnum = pgEnum("adjustment_status", ["ACTIVE", "VOIDED"]);
export const holidayTypeEnum = pgEnum("holiday_type", ["PUBLIC_HOLIDAY", "COMPANY", "OTHER"]);
export const settingValueTypeEnum = pgEnum("setting_value_type", ["STRING", "NUMBER", "BOOLEAN", "JSON"]);
export const auditActorTypeEnum = pgEnum("audit_actor_type", ["USER", "SYSTEM"]);
export const auditSeverityEnum = pgEnum("audit_severity", ["INFO", "NOTICE", "WARNING", "CRITICAL"]);
