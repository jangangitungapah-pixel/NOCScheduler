import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./identity";

export const shiftTypes = pgTable(
  "shift_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    defaultName: text("default_name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("shift_types_code_uq").on(table.code)],
);

export const shiftTypeVersions = pgTable(
  "shift_type_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shiftTypeId: uuid("shift_type_id")
      .notNull()
      .references(() => shiftTypes.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    startTime: time("start_time", { withTimezone: false }).notNull(),
    endTime: time("end_time", { withTimezone: false }).notNull(),
    crossesMidnight: boolean("crosses_midnight").notNull().default(false),
    displayOrder: integer("display_order").notNull(),
    visualToken: text("visual_token").notNull(),
    effectiveFrom: date("effective_from").notNull(),
    effectiveTo: date("effective_to"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("shift_type_versions_identity_effective_idx").on(
      table.shiftTypeId,
      table.effectiveFrom,
      table.effectiveTo,
    ),
    check("shift_type_versions_display_order_nonnegative", sql`${table.displayOrder} >= 0`),
    check(
      "shift_type_versions_effective_range_valid",
      sql`${table.effectiveTo} is null or ${table.effectiveTo} > ${table.effectiveFrom}`,
    ),
  ],
);
