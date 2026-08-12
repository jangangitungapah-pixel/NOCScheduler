import assert from "node:assert/strict";
import { Client, type DatabaseError } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for test:db");

const client = new Client({ connectionString: databaseUrl });

async function expectPgError(run: () => Promise<unknown>, code: string, label: string) {
  try {
    await run();
    assert.fail(`${label}: expected PostgreSQL error ${code}`);
  } catch (error) {
    const pgError = error as DatabaseError;
    assert.equal(pgError.code, code, `${label}: unexpected PostgreSQL error ${pgError.code}`);
  }
}

await client.connect();

try {
  const seedCounts = await client.query<{ employees: string; shifts: string }>(`
    select
      (select count(*) from employees)::text as employees,
      (select count(*) from shift_types)::text as shifts
  `);
  assert.equal(seedCounts.rows[0]?.employees, "3");
  assert.equal(seedCounts.rows[0]?.shifts, "3");

  const member = await client.query<{ id: string }>("select id from employees where employee_code = 'NOC-003'");
  const scheduler = await client.query<{ id: string }>("select id from employees where employee_code = 'NOC-002'");
  const s2 = await client.query<{ id: string }>("select id from shift_types where code = 'S2'");
  const s3Version = await client.query<{ id: string; shift_type_id: string }>(`
    select stv.id, stv.shift_type_id
    from shift_type_versions stv
    join shift_types st on st.id = stv.shift_type_id
    where st.code = 'S3' and stv.effective_to is null
  `);

  assert.ok(member.rows[0]?.id);
  assert.ok(scheduler.rows[0]?.id);
  assert.ok(s2.rows[0]?.id);
  assert.ok(s3Version.rows[0]?.id);

  await expectPgError(
    () =>
      client.query(
        `insert into employee_salary_versions
          (employee_id, base_salary_amount, currency, effective_from)
         values ($1, 6500000, 'IDR', '2026-06-01')`,
        [member.rows[0]!.id],
      ),
    "23P01",
    "overlapping employee salary version",
  );

  await expectPgError(
    () =>
      client.query(
        `insert into shift_type_versions
          (shift_type_id, name, short_name, start_time, end_time, crosses_midnight, display_order, visual_token, effective_from)
         values ($1, 'Overlapping S2', 'S2', '15:00', '23:00', false, 2, 'shift-2', '2026-05-01')`,
        [s2.rows[0]!.id],
      ),
    "23P01",
    "overlapping shift version",
  );

  const periodId = "10000000-0000-4000-8000-000000000001";
  const draftVersionId = "10000000-0000-4000-8000-000000000002";
  const publishedVersionId = "10000000-0000-4000-8000-000000000003";

  await client.query(
    `insert into schedule_periods (id, period_code, start_date, end_date, timezone)
     values ($1, 'contract-2026-08', '2026-08-01', '2026-08-31', 'Asia/Jakarta')`,
    [periodId],
  );
  await client.query(
    `insert into schedule_versions (id, schedule_period_id, revision_number, state)
     values ($1, $2, 1, 'DRAFT')`,
    [draftVersionId, periodId],
  );
  await client.query(
    `insert into shift_assignments
      (schedule_version_id, employee_id, work_date, primary_state, shift_type_id, shift_type_version_id, start_at, end_at, source_type)
     values ($1, $2, '2026-08-13', 'SHIFT', $3, $4, '2026-08-13T16:00:00Z', '2026-08-14T00:00:00Z', 'MANUAL')`,
    [draftVersionId, member.rows[0]!.id, s3Version.rows[0]!.shift_type_id, s3Version.rows[0]!.id],
  );

  await expectPgError(
    () =>
      client.query(
        `insert into shift_assignments
          (schedule_version_id, employee_id, work_date, primary_state, shift_type_id, shift_type_version_id, start_at, end_at, source_type)
         values ($1, $2, '2026-08-13', 'SHIFT', $3, $4, '2026-08-13T16:00:00Z', '2026-08-14T00:00:00Z', 'MANUAL')`,
        [draftVersionId, member.rows[0]!.id, s3Version.rows[0]!.shift_type_id, s3Version.rows[0]!.id],
      ),
    "23505",
    "duplicate primary assignment",
  );

  await expectPgError(
    () => client.query("delete from shift_type_versions where id = $1", [s3Version.rows[0]!.id]),
    "23503",
    "historical shift version delete",
  );

  await client.query(
    `insert into schedule_versions
      (id, schedule_period_id, revision_number, state, published_at, publication_reason)
     values ($1, $2, 2, 'PUBLISHED', now(), 'Contract publication')`,
    [publishedVersionId, periodId],
  );

  await expectPgError(
    () =>
      client.query(
        `insert into schedule_versions
          (schedule_period_id, revision_number, state, published_at, publication_reason)
         values ($1, 3, 'PUBLISHED', now(), 'Duplicate published state')`,
        [periodId],
      ),
    "23505",
    "multiple published schedule versions",
  );

  await expectPgError(
    () => client.query("delete from schedule_versions where id = $1", [publishedVersionId]),
    "P0001",
    "published schedule delete guard",
  );

  const payrollPeriodId = "20000000-0000-4000-8000-000000000001";
  const memberPayrollRecordId = "20000000-0000-4000-8000-000000000002";
  const schedulerPayrollRecordId = "20000000-0000-4000-8000-000000000003";
  const memberRevisionId = "20000000-0000-4000-8000-000000000004";

  await client.query(
    `insert into payroll_periods (id, period_code, start_date, end_date, timezone)
     values ($1, 'contract-payroll-2026-08', '2026-08-01', '2026-08-31', 'Asia/Jakarta')`,
    [payrollPeriodId],
  );
  await client.query(
    `insert into payroll_records (id, payroll_period_id, employee_id)
     values ($1, $2, $3), ($4, $2, $5)`,
    [
      memberPayrollRecordId,
      payrollPeriodId,
      member.rows[0]!.id,
      schedulerPayrollRecordId,
      scheduler.rows[0]!.id,
    ],
  );

  await expectPgError(
    () =>
      client.query(
        `insert into payroll_records (payroll_period_id, employee_id)
         values ($1, $2)`,
        [payrollPeriodId, member.rows[0]!.id],
      ),
    "23505",
    "duplicate payroll record",
  );

  await client.query(
    `insert into payroll_revisions
      (id, payroll_record_id, revision_number, base_salary_snapshot, gross_earnings, calculated_take_home_pay)
     values ($1, $2, 1, 6000000, 6800000, 6800000)`,
    [memberRevisionId, memberPayrollRecordId],
  );
  await client.query("update payroll_records set current_revision_id = $1 where id = $2", [
    memberRevisionId,
    memberPayrollRecordId,
  ]);

  await expectPgError(
    () =>
      client.query("update payroll_records set current_revision_id = $1 where id = $2", [
        memberRevisionId,
        schedulerPayrollRecordId,
      ]),
    "23503",
    "cross-record payroll revision reference",
  );

  const auditId = "30000000-0000-4000-8000-000000000001";
  await client.query(
    `insert into audit_events (id, actor_type, action, entity_type, entity_id, reason)
     values ($1, 'SYSTEM', 'contract.created', 'contract', $2, 'F04 contract test')`,
    [auditId, periodId],
  );
  await expectPgError(
    () => client.query("update audit_events set reason = 'mutated' where id = $1", [auditId]),
    "P0001",
    "append-only audit update guard",
  );

  const settings = await client.query<{ value: string }>(
    "select value #>> '{}' as value from system_settings where key = 'default_timezone'",
  );
  assert.equal(settings.rows[0]?.value, "Asia/Jakarta");

  console.log("F04 database contract tests passed.");
} finally {
  await client.end();
}
