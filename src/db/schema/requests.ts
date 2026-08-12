import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { requestStatusEnum, requestTypeEnum } from "./enums";
import { employees, users } from "./identity";

export const scheduleRequests = pgTable(
  "schedule_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: requestTypeEnum("type").notNull(),
    status: requestStatusEnum("status").notNull().default("DRAFT"),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    requesterUserId: uuid("requester_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    workDate: date("work_date"),
    reason: text("reason").notNull(),
    proposedPayload: jsonb("proposed_payload").$type<Record<string, unknown>>(),
    needsReplacement: boolean("needs_replacement").notNull().default(false),
    payrollImpactExpected: boolean("payroll_impact_expected").notNull().default(false),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decisionReason: text("decision_reason"),
    cancelledBy: uuid("cancelled_by").references(() => users.id, { onDelete: "set null" }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    index("schedule_requests_employee_status_idx").on(table.employeeId, table.status),
    index("schedule_requests_type_status_idx").on(table.type, table.status),
    index("schedule_requests_work_date_idx").on(table.workDate),
    check(
      "schedule_requests_date_range_valid",
      sql`${table.endDate} is null or ${table.startDate} is null or ${table.endDate} >= ${table.startDate}`,
    ),
    check("schedule_requests_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);
