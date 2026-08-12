# Contributing to NOCScheduler

## Source of truth

Implementation must follow `docs/prd/PRD-01` through `PRD-20` and the current master workplan. When a workplan task conflicts with a PRD requirement, the PRD wins and the plan must be corrected explicitly.

## Runtime

- Node.js 24.x
- pnpm 11.x (exact project package-manager version is pinned in `package.json`)

Preferred setup when Corepack can create package-manager shims:

```bash
corepack enable
corepack install
```

On Windows, `corepack enable` can fail with `EPERM` when Node.js is installed under a protected directory such as `C:\Program Files\nodejs`. In that case, do not loosen filesystem permissions just to create the shim. Invoke pnpm directly through Corepack instead:

```powershell
corepack install
corepack pnpm --version
```

For convenience in the current PowerShell session only:

```powershell
function pnpm { corepack pnpm @args }
```

## Local bootstrap

Standard shell:

```bash
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Windows PowerShell without a pnpm shim:

```powershell
Copy-Item .env.example .env.local -Force
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

## Quality gates

Before a phase/commit is considered ready:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm e2e:smoke
```

The equivalent no-shim Windows commands are:

```powershell
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm e2e:smoke
```

Use `pnpm quality` or `corepack pnpm quality` for the non-browser gates. The `quality` script directly invokes the underlying tools rather than recursively requiring a global `pnpm` command.

## Engineering rules

1. TypeScript stays in strict mode. Avoid routine `any`/unsafe casts.
2. Do not commit credentials, tokens, production dumps, or private keys.
3. Server/domain services are authoritative for scheduling, payroll, permission, and historical-integrity rules.
4. Keep modules ownership clear; shared `lib/` code must be truly cross-domain.
5. High-risk mutations require server authorization and, when introduced by the relevant phase, audit evidence and concurrency protection.
6. Use semantic design tokens. WP-F01 owns full visual-token/component implementation.
7. Desktop and mobile are separate acceptance targets for P0/P1 UI.
8. Keep changes phase-scoped and reviewable; do not jump to the next workplan phase before the current gate is accepted.

## Commit intent

Prefer focused conventional commits such as:

- `chore: bootstrap project engineering baseline`
- `feat: add schedule draft validation`
- `test: cover payroll historical stability`
- `docs: update phase handoff`
