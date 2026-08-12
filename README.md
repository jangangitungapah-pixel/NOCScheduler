# NOCScheduler

Internal NOC scheduling and payroll operational workspace.

The repository is implemented from the canonical product specifications in `docs/prd/` and the engineering execution roadmap in `docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md`.

## Current implementation phase

- **WP-F00 — Project Setup & Engineering Baseline: ACCEPTED**
- **WP-F01 — Frontend Foundation & Design System: ACCEPTED**
- **WP-F02 — Application Shell, Navigation & Responsive Frame: COMPLETE — awaiting user acceptance**
- WP-F03 has not started.

F02 is intentionally a shell/reference phase. High-fidelity business surfaces and fixture-driven feature content begin in WP-F03.

## Review routes

With `pnpm dev` running on port 3000, review:

- application shell: `http://localhost:3000/dashboard`
- My Schedule shell: `http://localhost:3000/schedule/me`
- Team Schedule shell: `http://localhost:3000/schedule/team`
- Payroll shell: `http://localhost:3000/payroll`
- Settings shell: `http://localhost:3000/settings`
- login boundary outside the shell: `http://localhost:3000/login`
- F01 design-system reference: `http://localhost:3000/design-system`

The root route `/` currently redirects the temporary authenticated fixture to `/dashboard`. Real authentication/session routing is intentionally deferred to WP-F05.

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

F02 separates development, production build, and Playwright outputs so normal development does not fight with build/E2E manifests or port locks:

```text
pnpm dev     → .next-dev      → port 3000
pnpm build   → .next-build
pnpm e2e     → .next-e2e      → isolated production server on port 3100
```

Because Playwright no longer reuses the normal development server, `pnpm dev` can remain running while `pnpm e2e` executes.

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

The F02 CI gate is read-only, uses a frozen lockfile, runs the full static/application quality suite, and executes the full Playwright acceptance suite.

See `CONTRIBUTING.md`, `src/components/ui/README.md`, and `docs/engineering/` for engineering conventions and phase verification records.
