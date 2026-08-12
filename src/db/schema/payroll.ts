import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { adjustmentStatusEnum, payrollDirectionEnum, payrollStatusEnum } from "./enums";
import { employees, users } from "./identity";

export const payrollPeriods = pgTable(
  "payroll_periods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodCode: text("period_code").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    timezone: text("timezone").notNull().default("Asia/Jakarta"),
    status: payrollStatusEnum("status").notNull().default("OPEN"),
    calculationRevision: integer("calculation_revision").notNull().default(0),
    isDirty: boolean("is_dirty").notNull().default(false),
    calculatedBy: uuid("calculated_by").references(() => users.id, { onDelete: "set null" }),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }),
    finalizedBy: uuid("finalized_by").references(() => users.id, { onDelete: "set null" }),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    lockedBy: uuid("locked_by").references(() => users.id, { onDelete: "set null" }),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("payroll_periods_period_code_uq").on(table.periodCode),
    check("payroll_periods_date_range_valid", sql`${table.endDate} >= ${table.startDate}`),
    check(
      "payroll_periods_calculation_revision_nonnegative",
      sql`${table.calculationRevision} >= 0`,
    ),
    check("payroll_periods_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const payrollRecords = pgTable(
  "payroll_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payrollPeriodId: uuid("payroll_period_id")
      .notNull()
      .references(() => payrollPeriods.id, { onDelete: "restrict" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "restrict" }),
    status: payrollStatusEnum("status").notNull().default("OPEN"),
    currentRevisionId: uuid("current_revision_id"),
    isDirty: boolean("is_dirty").notNull().default(false),
    calculatedTakeHomePay: bigint("calculated_take_home_pay", { mode: "number" })
      .notNull()
      .default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("payroll_records_period_employee_uq").on(table.payrollPeriodId, table.employeeId),
    index("payroll_records_employee_idx").on(table.employeeId),
    check("payroll_records_thp_nonnegative", sql`${table.calculatedTakeHomePay} >= 0`),
    check("payroll_records_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const payrollRevisions = pgTable(
  "payroll_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payrollRecordId: uuid("payroll_record_id")
      .notNull()
      .references(() => payrollRecords.id, { onDelete: "restrict" }),
    revisionNumber: integer("revision_number").notNull(),
    sourceFingerprint: text("source_fingerprint"),
    baseSalarySnapshot: bigint("base_salary_snapshot", { mode: "number" }).notNull(),
    grossEarnings: bigint("gross_earnings", { mode: "number" }).notNull(),
    totalPositiveAdjustment: bigint("total_positive_adjustment", { mode: "number" })
      .notNull()
      .default(0),
    totalDeduction: bigint("total_deduction", { mode: "number" }).notNull().default(0),
    calculatedTakeHomePay: bigint("calculated_take_home_pay", { mode: "number" }).notNull(),
    calculatedBy: uuid("calculated_by").references(() => users.id, { onDelete: "set null" }),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }).notNull().defaultNow(),
    finalizedBy: uuid("finalized_by").references(() => users.id, { onDelete: "set null" }),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    lockedBy: uuid("locked_by").references(() => users.id, { onDelete: "set null" }),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("payroll_revisions_record_revision_uq").on(
      table.payrollRecordId,
      table.revisionNumber,
    ),
    check("payroll_revisions_revision_positive", sql`${table.revisionNumber} > 0`),
    check("payroll_revisions_base_salary_nonnegative", sql`${table.baseSalarySnapshot} >= 0`),
    check("payroll_revisions_gross_nonnegative", sql`${table.grossEarnings} >= 0`),
    check(
      "payroll_revisions_positive_adjustment_nonnegative",
      sql`${table.totalPositiveAdjustment} >= 0`,
    ),
    check("payroll_revisions_deduction_nonnegative", sql`${table.totalDeduction} >= 0`),
    check("payroll_revisions_thp_nonnegative", sql`${table.calculatedTakeHomePay} >= 0`),
  ],
);

export const payrollItems = pgTable(
  "payroll_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payrollRevisionId: uuid("payroll_revision_id")
      .notNull()
      .references(() => payrollRevisions.id, { onDelete: "restrict" }),
    componentType: text("component_type").notNull(),
    sourceType: text("source_type").notNull(),
    sourceReferenceId: uuid("source_reference_id"),
    labelSnapshot: text("label_snapshot").notNull(),
    quantity: numeric("quantity", { precision: 18, scale: 4 }).notNull().default("1"),
    rateAmount: bigint("rate_amount", { mode: "number" }).notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("IDR"),
    direction: payrollDirectionEnum("direction").notNull(),
    configurationReferenceId: uuid("configuration_reference_id"),
    metadataSnapshot: jsonb("metadata_snapshot").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payroll_items_revision_idx").on(table.payrollRevisionId),
    check("payroll_items_rate_nonnegative", sql`${table.rateAmount} >= 0`),
    check("payroll_items_amount_nonnegative", sql`${table.amount} >= 0`),
    check("payroll_items_quantity_nonnegative", sql`${table.quantity} >= 0`),
    check("payroll_items_currency_idr", sql`${table.currency} = 'IDR'`),
  ],
);

export const payrollAdjustments = pgTable(
  "payroll_adjustments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payrollRecordId: uuid("payroll_record_id")
      .notNull()
      .references(() => payrollRecords.id, { onDelete: "restrict" }),
    category: text("category").notNull(),
    direction: payrollDirectionEnum("direction").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("IDR"),
    reason: text("reason").notNull(),
    status: adjustmentStatusEnum("status").notNull().default("ACTIVE"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    voidedBy: uuid("voided_by").references(() => users.id, { onDelete: "set null" }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    index("payroll_adjustments_record_status_idx").on(table.payrollRecordId, table.status),
    check("payroll_adjustments_amount_nonnegative", sql`${table.amount} >= 0`),
    check("payroll_adjustments_currency_idr", sql`${table.currency} = 'IDR'`),
    check("payroll_adjustments_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const payrollItemSources = pgTable(
  "payroll_item_sources",
  {
    payrollItemId: uuid("payroll_item_id")
      .notNull()
      .references(() => payrollItems.id, { onDelete: "restrict" }),
    sourceType: text("source_type").notNull(),
    sourceId: uuid("source_id").notNull(),
    workDate: date("work_date").notNull(),
    quantityContribution: numeric("quantity_contribution", { precision: 18, scale: 4 }).notNull(),
    rateSnapshot: bigint("rate_snapshot", { mode: "number" }).notNull(),
    amountContribution: bigint("amount_contribution", { mode: "number" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.payrollItemId, table.sourceType, table.sourceId, table.workDate],
      name: "payroll_item_sources_pk",
    }),
    check("payroll_item_sources_quantity_nonnegative", sql`${table.quantityContribution} >= 0`),
    check("payroll_item_sources_rate_nonnegative", sql`${table.rateSnapshot} >= 0`),
    check("payroll_item_sources_amount_nonnegative", sql`${table.amountContribution} >= 0`),
  ],
);
