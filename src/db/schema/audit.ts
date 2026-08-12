import { index, inet, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { auditActorTypeEnum, auditSeverityEnum } from "./enums";
import { users } from "./identity";

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    actorType: auditActorTypeEnum("actor_type").notNull(),
    severity: auditSeverityEnum("severity").notNull().default("INFO"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    parentEntityType: text("parent_entity_type"),
    parentEntityId: uuid("parent_entity_id"),
    reason: text("reason"),
    beforeSnapshot: jsonb("before_snapshot").$type<Record<string, unknown>>(),
    afterSnapshot: jsonb("after_snapshot").$type<Record<string, unknown>>(),
    requestId: text("request_id"),
    correlationId: text("correlation_id"),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("audit_events_entity_idx").on(table.entityType, table.entityId, table.occurredAt),
    index("audit_events_actor_idx").on(table.actorUserId, table.occurredAt),
    index("audit_events_correlation_idx").on(table.correlationId),
  ],
);
