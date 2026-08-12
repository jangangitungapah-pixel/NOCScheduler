# WP-F02 — Application Shell, Navigation & Responsive Frame — Implementation Notes

> Status: **ACCEPTED**  
> Workplan: `WP-F02`  
> PRD anchors: PRD-06, PRD-07, PRD-10, PRD-11, PRD-12, PRD-13, PRD-19  
> Primary review route: `/dashboard`  
> Final technical verification run: `31619677210`

## Goal

Establish the final application frame that can host the product surfaces from WP-F03 onward without another structural navigation overhaul. The shell must preserve the canonical information architecture, support capability-aware visibility, provide equal-quality desktop/tablet/mobile composition, keep Light/Dark parity, and preserve the F01 design-system contracts.

## Scope implemented

### Canonical route and navigation model

- Root `/` currently redirects the temporary authenticated fixture to `/dashboard`.
- `/login` remains outside the authenticated application shell.
- Canonical route metadata and shell placeholders cover Dashboard, Schedule, Team, Employees, Payroll, Reports, Activity, Settings, Profile, and Notifications.
- Desktop navigation is grouped by user job rather than database entity.
- Capability-aware navigation filtering is centralized in `src/components/layout/navigation.ts`.
- Read-oriented routes remain broadly visible while mutation/system tools are hidden when the relevant capability is absent.
- Nested route matching preserves the correct active navigation area.

Real session-aware root routing and server-side authorization remain assigned to WP-F05. The F02 capability set is an explicit shell fixture, not a security boundary.

### Desktop application shell

- Persistent left sidebar with expanded and collapsed states.
- Compact brand block and grouped navigation.
- Clear active route state.
- Collapsed sidebar preserves route behavior and accessible labels.
- Compact global top bar with current area/page context.
- Global command/search entry point.
- Notification preview shell.
- Theme action.
- User/profile menu fixture.
- Skip link to main content.
- Main workspace can support normal content widths and later power-workspace surfaces.

### Tablet adaptation

- Desktop sidebar recomposes into a compact navigation rail at tablet widths.
- Labels and secondary chrome are reduced before the content workspace becomes cramped.
- Tablet behavior is driven by viewport/layout capability rather than device-name detection.

### Mobile application shell

- Desktop sidebar is removed from the mobile composition.
- Compact top application bar is used instead.
- Canonical bottom navigation is `Home | Schedule | Team | Payroll | More`.
- `More` opens a Bottom Sheet for lower-frequency navigation and appearance access.
- Bottom navigation and top shell account for safe-area insets.
- Main content reserves space for fixed bottom navigation instead of being covered by it.
- 390×844 acceptance verifies no page-level accidental horizontal overflow.

### Command Palette

- `Ctrl+K` / `Cmd+K` opens the global navigation palette.
- Query filtering covers canonical route label + href.
- Results retain native link semantics for keyboard/accessibility correctness.
- Selecting a command performs normal Next.js navigation.
- Browser Back returns to the previous shell context.
- Closing the palette resets the query.

### Notification and user shells

- Notification popover provides fixture-only operational-awareness examples and deep links.
- User menu provides fixture-only profile/settings entry points.
- These are shell contracts only; canonical notification policy/data arrives in WP-F13 and real identity/session data arrives in WP-F05.

### Theme boot and parity

- Light remains the default theme.
- Stored `nocscheduler.theme` preference is read by a pre-hydration boot script.
- `data-theme` and `color-scheme` are applied before the application shell hydrates.
- Theme persistence survives reload.
- F01 semantic tokens remain the single Light/Dark styling contract.

### Page states

F02 provides shared shell-compatible states for:

- loading,
- not found,
- error/retry,
- permission-denied-ready presentation patterns.

Full domain-specific state copy/actions remain owned by the feature phases.

## Development/runtime isolation repair

During local F01 review, running Next dev and Playwright against the same `.next` output caused port/manifest/dev-lock collisions. F02 hardened the local workflow instead of requiring developers to stop the dev server before every quality run.

Current local output separation:

