CREATE TYPE "public"."adjustment_status" AS ENUM('ACTIVE', 'VOIDED');--> statement-breakpoint
CREATE TYPE "public"."assignment_source" AS ENUM('MANUAL', 'COPY', 'TEMPLATE', 'CORRECTION');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('USER', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."audit_severity" AS ENUM('INFO', 'NOTICE', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."exception_effect" AS ENUM('REPLACES_WORK_STATE', 'NON_INCENTIVE_ELIGIBLE', 'COVERAGE_REMOVAL');--> statement-breakpoint
CREATE TYPE "public"."exception_type" AS ENUM('LEAVE', 'SICK', 'PERMISSION', 'TRAINING', 'BUSINESS_DUTY', 'UNAVAILABLE', 'EMERGENCY');--> statement-breakpoint
CREATE TYPE "public"."holiday_type" AS ENUM('PUBLIC_HOLIDAY', 'COMPANY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payroll_direction" AS ENUM('EARNING', 'DEDUCTION');--> statement-breakpoint
CREATE TYPE "public"."payroll_status" AS ENUM('OPEN', 'CALCULATED', 'FINALIZED', 'LOCKED');--> statement-breakpoint
CREATE TYPE "public"."permission_risk" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."primary_work_state" AS ENUM('SHIFT', 'OFF');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'SUPERSEDED');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('LEAVE', 'SICK', 'PERMISSION', 'TRAINING', 'BUSINESS_DUTY', 'SCHEDULE_CHANGE', 'SHIFT_SWAP', 'REPLACEMENT', 'OVERTIME');--> statement-breakpoint
CREATE TYPE "public"."schedule_period_status" AS ENUM('OPEN', 'CLOSED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."schedule_version_state" AS ENUM('DRAFT', 'PUBLISHED', 'SUPERSEDED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."scope_type" AS ENUM('SELF', 'TEAM', 'ALL');--> statement-breakpoint
CREATE TYPE "public"."setting_value_type" AS ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'DISABLED', 'INVITED');--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" uuid,
	"actor_type" "audit_actor_type" NOT NULL,
	"severity" "audit_severity" DEFAULT 'INFO' NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"parent_entity_type" text,
	"parent_entity_id" uuid,
	"reason" text,
	"before_snapshot" jsonb,
	"after_snapshot" jsonb,
	"request_id" text,
	"correlation_id" text,
	"ip_address" "inet",
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"domain" text NOT NULL,
	"description" text,
	"risk_level" "permission_risk" DEFAULT 'LOW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"default_scope" "scope_type" DEFAULT 'SELF' NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"granted_by" uuid,
	CONSTRAINT "role_permissions_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_system_role" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"scope_type" "scope_type" NOT NULL,
	"scope_reference_id" uuid,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"granted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_effective_range_valid" CHECK ("user_roles"."effective_to" is null or "user_roles"."effective_to" > "user_roles"."effective_from")
);
--> statement-breakpoint
CREATE TABLE "employee_salary_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"base_salary_amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"reason" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employee_salary_versions_amount_nonnegative" CHECK ("employee_salary_versions"."base_salary_amount" >= 0),
	CONSTRAINT "employee_salary_versions_currency_idr" CHECK ("employee_salary_versions"."currency" = 'IDR'),
	CONSTRAINT "employee_salary_versions_effective_range_valid" CHECK ("employee_salary_versions"."effective_to" is null or "employee_salary_versions"."effective_to" > "employee_salary_versions"."effective_from")
);
--> statement-breakpoint
CREATE TABLE "shift_incentive_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shift_type_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"is_incentive_enabled" boolean DEFAULT true NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shift_incentive_versions_amount_nonnegative" CHECK ("shift_incentive_versions"."amount" >= 0),
	CONSTRAINT "shift_incentive_versions_currency_idr" CHECK ("shift_incentive_versions"."currency" = 'IDR'),
	CONSTRAINT "shift_incentive_versions_effective_range_valid" CHECK ("shift_incentive_versions"."effective_to" is null or "shift_incentive_versions"."effective_to" > "shift_incentive_versions"."effective_from")
);
--> statement-breakpoint
CREATE TABLE "exception_assignment_links" (
	"exception_id" uuid NOT NULL,
	"shift_assignment_id" uuid NOT NULL,
	"effect_type" "exception_effect" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exception_assignment_links_pk" PRIMARY KEY("exception_id","shift_assignment_id","effect_type")
);
--> statement-breakpoint
CREATE TABLE "overtime_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"employee_id" uuid NOT NULL,
	"work_date" date NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text NOT NULL,
	"related_assignment_id" uuid,
	"requested_by" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "overtime_records_interval_valid" CHECK ("overtime_records"."end_at" > "overtime_records"."start_at"),
	CONSTRAINT "overtime_records_duration_positive" CHECK ("overtime_records"."duration_minutes" > 0),
	CONSTRAINT "overtime_records_row_version_positive" CHECK ("overtime_records"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "replacement_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"original_assignment_id" uuid NOT NULL,
	"original_employee_id" uuid NOT NULL,
	"replacement_employee_id" uuid NOT NULL,
	"replacement_start_at" timestamp with time zone NOT NULL,
	"replacement_end_at" timestamp with time zone NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "replacement_assignments_interval_valid" CHECK ("replacement_assignments"."replacement_end_at" > "replacement_assignments"."replacement_start_at"),
	CONSTRAINT "replacement_assignments_distinct_employee" CHECK ("replacement_assignments"."original_employee_id" <> "replacement_assignments"."replacement_employee_id"),
	CONSTRAINT "replacement_assignments_row_version_positive" CHECK ("replacement_assignments"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "shift_swap_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"requester_employee_id" uuid NOT NULL,
	"counterparty_employee_id" uuid NOT NULL,
	"requester_assignment_id" uuid NOT NULL,
	"counterparty_assignment_id" uuid NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text NOT NULL,
	"requested_by" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "shift_swap_requests_distinct_employee" CHECK ("shift_swap_requests"."requester_employee_id" <> "shift_swap_requests"."counterparty_employee_id"),
	CONSTRAINT "shift_swap_requests_distinct_assignment" CHECK ("shift_swap_requests"."requester_assignment_id" <> "shift_swap_requests"."counterparty_assignment_id"),
	CONSTRAINT "shift_swap_requests_row_version_positive" CHECK ("shift_swap_requests"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "workforce_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"employee_id" uuid NOT NULL,
	"exception_type" "exception_type" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text NOT NULL,
	"requested_by" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "workforce_exceptions_date_range_valid" CHECK ("workforce_exceptions"."end_date" >= "workforce_exceptions"."start_date"),
	CONSTRAINT "workforce_exceptions_row_version_positive" CHECK ("workforce_exceptions"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"team_id" uuid,
	"employee_code" text,
	"display_name" text NOT NULL,
	"status" "employee_status" DEFAULT 'ACTIVE' NOT NULL,
	"join_date" date NOT NULL,
	"inactive_date" date,
	"job_title" text,
	"phone" text,
	"avatar_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "employees_inactive_date_after_join" CHECK ("employees"."inactive_date" is null or "employees"."inactive_date" >= "employees"."join_date"),
	CONSTRAINT "employees_row_version_positive" CHECK ("employees"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "teams_row_version_positive" CHECK ("teams"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_normalized" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"status" "user_status" DEFAULT 'INVITED' NOT NULL,
	"last_login_at" timestamp with time zone,
	"disabled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "users_row_version_positive" CHECK ("users"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"target_route" text NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"read_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"stale_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "payroll_adjustments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payroll_record_id" uuid NOT NULL,
	"category" text NOT NULL,
	"direction" "payroll_direction" NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"reason" text NOT NULL,
	"status" "adjustment_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"voided_at" timestamp with time zone,
	"voided_by" uuid,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "payroll_adjustments_amount_nonnegative" CHECK ("payroll_adjustments"."amount" >= 0),
	CONSTRAINT "payroll_adjustments_currency_idr" CHECK ("payroll_adjustments"."currency" = 'IDR'),
	CONSTRAINT "payroll_adjustments_row_version_positive" CHECK ("payroll_adjustments"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "payroll_item_sources" (
	"payroll_item_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"work_date" date NOT NULL,
	"quantity_contribution" numeric(18, 4) NOT NULL,
	"rate_snapshot" bigint NOT NULL,
	"amount_contribution" bigint NOT NULL,
	CONSTRAINT "payroll_item_sources_pk" PRIMARY KEY("payroll_item_id","source_type","source_id","work_date"),
	CONSTRAINT "payroll_item_sources_quantity_nonnegative" CHECK ("payroll_item_sources"."quantity_contribution" >= 0),
	CONSTRAINT "payroll_item_sources_rate_nonnegative" CHECK ("payroll_item_sources"."rate_snapshot" >= 0),
	CONSTRAINT "payroll_item_sources_amount_nonnegative" CHECK ("payroll_item_sources"."amount_contribution" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payroll_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payroll_revision_id" uuid NOT NULL,
	"component_type" text NOT NULL,
	"source_type" text NOT NULL,
	"source_reference_id" uuid,
	"label_snapshot" text NOT NULL,
	"quantity" numeric(18, 4) DEFAULT '1' NOT NULL,
	"rate_amount" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"direction" "payroll_direction" NOT NULL,
	"configuration_reference_id" uuid,
	"metadata_snapshot" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payroll_items_rate_nonnegative" CHECK ("payroll_items"."rate_amount" >= 0),
	CONSTRAINT "payroll_items_amount_nonnegative" CHECK ("payroll_items"."amount" >= 0),
	CONSTRAINT "payroll_items_quantity_nonnegative" CHECK ("payroll_items"."quantity" >= 0),
	CONSTRAINT "payroll_items_currency_idr" CHECK ("payroll_items"."currency" = 'IDR')
);
--> statement-breakpoint
CREATE TABLE "payroll_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period_code" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"timezone" text DEFAULT 'Asia/Jakarta' NOT NULL,
	"status" "payroll_status" DEFAULT 'OPEN' NOT NULL,
	"calculation_revision" integer DEFAULT 0 NOT NULL,
	"is_dirty" boolean DEFAULT false NOT NULL,
	"calculated_by" uuid,
	"calculated_at" timestamp with time zone,
	"finalized_by" uuid,
	"finalized_at" timestamp with time zone,
	"locked_by" uuid,
	"locked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "payroll_periods_date_range_valid" CHECK ("payroll_periods"."end_date" >= "payroll_periods"."start_date"),
	CONSTRAINT "payroll_periods_calculation_revision_nonnegative" CHECK ("payroll_periods"."calculation_revision" >= 0),
	CONSTRAINT "payroll_periods_row_version_positive" CHECK ("payroll_periods"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "payroll_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payroll_period_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"status" "payroll_status" DEFAULT 'OPEN' NOT NULL,
	"current_revision_id" uuid,
	"is_dirty" boolean DEFAULT false NOT NULL,
	"calculated_take_home_pay" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "payroll_records_thp_nonnegative" CHECK ("payroll_records"."calculated_take_home_pay" >= 0),
	CONSTRAINT "payroll_records_row_version_positive" CHECK ("payroll_records"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "payroll_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payroll_record_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"source_fingerprint" text,
	"base_salary_snapshot" bigint NOT NULL,
	"gross_earnings" bigint NOT NULL,
	"total_positive_adjustment" bigint DEFAULT 0 NOT NULL,
	"total_deduction" bigint DEFAULT 0 NOT NULL,
	"calculated_take_home_pay" bigint NOT NULL,
	"calculated_by" uuid,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_by" uuid,
	"finalized_at" timestamp with time zone,
	"locked_by" uuid,
	"locked_at" timestamp with time zone,
	CONSTRAINT "payroll_revisions_revision_positive" CHECK ("payroll_revisions"."revision_number" > 0),
	CONSTRAINT "payroll_revisions_base_salary_nonnegative" CHECK ("payroll_revisions"."base_salary_snapshot" >= 0),
	CONSTRAINT "payroll_revisions_gross_nonnegative" CHECK ("payroll_revisions"."gross_earnings" >= 0),
	CONSTRAINT "payroll_revisions_positive_adjustment_nonnegative" CHECK ("payroll_revisions"."total_positive_adjustment" >= 0),
	CONSTRAINT "payroll_revisions_deduction_nonnegative" CHECK ("payroll_revisions"."total_deduction" >= 0),
	CONSTRAINT "payroll_revisions_thp_nonnegative" CHECK ("payroll_revisions"."calculated_take_home_pay" >= 0)
);
--> statement-breakpoint
CREATE TABLE "schedule_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "request_type" NOT NULL,
	"status" "request_status" DEFAULT 'DRAFT' NOT NULL,
	"employee_id" uuid NOT NULL,
	"requester_user_id" uuid NOT NULL,
	"start_date" date,
	"end_date" date,
	"work_date" date,
	"reason" text NOT NULL,
	"proposed_payload" jsonb,
	"needs_replacement" boolean DEFAULT false NOT NULL,
	"payroll_impact_expected" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"decision_reason" text,
	"cancelled_by" uuid,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "schedule_requests_date_range_valid" CHECK ("schedule_requests"."end_date" is null or "schedule_requests"."start_date" is null or "schedule_requests"."end_date" >= "schedule_requests"."start_date"),
	CONSTRAINT "schedule_requests_row_version_positive" CHECK ("schedule_requests"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "schedule_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period_code" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"timezone" text DEFAULT 'Asia/Jakarta' NOT NULL,
	"status" "schedule_period_status" DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "schedule_periods_date_range_valid" CHECK ("schedule_periods"."end_date" >= "schedule_periods"."start_date"),
	CONSTRAINT "schedule_periods_row_version_positive" CHECK ("schedule_periods"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "schedule_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_period_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"state" "schedule_version_state" DEFAULT 'DRAFT' NOT NULL,
	"based_on_version_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"publication_reason" text,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "schedule_versions_revision_positive" CHECK ("schedule_versions"."revision_number" > 0),
	CONSTRAINT "schedule_versions_row_version_positive" CHECK ("schedule_versions"."row_version" > 0),
	CONSTRAINT "schedule_versions_publication_metadata" CHECK (("schedule_versions"."state" = 'DRAFT') or "schedule_versions"."published_at" is not null)
);
--> statement-breakpoint
CREATE TABLE "shift_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_version_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"work_date" date NOT NULL,
	"primary_state" "primary_work_state" NOT NULL,
	"shift_type_id" uuid,
	"shift_type_version_id" uuid,
	"start_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"source_type" "assignment_source" DEFAULT 'MANUAL' NOT NULL,
	"note" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "shift_assignments_row_version_positive" CHECK ("shift_assignments"."row_version" > 0),
	CONSTRAINT "shift_assignments_state_consistency" CHECK ((
        "shift_assignments"."primary_state" = 'SHIFT'
        and "shift_assignments"."shift_type_id" is not null
        and "shift_assignments"."shift_type_version_id" is not null
        and "shift_assignments"."start_at" is not null
        and "shift_assignments"."end_at" is not null
        and "shift_assignments"."end_at" > "shift_assignments"."start_at"
      ) or (
        "shift_assignments"."primary_state" = 'OFF'
        and "shift_assignments"."shift_type_id" is null
        and "shift_assignments"."shift_type_version_id" is null
        and "shift_assignments"."start_at" is null
        and "shift_assignments"."end_at" is null
      ))
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"name" text NOT NULL,
	"type" "holiday_type" DEFAULT 'PUBLIC_HOLIDAY' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"policy_reference" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "holidays_row_version_positive" CHECK ("holidays"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"value_type" "setting_value_type" NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "system_settings_row_version_positive" CHECK ("system_settings"."row_version" > 0)
);
--> statement-breakpoint
CREATE TABLE "shift_type_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shift_type_id" uuid NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"crosses_midnight" boolean DEFAULT false NOT NULL,
	"display_order" integer NOT NULL,
	"visual_token" text NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shift_type_versions_display_order_nonnegative" CHECK ("shift_type_versions"."display_order" >= 0),
	CONSTRAINT "shift_type_versions_effective_range_valid" CHECK ("shift_type_versions"."effective_to" is null or "shift_type_versions"."effective_to" > "shift_type_versions"."effective_from")
);
--> statement-breakpoint
CREATE TABLE "shift_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"default_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_salary_versions" ADD CONSTRAINT "employee_salary_versions_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_salary_versions" ADD CONSTRAINT "employee_salary_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_incentive_versions" ADD CONSTRAINT "shift_incentive_versions_shift_type_id_shift_types_id_fk" FOREIGN KEY ("shift_type_id") REFERENCES "public"."shift_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_incentive_versions" ADD CONSTRAINT "shift_incentive_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exception_assignment_links" ADD CONSTRAINT "exception_assignment_links_exception_id_workforce_exceptions_id_fk" FOREIGN KEY ("exception_id") REFERENCES "public"."workforce_exceptions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exception_assignment_links" ADD CONSTRAINT "exception_assignment_links_shift_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("shift_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_request_id_schedule_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."schedule_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_related_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("related_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_assignments" ADD CONSTRAINT "replacement_assignments_request_id_schedule_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."schedule_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_assignments" ADD CONSTRAINT "replacement_assignments_original_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("original_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_assignments" ADD CONSTRAINT "replacement_assignments_original_employee_id_employees_id_fk" FOREIGN KEY ("original_employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_assignments" ADD CONSTRAINT "replacement_assignments_replacement_employee_id_employees_id_fk" FOREIGN KEY ("replacement_employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_assignments" ADD CONSTRAINT "replacement_assignments_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_request_id_schedule_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."schedule_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_requester_employee_id_employees_id_fk" FOREIGN KEY ("requester_employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_counterparty_employee_id_employees_id_fk" FOREIGN KEY ("counterparty_employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_requester_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("requester_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_counterparty_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("counterparty_assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_swap_requests" ADD CONSTRAINT "shift_swap_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_exceptions" ADD CONSTRAINT "workforce_exceptions_request_id_schedule_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."schedule_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_exceptions" ADD CONSTRAINT "workforce_exceptions_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_exceptions" ADD CONSTRAINT "workforce_exceptions_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_exceptions" ADD CONSTRAINT "workforce_exceptions_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_adjustments" ADD CONSTRAINT "payroll_adjustments_payroll_record_id_payroll_records_id_fk" FOREIGN KEY ("payroll_record_id") REFERENCES "public"."payroll_records"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_adjustments" ADD CONSTRAINT "payroll_adjustments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_adjustments" ADD CONSTRAINT "payroll_adjustments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_adjustments" ADD CONSTRAINT "payroll_adjustments_voided_by_users_id_fk" FOREIGN KEY ("voided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_item_sources" ADD CONSTRAINT "payroll_item_sources_payroll_item_id_payroll_items_id_fk" FOREIGN KEY ("payroll_item_id") REFERENCES "public"."payroll_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payroll_revision_id_payroll_revisions_id_fk" FOREIGN KEY ("payroll_revision_id") REFERENCES "public"."payroll_revisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_periods" ADD CONSTRAINT "payroll_periods_calculated_by_users_id_fk" FOREIGN KEY ("calculated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_periods" ADD CONSTRAINT "payroll_periods_finalized_by_users_id_fk" FOREIGN KEY ("finalized_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_periods" ADD CONSTRAINT "payroll_periods_locked_by_users_id_fk" FOREIGN KEY ("locked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_payroll_period_id_payroll_periods_id_fk" FOREIGN KEY ("payroll_period_id") REFERENCES "public"."payroll_periods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_revisions" ADD CONSTRAINT "payroll_revisions_payroll_record_id_payroll_records_id_fk" FOREIGN KEY ("payroll_record_id") REFERENCES "public"."payroll_records"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_revisions" ADD CONSTRAINT "payroll_revisions_calculated_by_users_id_fk" FOREIGN KEY ("calculated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_revisions" ADD CONSTRAINT "payroll_revisions_finalized_by_users_id_fk" FOREIGN KEY ("finalized_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_revisions" ADD CONSTRAINT "payroll_revisions_locked_by_users_id_fk" FOREIGN KEY ("locked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_requests" ADD CONSTRAINT "schedule_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_requests" ADD CONSTRAINT "schedule_requests_requester_user_id_users_id_fk" FOREIGN KEY ("requester_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_requests" ADD CONSTRAINT "schedule_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_requests" ADD CONSTRAINT "schedule_requests_cancelled_by_users_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_versions" ADD CONSTRAINT "schedule_versions_schedule_period_id_schedule_periods_id_fk" FOREIGN KEY ("schedule_period_id") REFERENCES "public"."schedule_periods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_versions" ADD CONSTRAINT "schedule_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_versions" ADD CONSTRAINT "schedule_versions_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_versions" ADD CONSTRAINT "schedule_versions_based_on_fk" FOREIGN KEY ("based_on_version_id") REFERENCES "public"."schedule_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_schedule_version_id_schedule_versions_id_fk" FOREIGN KEY ("schedule_version_id") REFERENCES "public"."schedule_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_type_id_shift_types_id_fk" FOREIGN KEY ("shift_type_id") REFERENCES "public"."shift_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_type_version_id_shift_type_versions_id_fk" FOREIGN KEY ("shift_type_version_id") REFERENCES "public"."shift_type_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_type_versions" ADD CONSTRAINT "shift_type_versions_shift_type_id_shift_types_id_fk" FOREIGN KEY ("shift_type_id") REFERENCES "public"."shift_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_type_versions" ADD CONSTRAINT "shift_type_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor_user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_events_correlation_idx" ON "audit_events" USING btree ("correlation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_code_uq" ON "permissions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "permissions_domain_idx" ON "permissions" USING btree ("domain");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_code_uq" ON "roles" USING btree ("code");--> statement-breakpoint
CREATE INDEX "user_roles_user_effective_idx" ON "user_roles" USING btree ("user_id","effective_from","effective_to");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "employee_salary_versions_effective_idx" ON "employee_salary_versions" USING btree ("employee_id","effective_from","effective_to");--> statement-breakpoint
CREATE INDEX "shift_incentive_versions_effective_idx" ON "shift_incentive_versions" USING btree ("shift_type_id","effective_from","effective_to");--> statement-breakpoint
CREATE UNIQUE INDEX "overtime_records_request_uq" ON "overtime_records" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "overtime_records_employee_work_date_idx" ON "overtime_records" USING btree ("employee_id","work_date");--> statement-breakpoint
CREATE UNIQUE INDEX "replacement_assignments_request_uq" ON "replacement_assignments" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "replacement_assignments_replacement_employee_idx" ON "replacement_assignments" USING btree ("replacement_employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shift_swap_requests_request_uq" ON "shift_swap_requests" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "shift_swap_requests_requester_status_idx" ON "shift_swap_requests" USING btree ("requester_employee_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "workforce_exceptions_request_uq" ON "workforce_exceptions" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "workforce_exceptions_employee_dates_idx" ON "workforce_exceptions" USING btree ("employee_id","start_date","end_date");--> statement-breakpoint
CREATE INDEX "workforce_exceptions_status_idx" ON "workforce_exceptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_user_id_uq" ON "employees" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_employee_code_uq" ON "employees" USING btree ("employee_code");--> statement-breakpoint
CREATE INDEX "employees_team_status_idx" ON "employees" USING btree ("team_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_code_uq" ON "teams" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_normalized_uq" ON "users" USING btree ("email_normalized");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notifications_user_created_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "payroll_adjustments_record_status_idx" ON "payroll_adjustments" USING btree ("payroll_record_id","status");--> statement-breakpoint
CREATE INDEX "payroll_items_revision_idx" ON "payroll_items" USING btree ("payroll_revision_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payroll_periods_period_code_uq" ON "payroll_periods" USING btree ("period_code");--> statement-breakpoint
CREATE UNIQUE INDEX "payroll_records_period_employee_uq" ON "payroll_records" USING btree ("payroll_period_id","employee_id");--> statement-breakpoint
CREATE INDEX "payroll_records_employee_idx" ON "payroll_records" USING btree ("employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payroll_revisions_record_revision_uq" ON "payroll_revisions" USING btree ("payroll_record_id","revision_number");--> statement-breakpoint
CREATE INDEX "schedule_requests_employee_status_idx" ON "schedule_requests" USING btree ("employee_id","status");--> statement-breakpoint
CREATE INDEX "schedule_requests_type_status_idx" ON "schedule_requests" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "schedule_requests_work_date_idx" ON "schedule_requests" USING btree ("work_date");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_periods_period_code_uq" ON "schedule_periods" USING btree ("period_code");--> statement-breakpoint
CREATE INDEX "schedule_periods_date_range_idx" ON "schedule_periods" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_versions_period_revision_uq" ON "schedule_versions" USING btree ("schedule_period_id","revision_number");--> statement-breakpoint
CREATE INDEX "schedule_versions_period_state_idx" ON "schedule_versions" USING btree ("schedule_period_id","state");--> statement-breakpoint
CREATE UNIQUE INDEX "shift_assignments_version_employee_work_date_uq" ON "shift_assignments" USING btree ("schedule_version_id","employee_id","work_date");--> statement-breakpoint
CREATE INDEX "shift_assignments_employee_work_date_idx" ON "shift_assignments" USING btree ("employee_id","work_date");--> statement-breakpoint
CREATE INDEX "shift_assignments_version_work_date_idx" ON "shift_assignments" USING btree ("schedule_version_id","work_date");--> statement-breakpoint
CREATE UNIQUE INDEX "holidays_date_name_uq" ON "holidays" USING btree ("date","name");--> statement-breakpoint
CREATE INDEX "holidays_date_active_idx" ON "holidays" USING btree ("date","is_active");--> statement-breakpoint
CREATE INDEX "shift_type_versions_identity_effective_idx" ON "shift_type_versions" USING btree ("shift_type_id","effective_from","effective_to");--> statement-breakpoint
CREATE UNIQUE INDEX "shift_types_code_uq" ON "shift_types" USING btree ("code");