# WP-F04R — Firebase Platform & Domain Foundation — Implementation Notes

> Status: **COMPLETE — awaiting user acceptance**  
> Workplan: `WP-F04R`  
> Canonical amendment: `PRD-21_Firebase_Platform_Architecture_Amendment.md`  
> Primary platform: Firebase App Hosting + Firebase Authentication + Cloud Firestore  
> Local/test platform: Firebase Local Emulator Suite  
> WP-F05: **NOT STARTED**  
> Bootstrap verification run: `31633756166`

## Why F04R exists

The original WP-F04 PostgreSQL/Drizzle foundation was completed technically, but the product owner changed the deployment constraint before accepting F04: NOCScheduler has a small internal user population and will use Firebase-managed infrastructure instead of a self-managed application/database server.

F04R therefore retires the PostgreSQL/Drizzle runtime path before authentication and backend integration become deeper. The product requirements do not shrink: scheduling, payroll, historical correctness, authorization, audit, responsive UX, and deterministic business rules remain canonical.

## Approved architecture

```text
Browser
  → Next.js application
  → Firebase App Hosting
  → Next.js server/API/domain layer
  → Firebase Admin SDK
  → Cloud Firestore

Browser identity
  → Firebase Authentication

Local / CI
  → Firebase Local Emulator Suite
```

## Scope

- remove Docker/PostgreSQL/Drizzle runtime and CI prerequisites,
- remove PostgreSQL migration/schema/seed scripts,
- pin Firebase JS SDK and Admin SDK,
- add Firebase project/emulator configuration,
- add App Hosting runtime configuration,
- create typed Firestore collection/domain contracts,
- retain `Asia/Jakarta` business-date and integer-IDR domain modules,
- add optimistic `rowVersion` transaction helper,
- add create-only immutable history helper,
- add deterministic emulator seed,
- add Firestore composite-index baseline,
- start Firestore Security Rules fail-closed,
- add Security Rules tests,
- add Firebase Admin/Firestore contract tests,
- rebaseline PRD/workplan architecture terminology,
- retain all F00–F03 UI/unit/E2E regressions.

## Historical integrity under Firestore

SQL constraints are no longer available, so F04R intentionally carries historical invariants into explicit domain patterns:

- stable document IDs,
- effective-dated version documents,
- snapshot data for financial/published facts,
- transaction-guarded optimistic concurrency,
- deterministic IDs/reservation documents for uniqueness where needed,
- create-only historical writes,
- server-authoritative mutation,
- append-oriented audit evidence,
- explicit composite indexes,
- deterministic emulator regression tests.

These mechanisms are foundational contracts. The owning business phases F05–F11 must implement and prove each concrete invariant before their exit gates.

## Security baseline

F04R uses a fail-closed Firestore rule set. Direct browser reads and writes are denied at this phase. F05 may open carefully selected authenticated reads with emulator-covered rules, but high-risk mutation remains server-authoritative.

Firebase Admin SDK bypasses Firestore Security Rules. Therefore all privileged server paths must perform authentication, capability/scope authorization, validation, and domain checks before Admin SDK writes. No service-account private key is committed.

## Local safety

The repository defaults to `demo-nocscheduler` for emulator work. The deterministic seed refuses to run unless:

1. `FIRESTORE_EMULATOR_HOST` is set, and
2. the Firebase project ID starts with `demo-`.

This prevents the seed command from accidentally populating a real Firebase project.

## Superseded F04 artifacts

The following implementation direction is retired from the active repository:

- `compose.yaml`,
- PostgreSQL local/test service,
- Drizzle ORM / Drizzle Kit,
- `drizzle/` SQL migration history,
- `drizzle.config.ts`,
- PostgreSQL schema modules under `src/db/`,
- PostgreSQL seed/reset/contract scripts,
- `DATABASE_URL` setup,
- PostgreSQL service in CI.

The previous F04 implementation notes remain as historical documentation but are marked superseded by F04R/PRD-21.

## Verification target

F04R is complete only when the final read-only CI gate passes:

- frozen pnpm install,
- Prettier,
- ESLint,
- Next route type generation,
- TypeScript,
- Vitest,
- production build,
- Firebase Emulator Suite deterministic seed,
- Admin SDK Firestore contract tests,
- Firestore Security Rules tests,
- full Playwright regression.

## Handoff

WP-F05 must remain unstarted until F04R is complete and explicitly reviewed. F05 will use Firebase Authentication and Firestore-backed identity/access/settings instead of Better Auth + PostgreSQL.