```text
pnpm dev     → .next-dev      → normal development on port 3000
pnpm build   → .next-build    → production build output
pnpm e2e     → .next-e2e      → isolated production E2E server on port 3100
```

The wrapper `scripts/run-next.mjs` sets the runtime-specific Next `distDir` through `NOCSCHEDULER_NEXT_DIST_DIR`.

Playwright now builds and starts an isolated production-mode server instead of using `next dev`. This removes false interference from the Next.js Dev Tools overlay and keeps E2E independent from a developer's running server on port 3000.

## Tests implemented

### Vitest

F02 adds three navigation contract tests covering:

1. capability-aware navigation filtering while preserving broad read visibility,
2. canonical mobile primary navigation order,
3. nested-route active state and route metadata.

The final technical gate runs **11 passing Vitest tests across 4 test files**, including all F00/F01 regression coverage.

### Playwright F02 acceptance

F02 adds browser acceptance for:

- desktop sidebar expanded/collapsed behavior,
- desktop command palette via `Ctrl+K`,
- command navigation to Payroll,
- browser Back context preservation,
- mobile sidebar absence,
- canonical mobile bottom navigation,
- mobile `More` Bottom Sheet,
- 390×844 no-body-overflow contract,
- stored Dark theme applied before shell hydration and preserved after reload,
- `/login` remaining outside the authenticated application shell.

Together with the retained F01 design-system and liveness coverage, the final browser gate runs **9 passing Playwright tests**.

## CI / defect history during F02

F02 continued treating CI and browser acceptance as implementation feedback rather than suppressing failures:

1. the first route/navigation batch exposed only canonical Prettier differences,
2. a one-time formatter workflow produced repository-canonical formatting and was immediately returned to read-only mode,
3. TypeScript caught invalid F01 component API usage and non-canonical icon sizes in the new shell,
4. the root-route unit test was updated when `/` became a redirect contract,
5. production build caught an incorrect CSS import split; F01 `responsive.css` was restored as the shared responsive layer and F02 `shell.css` was added alongside it,
6. local Next runtime isolation was introduced after the user's Windows dev/E2E collision exposed shared-manifest risk,
7. the first F02 browser acceptance discovered the Next dev-tools portal intercepting the collapsed-sidebar control; E2E was moved to isolated production mode instead of forcing the test,
8. the next browser run exposed that Command Palette navigation anchors had been overridden with `role="listitem"`; the markup was corrected so results preserve native link semantics,
9. final read-only run `31619677210` passed the complete F02 quality and browser acceptance gate.

## Intentional boundaries

WP-F02 did **not** implement:

- high-fidelity business content for Dashboard/Schedule/Employees/Payroll/Reports,
- real employee/schedule/payroll data,
- database or Drizzle schema,
- Better Auth or real session restoration,
- server-authoritative authorization,
- real notification storage/read state,
- canonical command actions beyond navigation,
- schedule/payroll business logic,
- backend APIs.

High-fidelity frontend product surfaces were subsequently implemented in WP-F03. Backend persistence, authentication, authoritative authorization, and domain execution remain assigned to later workplan phases.

## Exit-gate checklist

- [x] desktop sidebar expanded/collapsed,
- [x] centralized permission-aware navigation model,
- [x] canonical mobile bottom navigation,
- [x] compact responsive page/global header,
- [x] global command/search shell,
- [x] notification popover shell,
- [x] theme control and pre-hydration theme boot,
- [x] canonical route skeleton,
- [x] desktop content/container strategy,
- [x] tablet navigation adaptation,
- [x] mobile safe-area handling,
- [x] sticky/navigation layer hierarchy,
- [x] loading/error/not-found shell states,
- [x] root and login entry-route boundaries,
- [x] browser Back navigation baseline,
- [x] no accidental page-level mobile overflow,
- [x] Light/Dark parity preserved through semantic tokens,
- [x] keyboard-accessible command entry and dialog behavior,
- [x] isolated local dev/build/E2E outputs,
- [x] read-only frozen-install CI,
- [x] final F02 technical verification recorded.

## Handoff

WP-F02 was explicitly accepted when the user instructed the implementation to continue to the next phase. WP-F03 then began from this accepted shell baseline.
