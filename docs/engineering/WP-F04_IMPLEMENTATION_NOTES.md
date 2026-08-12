# WP-F04 — Database & Domain Foundation — Implementation Notes

> Status: **SUPERSEDED by WP-F04R / PRD-21 — historical engineering record only**  
> Workplan: `WP-F04`  
> PRD anchors: PRD-03 through PRD-09, PRD-14, PRD-15, PRD-16, PRD-19  
> Final implementation commit before handoff docs: `f6ce3b07afb4b8ac4acfbf691ad3f8efef80b1b9`  
> Final read-only technical verification run: `31627520614`

## Supersession notice

This PostgreSQL/Drizzle implementation was completed technically but was superseded before acceptance when the owner selected a fully managed Firebase architecture. It is retained only to explain repository history. Active implementation must follow `PRD-21_Firebase_Platform_Architecture_Amendment.md` and `WP-F04R`.

## Goal

Establish the PostgreSQL and domain-data foundation before authentication, API, scheduling, request, and payroll engines begin consuming real persistence. The primary requirement is historical correctness: configuration and operational state may evolve without silently rewriting past schedule/payroll meaning.

## Technology foundation

- PostgreSQL 17 local/test runtime.
- Drizzle ORM `0.45.2`.
- Drizzle Kit `0.31.10`.
- `pg` Node driver.
- `tsx` for deterministic database utility scripts.
- Docker Compose local PostgreSQL service.
- Version-scoped pnpm build-script approvals for reviewed native/build dependencies.

Drizzle schema is split by domain instead of being one monolithic schema file. Drizzle Kit generates the structural migration and a reviewed custom SQL migration adds PostgreSQL-specific historical constraints that are clearer and stronger as explicit SQL.

## Committed migrations

F04 currently has two committed migration units:

1. `drizzle/20260812182344_f04_domain_foundation.sql`
   - canonical enums,
   - canonical tables,
   - foreign keys,
   - ordinary checks,
   - indexes and unique constraints.
2. `drizzle/20260812182346_f04_historical_guards.sql`
   - `btree_gist` support,
   - effective-range exclusion constraints,
   - one-published-version partial unique guard,
   - approved-replacement uniqueness guard,
   - payroll current-revision ownership constraint,
   - append-only audit trigger,
   - non-draft schedule history delete guard.

The final CI does **not** regenerate migrations. It installs from the frozen lockfile and verifies the committed migration journal and clean installation path.

## Domain schema implemented

### Identity and employees

- `teams`
- `users`
- `employees`

User identity and employee operational identity remain separate. Employee history can therefore remain even when a future account is disabled or detached.

### Authorization foundation

- `roles`
- `permissions`
- `role_permissions`
- `user_roles`

Role assignment is effective-dated and scope-aware (`SELF`, `TEAM`, `ALL`). F04 provides persistence only; server-authoritative capability evaluation starts in F05.

### Shift configuration

- `shift_types` as stable identities.
- `shift_type_versions` as effective-dated definitions.

The schema preserves local start/end time, cross-midnight intent, display order, visual semantic token, and effective range. PostgreSQL rejects overlapping effective versions for one shift identity.

### Scheduling

- `schedule_periods`
- `schedule_versions`
- `shift_assignments`

Important invariants include:

- one assignment row per schedule version + employee + work date,
- explicit `SHIFT` vs `OFF`, while `UNASSIGNED` remains absence of a row,
- SHIFT assignment requires shift/version/start/end data,
- OFF assignment forbids shift/time data,
- schedule version history is revisioned,
- only one published schedule version may exist per period,
- non-draft historical schedule versions cannot be destructively deleted through normal SQL mutation.

### Requests and operational exceptions

- `schedule_requests` is the canonical generic request parent.
- `workforce_exceptions`
- `exception_assignment_links`
- `replacement_assignments`
- `shift_swap_requests`
- `overtime_records`

The request parent supports the canonical baseline types:

