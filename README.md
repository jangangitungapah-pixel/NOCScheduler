# NOCScheduler

Internal NOC scheduling and payroll operational workspace.

The repository is implemented from the canonical product specifications in `docs/prd/` and the engineering execution roadmap in `docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md`.

## Current implementation phase

- **WP-F00 — Project Setup & Engineering Baseline: ACCEPTED**
- **WP-F01 — Frontend Foundation & Design System: ACCEPTED**
- **WP-F02 — Application Shell, Navigation & Responsive Frame: ACCEPTED**
- **WP-F03 — High-Fidelity Frontend Product Surfaces: ACCEPTED**
- **WP-F04 — Database & Domain Foundation: COMPLETE — awaiting user acceptance**
- WP-F05 has not started.

WP-F04 establishes the PostgreSQL/Drizzle historical data foundation. The high-fidelity WP-F03 product surfaces still use frontend fixtures until later full-stack phases intentionally replace them with server-authoritative APIs.

## F04 database foundation

F04 adds:

- PostgreSQL 17 local/test service through `compose.yaml`,
- Drizzle ORM schema modules and Drizzle Kit migration workflow,
- committed zero-database migrations under `drizzle/`,
- identity + employee + team entities,
- role/permission/effective user-role entities,
- stable shift identities + effective-dated shift versions,
- schedule period/version/assignment history,
- canonical schedule request parent + exception/swap/replacement/overtime records,
- effective-dated salary and shift incentive versions,
- payroll period/record/revision/item/source/adjustment history,
- holidays, settings, notifications, and append-oriented audit events,
- row-version fields and critical indexes/unique constraints,
- PostgreSQL historical/effective-range guards,
- central `Asia/Jakarta` business-date utilities,
- integer-IDR money utilities,
- deterministic seed data,
- executable PostgreSQL contract tests.

The database model intentionally treats historical correctness as part of application correctness. Published schedule history, effective-dated compensation, payroll revisions, and audit evidence are not modeled as disposable current-state rows.

## Local PostgreSQL setup

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Create local environment configuration and install dependencies:

```bash
cp .env.example .env.local
pnpm install --frozen-lockfile
```

Apply the committed migrations and deterministic seed:

```bash
pnpm db:migrate
pnpm db:seed
```

Useful database commands:

```bash
pnpm db:check
pnpm db:studio
pnpm test:db
```

`pnpm db:reset:test` is destructive and exists for disposable local/test databases only. It drops and recreates the public schema before migration/seed verification.

## F03 review routes

With `pnpm dev` running on port 3000, the accepted high-fidelity fixture surfaces remain available on:

- Dashboard: `http://localhost:3000/dashboard`
- My Schedule: `http://localhost:3000/schedule/me`
- Team Schedule: `http://localhost:3000/schedule/team`
- Manage Schedule: `http://localhost:3000/schedule/manage`
- Requests: `http://localhost:3000/schedule/requests`
- Request create flow: `http://localhost:3000/schedule/requests?create=1`
- Employees: `http://localhost:3000/employees`
- Employee history: `http://localhost:3000/employees/emp-001/history`
- Payroll Overview: `http://localhost:3000/payroll`
- Monthly Payroll: `http://localhost:3000/payroll/2026-08`
- Reports: `http://localhost:3000/reports`
- Activity History: `http://localhost:3000/activity`
- Settings / Shifts: `http://localhost:3000/settings/shifts`
- Notifications: `http://localhost:3000/notifications`
- Profile fixture: `http://localhost:3000/profile`
- login boundary outside the shell: `http://localhost:3000/login`
- F01 design-system reference: `http://localhost:3000/design-system`

The root route `/` currently redirects the temporary authenticated fixture to `/dashboard`. Real authentication/session routing begins in WP-F05.

## Stack baseline

- Next.js 16 App Router
- React 19
- TypeScript strict
- pnpm 11.17.0
- PostgreSQL 17
- Drizzle ORM 0.45.2
- Drizzle Kit 0.31.10
- Tailwind CSS
- Zod
- Vitest + Testing Library
- Playwright

## Development

Requires Node.js 24.x. The project pins pnpm in `package.json`.

### Standard setup

```bash
corepack enable
corepack install
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

### Windows PowerShell without Administrator rights

Some Windows Node installations live under `C:\Program Files\nodejs`. In that setup, `corepack enable` can fail with `EPERM` because Corepack cannot create the `pnpm` shim next to the Node executable.

You do not need to weaken Windows permissions or run the project as Administrator. Corepack can invoke the pinned package manager directly:

```powershell
corepack install
Copy-Item .env.example .env.local -Force
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

If you prefer the short `pnpm` command for the current PowerShell session, define a temporary function:

```powershell
function pnpm { corepack pnpm @args }
pnpm --version
```

## Isolated Next.js local outputs

Development, production build, and Playwright outputs are separated so normal development does not fight with build/E2E manifests or port locks:

```text
pnpm dev     → .next-dev      → port 3000
pnpm build   → .next-build
pnpm e2e     → .next-e2e      → isolated production server on port 3100
```

Because Playwright does not reuse the normal development server, `pnpm dev` can remain running while `pnpm e2e` executes.

## Quality

Application quality:

```bash
pnpm quality
pnpm e2e
```

F04 database contract verification against a disposable database:

```bash
pnpm db:reset:test
pnpm db:migrate
pnpm db:seed
pnpm test:db
```

The F04 CI gate is read-only, uses a frozen lockfile and PostgreSQL service, validates the migration journal, proves a clean zero-database migration/seed/contract cycle, runs Prettier/ESLint/Next route type generation/TypeScript/Vitest/production build, and retains the full Playwright regression suite.

See `CONTRIBUTING.md`, `src/components/ui/README.md`, `docs/engineering/WP-F03_IMPLEMENTATION_NOTES.md`, and `docs/engineering/WP-F04_IMPLEMENTATION_NOTES.md` for engineering conventions and phase verification records.
