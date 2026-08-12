# NOCScheduler

Internal NOC scheduling and payroll operational workspace.

The repository is implemented from the canonical product specifications in `docs/prd/` and the engineering execution roadmap in `docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md`.

## Current implementation phase

- **WP-F00 — Project Setup & Engineering Baseline: ACCEPTED**
- **WP-F01 — Frontend Foundation & Design System: ACCEPTED**
- **WP-F02 — Application Shell, Navigation & Responsive Frame: ACCEPTED**
- **WP-F03 — High-Fidelity Frontend Product Surfaces: COMPLETE — awaiting user acceptance**
- WP-F04 has not started.

WP-F03 replaces shell placeholders with high-fidelity, fixture-driven product surfaces. The fixtures are frontend development contracts only: they are shaped toward the future domain/API model but are **not** persistent data or authoritative schedule/payroll business logic.

## F03 review routes

With `pnpm dev` running on port 3000, review both Desktop and Mobile, Light and Dark Mode:

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

The root route `/` currently redirects the temporary authenticated fixture to `/dashboard`. Real authentication/session routing is intentionally deferred to WP-F05.

## F03 responsive contracts

- Desktop keeps dense operational workspaces where scanning and comparison matter.
- My Schedule supports Month, Week, and Agenda interaction; compact mobile stays agenda-first.
- Team Schedule recomposes on mobile into real `By Day` and `By Employee` modes instead of shrinking the desktop matrix.
- Manage Schedule recomposes on mobile into focused date → employee → work-state selection and validation/publish review.
- Shift 3 cross-midnight timing is explicit as `23:00–07:00 (+1 hari)` where relevant.
- Mobile acceptance guards against accidental page-level horizontal overflow.
- Light/Dark Mode continue to use the same component tree and semantic design tokens.

## Stack baseline

- Next.js 16 App Router
- React 19
- TypeScript strict
- pnpm 11.17.0
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

With a normal pnpm shim:

```bash
pnpm quality
pnpm exec playwright install chromium
pnpm e2e
```

Without a pnpm shim on Windows:

```powershell
corepack pnpm quality
corepack pnpm exec playwright install chromium
corepack pnpm e2e
```

`quality` intentionally does not shell out to nested `pnpm` commands, so it works through both direct pnpm and `corepack pnpm` invocation.

The F03 CI gate is read-only, uses a frozen lockfile, runs Prettier, ESLint, Next route type generation, TypeScript, Vitest, production build, and the full Playwright acceptance suite.

See `CONTRIBUTING.md`, `src/components/ui/README.md`, and `docs/engineering/` for engineering conventions and phase verification records.
