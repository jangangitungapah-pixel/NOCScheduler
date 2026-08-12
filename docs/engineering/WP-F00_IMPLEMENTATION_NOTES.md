# WP-F00 — Project Setup & Engineering Baseline — Implementation Notes

> Status: CI bootstrap in progress  
> Workplan: `WP-F00`  
> PRD anchors: PRD-14, PRD-16, PRD-19, PRD-20

## Scope implemented

- Next.js App Router + React + TypeScript strict baseline.
- Node.js 24 and pnpm 11 runtime contract.
- ESLint flat config + Prettier deterministic formatting.
- `@/*` path alias and modular-monolith ownership documentation.
- Zod runtime environment validation and safe `.env.example`.
- Vitest + Testing Library baseline tests.
- Playwright Chromium smoke test.
- Tailwind CSS PostCSS integration.
- Initial semantic CSS variable infrastructure only; full PRD-11 design system remains WP-F01.
- Liveness route at `/api/health/live`; DB-aware readiness remains a later production/data phase.
- GitHub Actions quality workflow.
- Repository contribution conventions.
- pnpm dependency-build security policy with version-scoped approvals in `pnpm-workspace.yaml`.

## Dependency build policy

pnpm 11 rejects unreviewed dependency lifecycle scripts. WP-F00 explicitly permits only the currently resolved versions needed by the baseline:

- `sharp@0.34.5`
- `unrs-resolver@1.12.2`

The allow-list is intentionally version-scoped. A future dependency version change must be reviewed rather than inheriting script execution permission silently.

## Intentional boundaries

WP-F00 does **not** implement:

- product design-system components,
- application navigation shell,
- authentication,
- PostgreSQL/Drizzle schema,
- scheduling/payroll business logic,
- production deployment topology.

Those remain assigned to later workplan phases.

## Exit-gate verification

The CI bootstrap generates `pnpm-lock.yaml` using the pinned pnpm version only after dependency install and all quality gates are valid. The first successful bootstrap run commits that reviewed lockfile. The following run must prove a frozen install.

Final acceptance requires:

- [ ] committed `pnpm-lock.yaml`,
- [ ] clean frozen install,
- [ ] format check green,
- [ ] lint green,
- [ ] typecheck green,
- [ ] Vitest green,
- [ ] production build green,
- [ ] Playwright smoke green,
- [ ] GitHub Actions green,
- [ ] no real secret committed.
