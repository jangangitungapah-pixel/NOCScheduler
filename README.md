# NOCScheduler

Internal NOC scheduling and payroll operational workspace.

The repository is implemented from the canonical product specifications in `docs/prd/` and the engineering execution roadmap in `docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md`.

## Current implementation phase

**WP-F00 — Project Setup & Engineering Baseline**

Product UI/design-system implementation starts in WP-F01 after the F00 quality gate is accepted.

## Stack baseline

- Next.js 16 App Router
- React 19
- TypeScript strict
- pnpm
- Tailwind CSS
- Zod
- Vitest + Testing Library
- Playwright

## Development

```bash
corepack enable
corepack install
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Then open `http://localhost:3000`.

## Quality

```bash
pnpm quality
pnpm exec playwright install chromium
pnpm e2e:smoke
```

See `CONTRIBUTING.md` for engineering conventions.
