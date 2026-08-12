CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "shift_type_versions"
  ADD CONSTRAINT "shift_type_versions_no_effective_overlap"
  EXCLUDE USING gist (
    "shift_type_id" WITH =,
    daterange("effective_from", "effective_to", '[)') WITH &&
  );

ALTER TABLE "employee_salary_versions"
  ADD CONSTRAINT "employee_salary_versions_no_effective_overlap"
  EXCLUDE USING gist (
    "employee_id" WITH =,
    daterange("effective_from", "effective_to", '[)') WITH &&
  );

ALTER TABLE "shift_incentive_versions"
  ADD CONSTRAINT "shift_incentive_versions_no_effective_overlap"
  EXCLUDE USING gist (
    "shift_type_id" WITH =,
    daterange("effective_from", "effective_to", '[)') WITH &&
  );

CREATE UNIQUE INDEX "schedule_versions_one_published_per_period_uq"
  ON "schedule_versions" ("schedule_period_id")
  WHERE "state" = 'PUBLISHED';

CREATE UNIQUE INDEX "replacement_assignments_one_approved_per_original_uq"
  ON "replacement_assignments" ("original_assignment_id")
  WHERE "status" = 'APPROVED';

ALTER TABLE "payroll_revisions"
  ADD CONSTRAINT "payroll_revisions_id_record_uq"
  UNIQUE ("id", "payroll_record_id");

ALTER TABLE "payroll_records"
  ADD CONSTRAINT "payroll_records_current_revision_fk"
  FOREIGN KEY ("current_revision_id", "id")
  REFERENCES "payroll_revisions" ("id", "payroll_record_id")
  ON DELETE RESTRICT
  DEFERRABLE INITIALLY DEFERRED;

CREATE OR REPLACE FUNCTION nocscheduler_prevent_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$;

CREATE TRIGGER audit_events_append_only_guard
BEFORE UPDATE OR DELETE ON "audit_events"
FOR EACH ROW EXECUTE FUNCTION nocscheduler_prevent_audit_mutation();

CREATE OR REPLACE FUNCTION nocscheduler_prevent_historical_schedule_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD."state" <> 'DRAFT' THEN
    RAISE EXCEPTION 'historical schedule versions cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER schedule_versions_historical_delete_guard
BEFORE DELETE ON "schedule_versions"
FOR EACH ROW EXECUTE FUNCTION nocscheduler_prevent_historical_schedule_delete();
