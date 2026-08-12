# Contributing to NOCScheduler

## Source of truth

Implementation must follow `docs/prd/PRD-01` through `PRD-20` and the current master workplan. When a workplan task conflicts with a PRD requirement, the PRD wins and the plan must be corrected explicitly.

## Runtime

- Node.js 24.x
- pnpm 11.x (exact project package-manager version is pinned in `package.json`)

Enable Corepack if pnpm is not available:

```bash
corepack enable
corepack install
```

## Local bootstrap

```bash
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
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

Use `pnpm quality` for the non-browser gates.

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
