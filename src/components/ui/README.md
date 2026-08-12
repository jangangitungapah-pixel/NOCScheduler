# NOCScheduler UI Components

`src/components/ui/` is the shared visual grammar introduced by **WP-F01**. Feature pages should compose these primitives instead of creating local look-alikes.

## Non-negotiable rules

1. Use semantic tokens from `src/styles/tokens.css`; feature components must not invent raw palette values.
2. Light and Dark Mode use the same component tree. Theme differences belong in semantic tokens, not duplicated JSX.
3. Keep labels, statuses, and shift identity understandable without color alone.
4. Use the shared spacing, radius, elevation, layer, and motion tokens. Do not create arbitrary `z-index` ladders.
5. Preserve visible keyboard focus and semantic HTML. Icon-only actions require an accessible label.
6. Blocking validation belongs near the source; Toast is for transient confirmation, not the only error channel.
7. Desktop and mobile may recompose later, but shared component semantics remain stable.
8. `OFF` and `UNASSIGNED` are distinct business/visual states.
9. Motion must remain useful with `prefers-reduced-motion: reduce`.
10. Add or extend tests when a shared component gains behavior.

## Available primitives

### Theme and visual foundation

- `ThemeProvider`, `ThemeToggle`
- `Surface`
- `Icon`

### Actions and forms

- `Button`
- `Input`, `SearchInput`, `Textarea`, `Select`, `Combobox`
- `Checkbox`, `Radio`, `Switch`, `SegmentedControl`

### Status and domain identity

- `Badge`, `ShiftBadge`
- `CalendarDay`, `ScheduleCell`

### Contextual layers

- `Tooltip`, `Popover`, `DropdownMenu`, `ContextMenu`
- `Dialog`, `Drawer`, `Inspector`, `BottomSheet`

### Feedback and states

- `Toast`, `Banner`, `InlineValidation`
- `Skeleton`, `EmptyState`, `ErrorState`

### Dense operational data

- `DataTable`, `HeadCell`, `DataCell`, `DataRow`, `TableEmpty`
- `AuditTimeline`

## Import pattern

Prefer the public barrel for normal feature composition:

```tsx
import { Button, Input, ShiftBadge } from "@/components/ui";
```

Direct-file imports are acceptable only when a lower-level module boundary specifically benefits from them.

## Component state expectations

Shared interactive components should account for the states relevant to their behavior, including hover, focus-visible, pressed, disabled, loading, selected, invalid/error, and keyboard interaction. Not every component renders every state; the state must be explicit when it exists.

## Theme contract

`ThemeProvider` owns the persisted `light | dark` preference. Light is the product default. Components consume semantic CSS variables and must not read theme names to choose raw colors.

Theme-specific layout or duplicated theme component trees are prohibited.

## Accessibility contract

- Persistent form labels are the default.
- Helper/error text is connected with `aria-describedby`.
- Invalid fields expose `aria-invalid`.
- Combobox supports Arrow Up/Down, Enter, and Escape.
- Segmented Control uses roving keyboard focus.
- Dialog-family components use native dialog semantics and remain Escape-dismissible.
- Tooltip content supplements, never replaces, accessible naming.
- Touch-oriented controls retain appropriate target geometry through shared tokens.

## Responsive contract

The component layer is responsive without depending on device names. The `/design-system` acceptance page includes a compact-mobile no-body-overflow test. Full application composition belongs to WP-F02/WP-F03 and PRD-12.

## Reference surface

Run the app and open:

```text
http://localhost:3000/design-system
```

Use the reference to inspect Light/Dark parity, component states, dense tables, schedule semantics, overlay behavior, and compact-mobile composition before approving a shared visual change.

## Change policy

A visual fix should improve the shared primitive/token whenever the problem is systemic. Avoid screenshot-only page patches that cause similar components to drift apart later.
