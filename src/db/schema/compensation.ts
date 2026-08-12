import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { employees, users } from "./identity";
import { shiftTypes } from "./shifts";

export const employeeSalaryVersions = pgTable(
  "employee_salary_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    baseSalaryAmount: bigint("base_salary_amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("IDR"),
    effectiveFrom: date("effective_from").notNull(),
    effectiveTo: date("effective_to"),
    reason: text("reason"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("employee_salary_versions_effective_idx").on(
      table.employeeId,
      table.effectiveFrom,
      table.effectiveTo,
    ),
    check("employee_salary_versions_amount_nonnegative", sql`${table.baseSalaryAmount} >= 0`),
    check("employee_salary_versions_currency_idr", sql`${table.currency} = 'IDR'`),
    check(
      "employee_salary_versions_effective_range_valid",
      sql`${table.effectiveTo} is null or ${table.effectiveTo} > ${table.effectiveFrom}`,
    ),
  ],
);

export const shiftIncentiveVersions = pgTable(
  "shift_incentive_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shiftTypeId: uuid("shift_type_id")
      .notNull()
      .references(() => shiftTypes.id, { onDelete: "restrict" }),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("IDR"),
    isIncentiveEnabled: boolean("is_incentive_enabled").notNull().default(true),
    effectiveFrom: date("effective_from").notNull(),
    effectiveTo: date("effective_to"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("shift_incentive_versions_effective_idx").on(
      table.shiftTypeId,
      table.effectiveFrom,
      table.effectiveTo,
    ),
    check("shift_incentive_versions_amount_nonnegative", sql`${table.amount} >= 0`),
    check("shift_incentive_versions_currency_idr", sql`${table.currency} = 'IDR'`),
    check(
      "shift_incentive_versions_effective_range_valid",
      sql`${table.effectiveTo} is null or ${table.effectiveTo} > ${table.effectiveFrom}`,
    ),
  ],
);
