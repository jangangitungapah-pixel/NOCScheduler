import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { employeeStatusEnum, userStatusEnum } from "./enums";

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("teams_code_uq").on(table.code),
    check("teams_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    status: userStatusEnum("status").notNull().default("INVITED"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("users_email_normalized_uq").on(table.emailNormalized),
    index("users_status_idx").on(table.status),
    check("users_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "restrict" }),
    employeeCode: text("employee_code"),
    displayName: text("display_name").notNull(),
    status: employeeStatusEnum("status").notNull().default("ACTIVE"),
    joinDate: date("join_date").notNull(),
    inactiveDate: date("inactive_date"),
    jobTitle: text("job_title"),
    phone: text("phone"),
    avatarReference: text("avatar_reference"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("employees_user_id_uq").on(table.userId),
    uniqueIndex("employees_employee_code_uq").on(table.employeeCode),
    index("employees_team_status_idx").on(table.teamId, table.status),
    check(
      "employees_inactive_date_after_join",
      sql`${table.inactiveDate} is null or ${table.inactiveDate} >= ${table.joinDate}`,
    ),
    check("employees_row_version_positive", sql`${table.rowVersion} > 0`),
  ],
);