- LEAVE,
- SICK,
- PERMISSION,
- TRAINING,
- BUSINESS_DUTY,
- SCHEDULE_CHANGE,
- SHIFT_SWAP,
- REPLACEMENT,
- OVERTIME.

Approved domain records can preserve their originating request ID. Request-to-exception/swap/replacement/overtime linkage is unique where the model expects one canonical child record, preventing ambiguous duplicate realization of one request.

### Compensation

- `employee_salary_versions`
- `shift_incentive_versions`

Both use `[effective_from, effective_to)` semantics and PostgreSQL exclusion constraints to reject overlapping effective ranges. Money is integer IDR.

### Payroll

- `payroll_periods`
- `payroll_records`
- `payroll_revisions`
- `payroll_items`
- `payroll_item_sources`
- `payroll_adjustments`

Payroll lifecycle status is separated from revision history. `is_dirty` uses a native PostgreSQL boolean. Current revision ownership is protected by a composite foreign-key contract so a payroll record cannot point at another employee record's revision. Amount columns use integer rupiah storage; quantitative non-money values may use explicit fixed-scale numeric values.

### Configuration and awareness

- `holidays`
- `system_settings`
- `notifications`

Holiday storage intentionally does not imply OFF. Settings are typed rather than an unrestricted unstructured dump. Notification persistence is only the data foundation; policy/dedup/staleness behavior remains later work.

### Audit

- `audit_events`

Audit is append-oriented. A PostgreSQL trigger rejects UPDATE or DELETE on audit rows. Actor, resource, severity, reason, before/after snapshot, request ID, correlation ID, IP, and user-agent fields are available for later application-level writers.

## Historical and integrity protections

F04 establishes database-level protection for critical invariants instead of relying only on future service code:

- foreign keys default toward `RESTRICT` for historical business references,
- effective-dated shift/salary/incentive overlap is rejected,
- duplicate employee/work-date assignment inside one schedule version is rejected,
- multiple published schedule versions for one period are rejected,
- a historical shift version referenced by an assignment cannot be deleted,
- published/non-draft schedule version destructive deletion is rejected,
- duplicate payroll employee record per period is rejected,
- payroll record cannot reference another record's revision,
- audit mutation is rejected,
- row-version fields exist on mutable aggregate roots for later optimistic concurrency.

## Asia/Jakarta business-date module

`src/domain/core/business-date.ts` centralizes:

- `Asia/Jakarta` business timezone,
- strict `YYYY-MM-DD` business date parsing,
- business-date formatting from absolute instants,
- local Jakarta date/time → absolute instant conversion,
- cross-midnight shift interval construction,
- work-date anchoring to shift start date.

Unit regression proves an S3 `23:00–07:00 (+1 hari)` interval maps to the correct UTC instants while retaining the original work date.

## Integer-IDR money module

`src/domain/core/money.ts` provides a branded integer-IDR value contract with:

- safe-integer validation,
- non-negative money validation,
- integer addition,
- integer rate × count calculation,
- IDR formatting with no implicit fractional rupiah.

This is a low-level foundation; canonical payroll formulas are implemented later in WP-F09.

## Deterministic seed

`src/db/seed.ts` uses stable UUIDs and idempotent insert semantics for:

- one NOC team,
- Administrator / Scheduler / NOC Member users,
- linked employee identities,
- baseline roles and permissions,
- effective user-role assignments,
- S1/S2/S3 identities and versions,
- baseline salaries,
- S1/S2/S3 incentive versions,
- default `Asia/Jakarta` and `IDR` settings.

Seed data is development/test fixture data, not production payroll truth.

## Database contract test

`scripts/db-contract-test.ts` runs against real PostgreSQL after a clean reset/migration/seed cycle. It proves, among other contracts:

