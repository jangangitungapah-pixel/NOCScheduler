import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { exceptionEffectEnum, exceptionTypeEnum, requestStatusEnum } from "./enums";
import { employees, users } from "./identity";
import { scheduleRequests } from "./requests";
import { shiftAssignments } from "./scheduling";

export const workforceExceptions = pgTable(
  "workforce_exceptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => scheduleRequests.id, { onDelete: "restrict" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    exceptionType: exceptionTypeEnum("exception_type").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    reason: text("reason").notNull(),
    requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("workforce_exceptions_request_uq").on(table.requestId),
    index("workforce_exceptions_employee_dates_idx").on(
      table.employeeId,
      table.startDate,
      table.endDate,
    ),
    index("workforce_exceptions_status_idx").on(table.status),
    check("workforce_exceptions_date_range_valid", sql`${table.endDate} >= ${table.startDate}`),
    check("workforce_exceptions_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const exceptionAssignmentLinks = pgTable(
  "exception_assignment_links",
  {
    exceptionId: uuid("exception_id")
      .notNull()
      .references(() => workforceExceptions.id, { onDelete: "restrict" }),
    shiftAssignmentId: uuid("shift_assignment_id")
      .notNull()
      .references(() => shiftAssignments.id, { onDelete: "restrict" }),
    effectType: exceptionEffectEnum("effect_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.exceptionId, table.shiftAssignmentId, table.effectType],
      name: "exception_assignment_links_pk",
    }),
  ],
);

export const replacementAssignments = pgTable(
  "replacement_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => scheduleRequests.id, { onDelete: "restrict" }),
    originalAssignmentId: uuid("original_assignment_id")
      .notNull()
      .references(() => shiftAssignments.id, { onDelete: "restrict" }),
    originalEmployeeId: uuid("original_employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    replacementEmployeeId: uuid("replacement_employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    replacementStartAt: timestamp("replacement_start_at", { withTimezone: true }).notNull(),
    replacementEndAt: timestamp("replacement_end_at", { withTimezone: true }).notNull(),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    reason: text("reason").notNull(),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("replacement_assignments_request_uq").on(table.requestId),
    index("replacement_assignments_replacement_employee_idx").on(table.replacementEmployeeId),
    check(
      "replacement_assignments_interval_valid",
      sql`${table.replacementEndAt} > ${table.replacementStartAt}`,
    ),
    check(
      "replacement_assignments_distinct_employee",
      sql`${table.originalEmployeeId} <> ${table.replacementEmployeeId}`,
    ),
    check("replacement_assignments_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const shiftSwapRequests = pgTable(
  "shift_swap_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => scheduleRequests.id, { onDelete: "restrict" }),
    requesterEmployeeId: uuid("requester_employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    counterpartyEmployeeId: uuid("counterparty_employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    requesterAssignmentId: uuid("requester_assignment_id")
      .notNull()
      .references(() => shiftAssignments.id, { onDelete: "restrict" }),
    counterpartyAssignmentId: uuid("counterparty_assignment_id")
      .notNull()
      .references(() => shiftAssignments.id, { onDelete: "restrict" }),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    reason: text("reason").notNull(),
    requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("shift_swap_requests_request_uq").on(table.requestId),
    index("shift_swap_requests_requester_status_idx").on(table.requesterEmployeeId, table.status),
    check(
      "shift_swap_requests_distinct_employee",
      sql`${table.requesterEmployeeId} <> ${table.counterpartyEmployeeId}`,
    ),
    check(
      "shift_swap_requests_distinct_assignment",
      sql`${table.requesterAssignmentId} <> ${table.counterpartyAssignmentId}`,
    ),
    check("shift_swap_requests_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const overtimeRecords = pgTable(
  "overtime_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => scheduleRequests.id, { onDelete: "restrict" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    workDate: date("work_date").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    reason: text("reason").notNull(),
    relatedAssignmentId: uuid("related_assignment_id").references(() => shiftAssignments.id, {
      onDelete: "restrict",
    }),
    requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("overtime_records_request_uq").on(table.requestId),
    index("overtime_records_employee_work_date_idx").on(table.employeeId, table.workDate),
    check("overtime_records_interval_valid", sql`${table.endAt} > ${table.startAt}`),
    check("overtime_records_duration_positive", sql`${table.durationMinutes} > 0`),
    check("overtime_records_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);
