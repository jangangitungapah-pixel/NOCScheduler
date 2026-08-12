# WP-F01 — Frontend Foundation & Design System — Implementation Notes

> Status: **COMPLETE — awaiting user acceptance**  
> Workplan: `WP-F01`  
> PRD anchors: PRD-10, PRD-11, PRD-12, PRD-13, PRD-19  
> Reference route: `/design-system`  
> Final technical verification run: `31612550695`

## Goal

Establish the reusable visual grammar before building the application shell or full business pages. WP-F01 follows the PRD direction of clean precision, spatial depth, controlled density, refined motion, and operational clarity while keeping Light and Dark Mode on one component tree.

## Scope implemented

### Token architecture

- Raw foundation palette isolated to the token layer.
- Semantic Light and Dark surface, text, border, action, status, and shift tokens.
- Typography hierarchy and tabular-numeric support.
- 4px spatial scale.
- Shared radius, control-height, icon-size, border, elevation, backdrop, and z-layer tokens.
- Motion duration/easing tokens and `prefers-reduced-motion` override.
- Responsive typography adjustments.

### Theme foundation

- Light Mode is the default product theme.
- Dark Mode uses semantic overrides without duplicated components.
- Theme preference persists in local storage.
- Theme state is modeled as an external browser preference store instead of cascading React effects.
- Theme switcher changes visual skin without route/reload/context mutation.

A full pre-hydration no-flash shell strategy remains assigned to WP-F02 when the application shell exists.

### Shared component family

- `Surface`
- one outline SVG `Icon` family
- `Button` with primary, secondary, ghost, tonal, destructive, size, icon-only, disabled, and stable loading states
- `Input`, `SearchInput`, `Textarea`, `Select`, searchable `Combobox`
- `Checkbox`, `Radio`, `Switch`, `SegmentedControl`
- `Badge`, `ShiftBadge`
- `Tooltip`, `Popover`, `DropdownMenu`, `ContextMenu`
- `Dialog`, `Drawer`, `Inspector`, `BottomSheet`
- `Toast`, `Banner`, `InlineValidation`
- `Skeleton`, `EmptyState`, `ErrorState`
- `DataTable`, table cells/rows/empty state
- `CalendarDay`, `ScheduleCell`
- `AuditTimeline`

### Domain-aware visual rules

- `S1`, `S2`, `S3`, `OFF`, `LEAVE`, and exception states have semantic label + color identity.
- Shift identity is not color-only.
- `OFF` is visually and textually distinct from `UNASSIGNED`.
- `Today` and `Selected` use separate calendar semantics.
- Draft schedule cells can use a distinct border treatment without changing the shift identity.
- Payroll/money examples use tabular numeric alignment.
- Audit history renders human-readable actor/time/change/reason content rather than raw JSON.

### Accessibility and interaction

- Persistent form labels are the default.
- Helper/error text is associated with fields.
- Invalid states expose `aria-invalid`.
- Icon-only action examples use accessible labels.
- Combobox supports Arrow Up/Down, Enter, and Escape.
- Segmented Control uses roving keyboard focus.
- Dialog-family primitives use native dialog semantics and remain Escape-dismissible.
- Focus-visible styling is global and token-driven.
- Reduced-motion preference collapses design-system motion duration.
- Mobile touch geometry is tokenized.

### Reference surface

`/design-system` provides a high-fidelity acceptance surface for:

- semantic tokens and depth,
- typography/numeric examples,
- button states,
- status and shift badges,
- full form family,
- selection controls,
- tooltip/popover/menu patterns,
- dialog/drawer/inspector/bottom sheet,
- feedback/loading/empty/error states,
- dense payroll table,
- calendar and schedule-cell semantics,
- audit timeline,
- Light/Dark Mode parity,
- compact-mobile composition.

## Tests implemented

### Vitest / Testing Library

- loading Button remains disabled/`aria-busy` while preserving content geometry,
- Theme Toggle changes and persists theme,
- Combobox keyboard selection,
- Segmented Control keyboard navigation/focus,
- `OFF` vs `UNASSIGNED` semantic distinction.

The final technical gate ran three test files with **8 passing Vitest tests** including the existing F00 baseline tests.

### Playwright F01 acceptance

- `/design-system` loads and switches Light → Dark,
- Dark preference survives page reload,
- keyboard segmented-control navigation works,
- 390×844 viewport has no page-level horizontal overflow,
- reduced-motion preference resolves design-system duration to 1ms,
- Dialog remains keyboard Escape-dismissible,
- existing application baseline/liveness smoke remains covered.

The final technical gate ran **5 passing Playwright tests**.

## CI history during F01

F01 used CI as an implementation verifier rather than suppressing failures:

1. initial design-system commit exposed canonical Prettier differences,
2. one temporary bootstrap workflow formatted the new files canonically,
3. React 19 lint rejected synchronous `setState` inside effects,
4. Theme state was redesigned around `useSyncExternalStore`,
5. Combobox query/highlight state was redesigned to derive safe values without synchronization effects,
6. TypeScript then exposed a server-snapshot inference issue, which was fixed with an explicitly typed function,
7. bootstrap run `31610703130` passed formatting, lint, route type generation, TypeScript, Vitest, production build, Chromium setup, and baseline Playwright smoke,
8. the first full browser acceptance gate caught genuine horizontal document overflow at 390×844,
9. diagnostic browser output traced the overflow to the shared Toast width contract rather than the intentionally scrollable schedule/table regions,
10. the shared feedback/container primitives were made parent-aware instead of hiding the defect with page-level `overflow-x: hidden`,
11. final read-only run `31612550695` passed frozen install, Prettier, ESLint, Next route type generation, TypeScript, all 8 Vitest tests, production build, Chromium installation, and all 5 Playwright acceptance tests.

Temporary CI write access used only for canonical formatting was removed. The final F01 workflow is read-only and executes the complete Playwright suite.

## Intentional boundaries

WP-F01 does **not** implement:

- desktop sidebar or mobile bottom navigation,
- application shell layout,
- command palette or notification shell,
- permission-aware navigation,
- full Dashboard/My Schedule/Team Schedule/Manage Schedule pages,
- authentication,
- database/domain/backend implementation,
- production deployment.

Those remain assigned to WP-F02 and later phases. **WP-F02 has not started.**

## Exit-gate checklist

- [x] semantic token hierarchy established,
- [x] Light Mode default established,
- [x] Dark Mode semantic parity established,
- [x] typography/numeric roles established,
- [x] spacing/radius/elevation/z-layer grammar established,
- [x] motion and reduced-motion behavior established,
- [x] one outline icon family established,
- [x] required shared component families implemented,
- [x] schedule/calendar domain primitives implemented,
- [x] audit timeline primitive implemented,
- [x] shared component behavior tests implemented,
- [x] `/design-system` reference route implemented,
- [x] compact-mobile page-overflow test implemented and verified,
- [x] theme persistence test implemented and verified,
- [x] keyboard interaction tests implemented and verified,
- [x] generated build/type pipeline green,
- [x] component usage rules documented,
- [x] final read-only F01 technical CI verification recorded.

## Handoff

WP-F01 implementation is complete and intentionally stops before WP-F02 so the user can inspect `/design-system` on desktop/mobile and Light/Dark Mode. WP-F02 must not begin until explicit user approval.
