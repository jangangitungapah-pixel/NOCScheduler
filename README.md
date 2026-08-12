# NOCScheduler

Internal NOC scheduling and payroll operational workspace.

The repository is implemented from the canonical product specifications in `docs/prd/` and the engineering execution roadmap in `docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md`.

## Current implementation phase

- **WP-F00 — Project Setup & Engineering Baseline: ACCEPTED**
- **WP-F01 — Frontend Foundation & Design System: ACCEPTED**
- **WP-F02 — Application Shell, Navigation & Responsive Frame: ACCEPTED**
- **WP-F03 — High-Fidelity Frontend Product Surfaces: ACCEPTED**
- **WP-F04 — PostgreSQL/Drizzle Database Foundation: SUPERSEDED by Firebase rebaseline**
- **WP-F04R — Firebase Platform & Domain Foundation: COMPLETE — awaiting user acceptance**
- WP-F05 has not started.

The architecture pivot is canonicalized by `docs/prd/PRD-21_Firebase_Platform_Architecture_Amendment.md`. Product behavior and historical correctness requirements remain intact; only the infrastructure/persistence/authentication platform is being rebaselined before WP-F05.

## Firebase target architecture

```text
Browser
  → Next.js
  → Firebase App Hosting managed runtime
  → Next.js server/API/domain services
  → Firebase Admin SDK
  → Cloud Firestore

Browser authentication
  → Firebase Authentication

Local development / CI
  → Firebase Local Emulator Suite
     ├─ Authentication emulator :9099
     ├─ Cloud Firestore emulator :8080
     └─ Emulator UI :4000
```

NOCScheduler no longer requires a self-managed application server, PostgreSQL, Drizzle, or Docker as a development prerequisite.

Critical schedule/payroll/access mutations remain server-authoritative. F04R Firestore Security Rules start fail-closed, while privileged server code uses Firebase Admin SDK and explicit domain authorization/invariants. F05 will introduce Firebase Authentication and capability-aware access.

## Stack baseline

- Next.js 16 App Router
- React 19
- TypeScript strict
- pnpm 11.17.0
- Firebase App Hosting
- Firebase Authentication
- Cloud Firestore
- Firebase Admin SDK
- Firebase Local Emulator Suite
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

If `corepack enable` cannot create a pnpm shim under `C:\Program Files\nodejs`, invoke the pinned package manager through Corepack directly:

```powershell
corepack install
Copy-Item .env.example .env.local -Force
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Optional temporary shorthand for the current PowerShell session:

```powershell
function pnpm { corepack pnpm @args }
pnpm --version
```

## Local Firebase emulators

Install a Java 21+ JDK for the current Firebase Emulator Suite baseline. No Docker or local PostgreSQL service is required.

Start local Auth + Firestore emulators:

```powershell
corepack pnpm firebase:emulators
```

The default `.env.example` and `.firebaserc` use the isolated project ID `demo-nocscheduler`. The seed script refuses to run unless it is connected to the Firestore emulator and the project ID starts with `demo-`.

Run the deterministic Firebase foundation test suite:

```powershell
corepack pnpm firebase:test
```

This runs the Firestore emulator, deterministic seed, Admin SDK contract checks, and Firestore Security Rules tests.

## Firebase production project

A real Firebase project is intentionally **not** encoded in the repository. Production onboarding will connect this repository to the owner's Firebase project and App Hosting backend without committing service-account keys.

Useful authenticated CLI helpers after a Firebase project exists:

```powershell
corepack pnpm firebase:login
corepack pnpm firebase:projects
```

Production web configuration belongs in the Firebase/App Hosting environment rather than hard-coded source files.

## Isolated Next.js local outputs

Development, production build, and Playwright outputs remain separated:

```text
pnpm dev     → .next-dev      → port 3000
pnpm build   → .next-build
pnpm e2e     → .next-e2e      → isolated production server on port 3100
```

Because Playwright does not reuse the normal development server, `pnpm dev` can remain running while `pnpm e2e` executes.

## Quality

With a normal pnpm shim:

```bash
pnpm quality
pnpm firebase:test
pnpm exec playwright install chromium
pnpm e2e
```

Without a pnpm shim on Windows:

```powershell
corepack pnpm quality
corepack pnpm firebase:test
corepack pnpm exec playwright install chromium
corepack pnpm e2e
```

The final F04R CI gate is read-only and verifies frozen dependency installation, static/application quality, Firebase Emulator Suite contracts/security rules, and the full Playwright regression suite.

## Accepted F03 review routes

The accepted high-fidelity product surfaces remain available while backend integration progresses:

- Dashboard: `http://localhost:3000/dashboard`
- My Schedule: `http://localhost:3000/schedule/me`
- Team Schedule: `http://localhost:3000/schedule/team`
- Manage Schedule: `http://localhost:3000/schedule/manage`
- Requests: `http://localhost:3000/schedule/requests`
- Employees: `http://localhost:3000/employees`
- Payroll: `http://localhost:3000/payroll`
- Reports: `http://localhost:3000/reports`
- Activity History: `http://localhost:3000/activity`
- Settings: `http://localhost:3000/settings/shifts`
- Notifications: `http://localhost:3000/notifications`
- Login boundary: `http://localhost:3000/login`
- F01 design system: `http://localhost:3000/design-system`

See `CONTRIBUTING.md`, `src/components/ui/README.md`, `docs/prd/PRD-21_Firebase_Platform_Architecture_Amendment.md`, and `docs/engineering/` for engineering conventions and phase verification records.
