import { sql } from "drizzle-orm";
import {
  check,
  date,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  assignmentSourceEnum,
  primaryWorkStateEnum,
  schedulePeriodStatusEnum,
  scheduleVersionStateEnum,
} from "./enums";
import { employees, users } from "./identity";
import { shiftTypes, shiftTypeVersions } from "./shifts";

export const schedulePeriods = pgTable(
  "schedule_periods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodCode: text("period_code").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    timezone: text("timezone").notNull().default("Asia/Jakarta"),
    status: schedulePeriodStatusEnum("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("schedule_periods_period_code_uq").on(table.periodCode),
    index("schedule_periods_date_range_idx").on(table.startDate, table.endDate),
    check("schedule_periods_date_range_valid", sql`${table.endDate} >= ${table.startDate}`),
    check("schedule_periods_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const scheduleVersions = pgTable(
  "schedule_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schedulePeriodId: uuid("schedule_period_id")
      .notNull()
      .references(() => schedulePeriods.id, { onDelete: "restrict" }),
    revisionNumber: integer("revision_number").notNull(),
    state: scheduleVersionStateEnum("state").notNull().default("DRAFT"),
    basedOnVersionId: uuid("based_on_version_id"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    publishedBy: uuid("published_by").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    publicationReason: text("publication_reason"),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("schedule_versions_period_revision_uq").on(
      table.schedulePeriodId,
      table.revisionNumber,
    ),
    index("schedule_versions_period_state_idx").on(table.schedulePeriodId, table.state),
    foreignKey({
      columns: [table.basedOnVersionId],
      foreignColumns: [table.id],
      name: "schedule_versions_based_on_fk",
    }).onDelete("restrict"),
    check("schedule_versions_revision_positive", sql`${table.revisionNumber} > 0`),
    check("schedule_versions_row_version_positive", sql`${table.rowVersion} > 0`),
    check(
      "schedule_versions_publication_metadata",
      sql`(${table.state} = 'DRAFT') or ${table.publishedAt} is not null`,
    ),
  ],
);

export const shiftAssignments = pgTable(
  "shift_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scheduleVersionId: uuid("schedule_version_id")
      .notNull()
      .references(() => scheduleVersions.id, { onDelete: "restrict" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    workDate: date("work_date").notNull(),
    primaryState: primaryWorkStateEnum("primary_state").notNull(),
    shiftTypeId: uuid("shift_type_id").references(() => shiftTypes.id, { onDelete: "restrict" }),
    shiftTypeVersionId: uuid("shift_type_version_id").references(() => shiftTypeVersions.id, {
      onDelete: "restrict",
    }),
    startAt: timestamp("start_at", { withTimezone: true }),
    endAt: timestamp("end_at", { withTimezone: true }),
    sourceType: assignmentSourceEnum("source_type").notNull().default("MANUAL"),
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("shift_assignments_version_employee_work_date_uq").on(
      table.scheduleVersionId,
      table.employeeId,
      table.workDate,
    ),
    index("shift_assignments_employee_work_date_idx").on(table.employeeId, table.workDate),
    index("shift_assignments_version_work_date_idx").on(table.scheduleVersionId, table.workDate),
    check("shift_assignments_row_version_positive", sql`${table.rowVersion} > 0`),
    check(
      "shift_assignments_state_consistency",
      sql`(
        ${table.primaryState} = 'SHIFT'
        and ${table.shiftTypeId} is not null
        and ${table.shiftTypeVersionId} is not null
        and ${table.startAt} is not null
        and ${table.endAt} is not null
        and ${table.endAt} > ${table.startAt}
      ) or (
        ${table.primaryState} = 'OFF'
        and ${table.shiftTypeId} is null
        and ${table.shiftTypeVersionId} is null
        and ${table.startAt} is null
        and ${table.endAt} is null
      )`,
    ),
  ],
);