- deterministic seed presence,
- payroll dirty columns are PostgreSQL boolean,
- overlapping salary version is rejected,
- overlapping shift version is rejected,
- one generic request cannot materialize duplicate exception records,
- duplicate employee/work-date assignment is rejected,
- referenced historical shift version deletion is rejected,
- multiple published schedule revisions are rejected,
- published schedule destructive deletion is rejected,
- duplicate payroll record is rejected,
- cross-record payroll revision ownership is rejected,
- audit UPDATE is rejected,
- default timezone remains `Asia/Jakarta`.

## Local/test database workflow

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Install/apply/seed:

```bash
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm db:seed
```

Disposable database verification:

```bash
pnpm db:reset:test
pnpm db:migrate
pnpm db:seed
pnpm test:db
```

`db:reset:test` is intentionally destructive and must only be aimed at disposable local/test databases.

## CI and defect history

F04 used CI failures as contract feedback:

1. The first dependency install was stopped by pnpm because new `esbuild` lifecycle scripts were not allow-listed.
2. The build scripts were reviewed and added to the version-scoped `allowBuilds` policy instead of bypassing pnpm supply-chain protection.
3. The first successful database bootstrap proved migration/seed/DB contracts but Prettier rejected newly generated Drizzle metadata because generation happened after the formatting step.
4. Generated metadata formatting was moved after migration generation.
5. The bootstrap then passed clean migration, DB contracts, lint/type/test/build and committed canonical lock/migration output.
6. A final semantic audit found two model-quality issues: missing canonical generic request persistence and integer-emulated payroll dirty flags.
7. The schema was polished to add `schedule_requests`, child request linkage, native boolean dirty flags, and removal of the redundant replacement index.
8. Migrations were regenerated once before F04 acceptance because the database foundation had not yet been released/accepted.
9. The polished bootstrap passed clean PostgreSQL installation and expanded contracts.
10. Workflow permissions were restored to `contents: read`.
11. Final run `31627520614` passed frozen dependency install, application quality, migration journal validation, clean reset/migrate/seed/database contracts, Chromium installation, and the full retained Playwright regression suite.

## Final CI posture

The committed `.github/workflows/quality.yml` is read-only and uses:

- frozen lockfile,
- PostgreSQL service,
- application quality suite,
- `drizzle-kit check`,
- clean test DB reset/migrate/seed/contract verification,
- full Playwright regression.

No migration generation or repository write occurs in the final F04 gate.

## Intentional boundaries

WP-F04 does **not** implement:

- Better Auth,
- cookie/session restoration,
- server authorization/capability evaluation,
- last-admin business guard,
- employee/settings/access HTTP APIs,
- scheduling commands or publication service,
- request approval execution engine,
- payroll calculation/finalize/lock engine,
- real notification policy,
- production deployment/database credentials.

Those responsibilities remain in later phases. In particular, **WP-F05 — Authentication, Authorization, Employee & Settings Foundation has not started**.

## Exit-gate checklist

- [x] PostgreSQL local/test environment.
- [x] Drizzle schema + migration flow.
- [x] Identity/employee model.
- [x] role/permission/effective user-role model.
- [x] stable shift identity + effective version model.
- [x] schedule period/version/assignment model.
- [x] request/exception/swap/replacement/overtime model.
- [x] effective salary/incentive model.
- [x] payroll period/record/revision/item/source/adjustment model.
- [x] settings/holiday/notification model.
- [x] append-oriented audit model.
- [x] optimistic-concurrency row-version foundation.
- [x] critical indexes and uniqueness constraints.
- [x] historical delete/cascade guards.
- [x] central Asia/Jakarta business-date module.
- [x] integer-IDR money module.
- [x] deterministic seed.
- [x] executable PostgreSQL contract tests.
- [x] clean migration from zero database.
- [x] effective-version overlap rejection.
- [x] duplicate critical state rejection.
- [x] deterministic test DB reset.
- [x] final read-only CI + frontend regression.

## Handoff

WP-F04 implementation is complete and intentionally stops before WP-F05. Review the database model, migration strategy, local setup, and historical/integrity contracts. WP-F05 must not begin until explicit user acceptance.
