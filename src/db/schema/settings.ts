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
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { holidayTypeEnum, settingValueTypeEnum } from "./enums";
import { users } from "./identity";

export const holidays = pgTable(
  "holidays",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date").notNull(),
    name: text("name").notNull(),
    type: holidayTypeEnum("type").notNull().default("PUBLIC_HOLIDAY"),
    isActive: boolean("is_active").notNull().default(true),
    policyReference: text("policy_reference"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("holidays_date_name_uq").on(table.date, table.name),
    index("holidays_date_active_idx").on(table.date, table.isActive),
    check("holidays_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const systemSettings = pgTable(
  "system_settings",
  {
    key: text("key").primaryKey(),
    value: jsonb("value").$type<unknown>().notNull(),
    valueType: settingValueTypeEnum("value_type").notNull(),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [check("system_settings_row_version_positive", sql`${table.rowVersion} > 0`)],
);
