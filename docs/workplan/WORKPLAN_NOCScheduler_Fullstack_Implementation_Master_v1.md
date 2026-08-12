# WORKPLAN — NOCScheduler Full-Stack Implementation Master Plan v1

> **Product:** NOCScheduler  
> **Document Type:** Master Engineering Workplan  
> **Status:** Approved Planning Baseline — Implementation Source of Truth  
> **Scope:** Project Setup → Frontend → Backend → Full-Stack Integration → QA → Production  
> **Repository:** `jangangitungapah-pixel/NOCScheduler`  
> **Default Locale:** Indonesia  
> **Default Timezone:** Asia/Jakarta  
> **Default Currency:** IDR  
> **Default Theme:** Light  
> **Theme Support:** Light + Dark parity required  
> **Platforms:** Desktop Web + Mobile Web with equal product priority  
> **Canonical Product References:** PRD-01 through PRD-20

---

# 1. Purpose

Dokumen ini menerjemahkan seluruh **PRD-01 sampai PRD-20** menjadi urutan implementasi engineering yang konkret, dependency-aware, testable, dan dapat dikerjakan per phase tanpa kehilangan arah produk.

Workplan ini menjadi source of truth untuk menjawab:

> **“Dalam urutan apa NOCScheduler dibangun dari repository kosong sampai full-stack production, apa output setiap phase, PRD mana yang mengikat phase tersebut, dan kapan sebuah phase boleh dianggap selesai?”**

Workplan tidak menggantikan PRD.

Jika workplan dan PRD terlihat bertentangan:

1. **PRD tetap canonical source of truth untuk requirement**, dan
2. workplan harus disesuaikan, bukan PRD diabaikan secara diam-diam.

---

# 2. Non-Negotiable Implementation Principles

Seluruh phase wajib mematuhi prinsip berikut.

## WP-P01 — PRD-Driven Implementation

Tidak ada fitur, business rule, atau UI behavior critical yang diimplementasikan berdasarkan asumsi lokal jika sudah didefinisikan dalam PRD.

Setiap task harus dapat ditelusuri ke satu atau lebih PRD.

---

## WP-P02 — Frontend First, Not Frontend Throwaway

Implementasi dimulai dari project foundation, design system, application shell, dan high-fidelity frontend surfaces.

Frontend awal boleh memakai **typed fixtures/mock adapters**, tetapi:

- component contract harus reusable,
- data shape harus mendekati canonical API/domain model,
- mock tidak boleh menanam business rule palsu,
- integration backend tidak boleh membutuhkan rewrite total UI.

---

## WP-P03 — Desktop and Mobile Equal Priority

Setiap phase UI P0/P1 harus selesai pada desktop **dan** mobile.

Tidak ada acceptance:

> desktop done, mobile nanti.

Responsive behavior mengikuti PRD-10, PRD-11, PRD-12, dan PRD-13.

---

## WP-P04 — Light First, Dark Equal Quality

Default adalah Light Mode.

Setiap shared component dan critical page harus mendukung Dark Mode menggunakan semantic token yang sama.

Tidak boleh ada duplicate Light/Dark component tree.

---

## WP-P05 — Domain Logic Is Server-Side

React component tidak boleh menjadi satu-satunya tempat aturan scheduling, payroll, authorization, exception, atau historical integrity hidup.

Canonical flow:

```text
UI
→ HTTP / Server Entry
→ Validation
→ Authentication
→ Authorization
→ Command / Query
→ Domain Service
→ Repository / PostgreSQL
→ Audit / Notification Policy
```

---

## WP-P06 — Historical Integrity Before Convenience

Schedule versioning, effective dating, payroll snapshot, audit evidence, dan locked historical state harus benar sejak fondasi domain dibuat.

Jangan membuat MVP dengan destructive overwrite lalu “nanti dibenerin”.

---

## WP-P07 — Read Broadly, Mutate Narrowly

Internal transparency tetap dipertahankan.

Mutation tetap permission-controlled dan server-authoritative.

---

## WP-P08 — One Source of Truth

Dashboard, report, notification, dan summary adalah projection.

Mereka tidak boleh memiliki business truth alternatif yang berbeda dari canonical schedule/payroll/employee/exception record.

---

## WP-P09 — Functional Is Not Finished

Sebuah feature belum selesai bila:

- desktop atau mobile rusak,
- Light/Dark tidak parity,
- alignment buruk,
- loading/error/empty state belum dirancang,
- accessibility critical gagal,
- regression critical belum ada,
- authorization hanya dijaga UI.

---

## WP-P10 — Commit-Sized Progress

Task di dalam phase harus diimplementasikan sebagai unit perubahan yang relatif kecil dan reviewable.

Hindari satu commit raksasa berisi beberapa domain sekaligus.

---

# 3. Global Definition of Phase Done

Sebuah phase hanya dapat ditandai **DONE** jika seluruh kondisi relevan berikut terpenuhi:

- scope phase selesai sesuai PRD,
- tidak ada requirement P0 phase yang sengaja ditunda tanpa catatan,
- lint lulus,
- TypeScript typecheck lulus,
- production build lulus,
- unit/domain test relevan lulus,
- integration/API test relevan lulus,
- critical E2E phase lulus,
- desktop acceptance lulus bila phase UI,
- mobile acceptance lulus bila phase UI,
- Light/Dark parity lulus bila phase UI,
- keyboard/accessibility smoke lulus bila phase UI,
- high-risk mutation memiliki authorization + audit bila relevan,
- migration telah direview bila schema berubah,
- tidak ada unresolved P0/P1 defect yang berasal dari phase,
- dokumentasi/handoff phase diperbarui,
- commit history tetap dapat ditelusuri.

---

# 4. Master Phase Map

| Phase | Name | Primary Outcome |
|---|---|---|
| WP-F00 | Project Setup & Engineering Baseline | Repo menjadi runnable, typed, testable, CI-ready |
| WP-F01 | Frontend Foundation & Design System | Semantic tokens + shared high-fidelity component system |
| WP-F02 | Application Shell, Navigation & Responsive Frame | Desktop/mobile shell final dengan Light/Dark |
| WP-F03 | High-Fidelity Frontend Product Surfaces | Seluruh page utama tersedia dengan typed fixtures |
| WP-F04 | Database & Domain Foundation | PostgreSQL schema, migrations, repositories, date/money core |
| WP-F05 | Authentication, Authorization, Employee & Settings | User/access/config foundation siap dipakai |
| WP-F06 | Scheduling Engine & Schedule API | Canonical schedule domain siap dan tervalidasi |
| WP-F07 | Scheduling Full-Stack Experience | Schedule UI terhubung backend secara penuh |
| WP-F08 | Requests, Exceptions, Leave, Swap, Replacement & Overtime | Operational exception flow end-to-end |
| WP-F09 | Payroll & Compensation Engine | Deterministic payroll backend + historical protection |
| WP-F10 | Payroll Full-Stack Experience | Payroll review/detail/finalize/lock UX end-to-end |
| WP-F11 | Audit Trail & Historical Experience | Business history + audit investigation usable |
| WP-F12 | Reporting, Analytics & Export | Canonical reports, drill-down, CSV/XLSX |
| WP-F13 | Notifications & Operational Awareness | In-app awareness, grouping, deep-link, stale resolution |
| WP-F14 | Security & Data-Integrity Hardening | Security contract PRD-16 fully enforced |
| WP-F15 | Cross-Product Responsive, Accessibility & UX Completion | Whole-app desktop/mobile parity |
| WP-F16 | UI Polish & Visual Quality Gate | Screenshot-driven high-fidelity final polish |
| WP-F17 | QA, Regression, Performance & Release Candidate | PRD-19 Release Ready candidate |
| WP-F18 | CI/CD, Staging, Backup & Observability | Production operations platform ready |
| WP-F19 | Production Go-Live & Post-Launch Verification | Full-stack production release accepted |

---

# 5. Dependency Chain

```text
WP-F00
  ↓
WP-F01
  ↓
WP-F02
  ↓
WP-F03
  ↓
WP-F04
  ↓
WP-F05
  ↓
WP-F06
  ↓
WP-F07
  ↓
WP-F08
  ↓
WP-F09
  ↓
WP-F10
  ↓
WP-F11
  ↓
WP-F12
  ↓
WP-F13
  ↓
WP-F14
  ↓
WP-F15
  ↓
WP-F16
  ↓
WP-F17
  ↓
WP-F18
  ↓
WP-F19
```

Beberapa task boleh berjalan paralel setelah dependency stabil, tetapi phase gate tidak boleh dilompati apabila phase berikutnya bergantung pada contract sebelumnya.

---

# 6. WP-F00 — Project Setup & Engineering Baseline

## Goal

Membuat repository menjadi aplikasi Next.js full-stack yang runnable, strict, repeatable, dan siap menerima implementasi tanpa technical debt setup.

## Primary PRD References

- PRD-14 Technical Architecture
- PRD-16 Security
- PRD-19 QA
- PRD-20 Operations

## Tasks

- **F00-01** Bootstrap Next.js App Router + TypeScript strict.
- **F00-02** Pin package manager menggunakan pnpm + committed lockfile.
- **F00-03** Tetapkan supported Node.js runtime.
- **F00-04** Setup ESLint dan deterministic formatting.
- **F00-05** Setup path aliases dan folder architecture modular monolith.
- **F00-06** Setup environment schema validation menggunakan Zod.
- **F00-07** Tambahkan `.env.example` tanpa secret nyata.
- **F00-08** Setup Vitest + Testing Library baseline.
- **F00-09** Setup Playwright baseline.
- **F00-10** Setup Tailwind CSS sebagai styling engine.
- **F00-11** Buat initial semantic CSS variable infrastructure.
- **F00-12** Setup healthless development smoke page/app root.
- **F00-13** Setup npm/pnpm scripts: format, lint, typecheck, test, build, e2e.
- **F00-14** Setup initial GitHub Actions quality workflow.
- **F00-15** Tambahkan repository engineering conventions / contribution notes.

## Recommended Initial Structure

```text
src/
  app/
  components/
    ui/
    layout/
  modules/
    auth/
    employees/
    schedule/
    exceptions/
    payroll/
    reports/
    notifications/
    audit/
    settings/
  lib/
    db/
    auth/
    validation/
    time/
    money/
    permissions/
    observability/
  styles/
  test/

drizzle/
tests/
  e2e/
  fixtures/
docs/
```

Exact structure boleh disempurnakan selama domain ownership tetap jelas.

## Exit Gate

- clean install berhasil,
- dev server berjalan,
- lint/typecheck/test/build hijau,
- Playwright smoke berjalan,
- CI baseline hijau,
- tidak ada secret committed,
- project siap masuk design-system implementation.

---

# 7. WP-F01 — Frontend Foundation & Design System

## Goal

Membangun visual grammar NOCScheduler sebelum page feature tumbuh liar.

## Primary PRD References

- PRD-10 UI/UX
- PRD-11 Design System
- PRD-12 Responsive & Mobile
- PRD-13 UI Polish
- PRD-19 QA

## Tasks

- **F01-01** Implement foundation palette dan semantic token hierarchy.
- **F01-02** Implement Light Mode default.
- **F01-03** Implement Dark Mode dengan semantic token parity.
- **F01-04** Implement typography roles dan numeric typography.
- **F01-05** Implement spacing, radius, border, elevation, z-layer token.
- **F01-06** Implement motion duration/easing token + reduced motion.
- **F01-07** Implement icon system/family.
- **F01-08** Implement Button variants dan states.
- **F01-09** Implement Input, Textarea, Search, Select, Combobox.
- **F01-10** Implement Checkbox, Radio, Switch, Segmented Control.
- **F01-11** Implement Badge/Status/Shift Badge family.
- **F01-12** Implement Tooltip, Popover, Dropdown, Context Menu.
- **F01-13** Implement Dialog, Drawer, Inspector, Bottom Sheet primitives.
- **F01-14** Implement Toast, Banner, Inline Validation.
- **F01-15** Implement Skeleton, Empty State, Error State primitives.
- **F01-16** Implement Table/DataGrid foundation.
- **F01-17** Implement date/calendar primitives dan shift cell foundation.
- **F01-18** Implement audit timeline primitive.
- **F01-19** Add component test + keyboard/focus test.
- **F01-20** Add visual reference/demo page untuk semua shared component.

## Exit Gate

Shared component tidak boleh memiliki ad-hoc raw color dan critical component harus punya:

- Light/Dark,
- desktop/mobile behavior,
- hover/focus/pressed/disabled/loading/error state,
- keyboard behavior,
- reduced-motion behavior.

---

# 8. WP-F02 — Application Shell, Navigation & Responsive Frame

## Goal

Membuat frame aplikasi final yang menjadi host seluruh halaman tanpa perlu overhaul struktur nanti.

## Primary PRD References

- PRD-06 Information Architecture
- PRD-07 Roles & Permissions
- PRD-10 UI/UX
- PRD-11 Design System
- PRD-12 Responsive
- PRD-13 Polish

## Tasks

- **F02-01** Desktop sidebar expanded/collapsed.
- **F02-02** Permission-aware navigation model.
- **F02-03** Mobile bottom navigation: Home, Schedule, Team, Payroll, More.
- **F02-04** Compact responsive page header.
- **F02-05** Global top actions: search/command, notification, theme, user menu.
- **F02-06** Route skeleton sesuai PRD-06.
- **F02-07** Desktop content/container strategy.
- **F02-08** Tablet adaptation.
- **F02-09** Mobile safe-area handling.
- **F02-10** Sticky layer collision rules.
- **F02-11** Global command palette shell.
- **F02-12** Notification popover shell.
- **F02-13** Theme persistence tanpa theme flash.
- **F02-14** Permission denied/not-found/loading page states.
- **F02-15** Back/forward and URL-state preservation baseline.

## Exit Gate

- no accidental page-level horizontal overflow,
- desktop sidebar dan mobile bottom nav polished,
- Light/Dark parity,
- route shell siap menerima page feature,
- keyboard focus order benar.

---

# 9. WP-F03 — High-Fidelity Frontend Product Surfaces

## Goal

Membuat seluruh product surface utama secara high fidelity menggunakan **typed fixtures**, sehingga user flow dan visual architecture dapat divalidasi sebelum backend domain penuh masuk.

## Primary PRD References

- PRD-01, PRD-02
- PRD-06
- PRD-10 through PRD-13
- PRD-17, PRD-18

## Typed Fixture Rule

Fixtures harus menggunakan interface/data contract yang diarahkan ke PRD-08/PRD-15.

UI fixture tidak boleh menjadi sumber business logic final.

## Page Workstreams

### F03-A — Dashboard

- personal shift today,
- next shift,
- now on duty,
- recent schedule changes,
- monthly summary,
- scheduler/payroll attention states.

### F03-B — My Schedule

- month/week/agenda behavior,
- mobile compact date strip,
- shift details,
- history indicator,
- jump to today.

### F03-C — Team Schedule

- desktop dense schedule view,
- mobile By Day / By Employee recomposition,
- planned/effective visual distinction.

### F03-D — Manage Schedule

- period header,
- draft/published state,
- dense matrix,
- selected-cell inspector,
- bulk-selection mode,
- validation panel,
- publish review UI.

### F03-E — Requests

- request list,
- create flow,
- request detail,
- approval/rejection state,
- swap/replacement/overtime surfaces.

### F03-F — Employees

- list,
- employee overview,
- schedule tab,
- payroll tab,
- history tab.

### F03-G — Payroll

- payroll overview,
- monthly payroll,
- employee payroll detail,
- breakdown drill-down,
- dirty/finalized/locked states.

### F03-H — Reports

- report shell,
- filter bar,
- summary strip,
- table/chart composition,
- mobile drill-down.

### F03-I — Activity History

- timeline/list,
- filters,
- before/after detail.

### F03-J — Settings

- General,
- Shifts,
- Payroll,
- Compensation,
- Holidays,
- Access,
- Notifications.

### F03-K — Notifications

- popover,
- full center,
- unread/read,
- grouped/resolved/stale visual states.

## Exit Gate

- seluruh canonical P0/P1 route memiliki high-fidelity surface,
- desktop/mobile flow dapat dinavigasi end-to-end dengan fixtures,
- Light/Dark parity,
- no giant placeholder page,
- no inconsistent local component styling,
- user flow review selesai sebelum backend integration besar.

---

# 10. WP-F04 — Database & Domain Foundation

## Goal

Membangun PostgreSQL data foundation yang menjaga historical correctness sejak awal.

## Primary PRD References

- PRD-03 through PRD-09
- PRD-14
- PRD-15
- PRD-16
- PRD-19

## Tasks

- **F04-01** Configure PostgreSQL local/test environment.
- **F04-02** Configure Drizzle schema + Drizzle Kit migration flow.
- **F04-03** Implement identity/employee tables.
- **F04-04** Implement role/permission/user-role tables.
- **F04-05** Implement shift type + effective version model.
- **F04-06** Implement schedule period/version/assignment model.
- **F04-07** Implement request/exception/swap/replacement/overtime model.
- **F04-08** Implement compensation/salary/incentive effective version model.
- **F04-09** Implement payroll period/record/revision/item/source/adjustment model.
- **F04-10** Implement settings/holiday/notification model.
- **F04-11** Implement append-oriented audit model.
- **F04-12** Implement row version/concurrency fields.
- **F04-13** Add DB indexes dan unique constraints.
- **F04-14** Add historical delete/cascade guards.
- **F04-15** Implement central `Asia/Jakarta` business-date module.
- **F04-16** Implement integer-IDR money module.
- **F04-17** Create deterministic seeds/fixtures.
- **F04-18** Database contract tests.

## Exit Gate

- migration clean install dari zero database berhasil,
- historical model tidak destructive,
- duplicate critical state ditolak,
- effective-version constraints diuji,
- test database dapat di-reset deterministically.

---

# 11. WP-F05 — Authentication, Authorization, Employee & Settings Foundation

## Goal

Membuat identity, access, employee profile, dan configurable operational settings siap production pattern.

## Primary PRD References

- PRD-02
- PRD-07
- PRD-08
- PRD-09
- PRD-14 through PRD-16

## Tasks

- **F05-01** Integrate Better Auth.
- **F05-02** Secure cookie session + origin/CSRF baseline.
- **F05-03** Login/logout/session expiry UX.
- **F05-04** Account disable/session revoke.
- **F05-05** Implement centralized capability service.
- **F05-06** Seed baseline roles: NOC Member, Scheduler/Supervisor, Administrator.
- **F05-07** Implement permission scopes.
- **F05-08** Implement route/API authorization guards.
- **F05-09** Last Administrator protection.
- **F05-10** Employee CRUD/archive/inactive workflow.
- **F05-11** Shift configuration with effective dating.
- **F05-12** Salary and incentive configuration with effective dating.
- **F05-13** Holiday/settings configuration.
- **F05-14** Audit access/config mutation.
- **F05-15** Replace fixture data on Employee/Settings/Access pages dengan real API.
- **F05-16** Adversarial authorization tests.

## Exit Gate

- no UI-only permission boundary,
- self privilege escalation impossible,
- all configuration mutation audited,
- employee history retained after account disable,
- Settings UI remains consistent with design system.

---

# 12. WP-F06 — Scheduling Engine & Schedule API

## Goal

Membangun canonical scheduling business engine sebelum editor UI memakai data real.

## Primary PRD References

- PRD-03
- PRD-05
- PRD-08
- PRD-09
- PRD-15
- PRD-16
- PRD-19

## Tasks

- **F06-01** Work-date resolution.
- **F06-02** Cross-midnight interval construction.
- **F06-03** One employee/one primary work-state invariant.
- **F06-04** OFF vs Unassigned semantics.
- **F06-05** Draft schedule lifecycle.
- **F06-06** Assignment create/update/delete draft command.
- **F06-07** Bulk assignment command.
- **F06-08** Copy previous period/template foundation.
- **F06-09** Overlap/conflict detection.
- **F06-10** Rest/consecutive/night validation.
- **F06-11** Coverage calculation.
- **F06-12** Error/Warning/Info validation model.
- **F06-13** Schedule validation preview endpoint.
- **F06-14** Atomic publish command.
- **F06-15** Published correction command + mandatory reason/audit.
- **F06-16** Version/concurrency guard.
- **F06-17** Idempotency for publish/correction command.
- **F06-18** Team/My schedule read projections.
- **F06-19** Now-on-duty projection.
- **F06-20** Scheduling regression suite.

## Exit Gate

All `SCH-*` critical rules from PRD-03 relevant to baseline must be proven by deterministic tests.

---

# 13. WP-F07 — Scheduling Full-Stack Experience

## Goal

Mengganti fixture schedule dengan canonical API/domain dan membuat scheduling menjadi workflow production-grade.

## Primary PRD References

- PRD-03
- PRD-06
- PRD-10 through PRD-13
- PRD-15
- PRD-19

## Tasks

- **F07-01** Connect Dashboard schedule widgets.
- **F07-02** Connect My Schedule.
- **F07-03** Connect Team Schedule.
- **F07-04** Connect Manage Schedule draft workspace.
- **F07-05** Optimistic cell editing dengan rollback aman.
- **F07-06** Bulk selection + bulk command.
- **F07-07** Validation summary + jump-to-location.
- **F07-08** Coverage context.
- **F07-09** Publish review + explicit confirmation.
- **F07-10** Concurrency conflict UX.
- **F07-11** Published correction UX before/after.
- **F07-12** Preserve period/filter/selection/scroll context.
- **F07-13** Mobile focused schedule editing.
- **F07-14** Mobile natural horizontal date scrolling.
- **F07-15** Sticky date/header collision verification.
- **F07-16** Schedule E2E + visual regression.

## Exit Gate

Schedule can be created, validated, published, viewed, corrected, and audited from desktop/mobile without spreadsheet dependency.

---

# 14. WP-F08 — Requests, Exceptions, Leave, Swap, Replacement & Overtime

## Goal

Membuat operational reality layer tanpa menimpa planned schedule secara destruktif.

## Primary PRD References

- PRD-05
- PRD-07 through PRD-09
- PRD-10
- PRD-15
- PRD-18
- PRD-19

## Tasks

- **F08-01** Request lifecycle state machine.
- **F08-02** Leave/sick/permission/training/business duty.
- **F08-03** Request create self flow.
- **F08-04** Approve/reject/cancel/supersede.
- **F08-05** Self-approval guard.
- **F08-06** Replacement workflow.
- **F08-07** Shift swap atomic workflow.
- **F08-08** Overtime workflow.
- **F08-09** Effective operational projection.
- **F08-10** Planned vs Effective Team Schedule UI.
- **F08-11** Payroll-impact awareness flag.
- **F08-12** Retroactive correction guard.
- **F08-13** Request/exception audit history.
- **F08-14** Desktop/mobile request UX integration.
- **F08-15** Exception regression + E2E suite.

## Exit Gate

Operational exception tidak lagi membutuhkan rewrite planned schedule untuk menjelaskan realita.

---

# 15. WP-F09 — Payroll & Compensation Engine

## Goal

Membangun payroll engine deterministik, explainable, versioned, dan historical-safe.

## Primary PRD References

- PRD-04
- PRD-05
- PRD-07 through PRD-09
- PRD-15
- PRD-16
- PRD-19

## Tasks

- **F09-01** Payroll period lifecycle.
- **F09-02** Salary effective-version resolution.
- **F09-03** Shift incentive effective-version resolution.
- **F09-04** Published/effective source eligibility.
- **F09-05** Work-date payroll inclusion.
- **F09-06** Cross-midnight counted once.
- **F09-07** Generated payroll component engine.
- **F09-08** Manual adjustment model.
- **F09-09** Recalculation preserving manual adjustments.
- **F09-10** Missing config as blocking state, never silent Rp0.
- **F09-11** Payroll source traceability.
- **F09-12** Payroll revision/snapshot.
- **F09-13** Dirty/outdated detection.
- **F09-14** Calculate/recalculate command + idempotency.
- **F09-15** Finalize command.
- **F09-16** Lock command.
- **F09-17** Exceptional unlock + reason/audit.
- **F09-18** Locked historical stability.
- **F09-19** Payroll reconciliation tests.
- **F09-20** Deterministic financial regression suite.

## Exit Gate

All critical `PAY-*` rules must pass deterministic regression and locked historical payroll may not drift after config/source changes.

---

# 16. WP-F10 — Payroll Full-Stack Experience

## Goal

Menghubungkan payroll engine dengan high-trust review UX di desktop dan mobile.

## Primary PRD References

- PRD-04
- PRD-10 through PRD-13
- PRD-15
- PRD-17
- PRD-19

## Tasks

- **F10-01** Payroll Overview integration.
- **F10-02** Monthly Payroll table/list integration.
- **F10-03** Employee payroll detail integration.
- **F10-04** THP → component → quantity/rate → source drill-down.
- **F10-05** Dirty/outdated state.
- **F10-06** Adjustment UX.
- **F10-07** Calculate/recalculate UX.
- **F10-08** Finalize UX.
- **F10-09** Lock UX.
- **F10-10** Unlock exceptional UX.
- **F10-11** Locked/read-only state.
- **F10-12** Mobile payroll summary + drill-down.
- **F10-13** Money/numeric alignment visual QA.
- **F10-14** Payroll E2E + visual regression.

## Exit Gate

User can explain every important payroll number from UI and no lifecycle state is visually ambiguous.

---

# 17. WP-F11 — Audit Trail & Historical Experience

## Goal

Membuat perubahan penting dapat dipahami manusia dan dapat diinvestigasi secara teknis.

## Primary PRD References

- PRD-09
- PRD-06
- PRD-10 through PRD-13
- PRD-15
- PRD-16

## Tasks

- **F11-01** Canonical audit event writer.
- **F11-02** Actor/resource/subject/correlation metadata.
- **F11-03** Before/after allow-listed snapshot.
- **F11-04** Reason capture rules.
- **F11-05** Schedule business-history projection.
- **F11-06** Request history projection.
- **F11-07** Compensation history projection.
- **F11-08** Payroll revision/lifecycle history.
- **F11-09** Access/permission history.
- **F11-10** Activity History page integration.
- **F11-11** Contextual history from Employee/Schedule/Payroll/Request.
- **F11-12** Audit filtering and deep-link.
- **F11-13** Sensitive-field redaction tests.
- **F11-14** Correlated-operation tests.

## Exit Gate

High-risk mutation tanpa durable audit evidence harus impossible by normal application flow.

---

# 18. WP-F12 — Reporting, Analytics & Export

## Goal

Membuat operational intelligence yang selalu reconcile dengan source of truth.

## Primary PRD References

- PRD-17
- PRD-04/05
- PRD-10 through PRD-13
- PRD-15/16
- PRD-19

## Tasks

- **F12-01** Metric dictionary implementation.
- **F12-02** Shift Distribution report.
- **F12-03** Fairness/distribution insight.
- **F12-04** Team Coverage report.
- **F12-05** Coverage Risk report.
- **F12-06** Employee Monthly Summary.
- **F12-07** Monthly Payroll report.
- **F12-08** Payroll Component report.
- **F12-09** Payroll Period Comparison.
- **F12-10** Exception/Leave report.
- **F12-11** Overtime report when enabled.
- **F12-12** Replacement/Swap report.
- **F12-13** Schedule Change report.
- **F12-14** Employee Shift History.
- **F12-15** Team Monthly Operational Summary.
- **F12-16** Shared filter/sort/period contract.
- **F12-17** Drill-down to canonical source.
- **F12-18** CSV export.
- **F12-19** XLSX export + formula injection protection.
- **F12-20** Print-friendly report behavior.
- **F12-21** Mobile reporting recomposition.
- **F12-22** Reconciliation tests.

## Exit Gate

No report may calculate alternate THP or silently mix Planned/Effective data.

---

# 19. WP-F13 — Notifications & Operational Awareness

## Goal

Membuat aplikasi aware tanpa menjadi noisy.

## Primary PRD References

- PRD-18
- PRD-02
- PRD-09
- PRD-15
- PRD-16

## Tasks

- **F13-01** Notification policy service.
- **F13-02** Recipient resolution.
- **F13-03** Severity + urgency model.
- **F13-04** Read/unread lifecycle.
- **F13-05** Resolution/stale lifecycle.
- **F13-06** Deduplication.
- **F13-07** Grouping/batching.
- **F13-08** Schedule published/change notification.
- **F13-09** Request approval/rejection notification.
- **F13-10** Replacement/swap awareness.
- **F13-11** Coverage warning awareness.
- **F13-12** Payroll finalized/locked awareness.
- **F13-13** Payroll dirty/admin attention awareness.
- **F13-14** Notification deep-link contract.
- **F13-15** Bell popover integration.
- **F13-16** Notification Center integration.
- **F13-17** Preference baseline.
- **F13-18** Recipient/dedup/staleness tests.

## Exit Gate

Notification feed tidak menjadi mirror seluruh audit event dan critical notification selalu menuju source yang benar.

---

# 20. WP-F14 — Security & Data-Integrity Hardening

## Goal

Melakukan adversarial review lintas domain sebelum final UX/QA freeze.

## Primary PRD References

- PRD-07
- PRD-08/09
- PRD-15
- PRD-16
- PRD-19

## Tasks

- **F14-01** Session/cookie production security review.
- **F14-02** Trusted origin/CSRF review.
- **F14-03** CSP/security headers implementation.
- **F14-04** XSS injection review.
- **F14-05** SQL/query safety review.
- **F14-06** Mass-assignment review.
- **F14-07** Object-level authorization test sweep.
- **F14-08** Privilege escalation test sweep.
- **F14-09** Rate limiting auth/high-risk endpoints.
- **F14-10** Secret/log redaction review.
- **F14-11** Dependency/supply-chain review.
- **F14-12** Export content security review.
- **F14-13** High-risk transaction fail-closed verification.
- **F14-14** Audit bypass negative tests.
- **F14-15** Database least-privilege plan verification.

## Exit Gate

No known P0/P1 security defect and all protected mutation remains secure through crafted HTTP requests.

---

# 21. WP-F15 — Cross-Product Responsive, Accessibility & UX Completion

## Goal

Melakukan whole-app usability pass setelah semua major domain terintegrasi.

## Primary PRD References

- PRD-10
- PRD-11
- PRD-12
- PRD-13
- PRD-19

## Tasks

- **F15-01** 360px compact-mobile pass.
- **F15-02** 390/393px canonical-mobile pass.
- **F15-03** 430px large-phone pass.
- **F15-04** 768px tablet pass.
- **F15-05** 1024px compact-desktop pass.
- **F15-06** 1280/1440 desktop pass.
- **F15-07** 1920 wide-desktop composition pass.
- **F15-08** One-hand reachability review.
- **F15-09** Safe-area review.
- **F15-10** Virtual keyboard review.
- **F15-11** Orientation/state-preservation review.
- **F15-12** No accidental page-level horizontal scroll audit.
- **F15-13** Keyboard-only navigation pass.
- **F15-14** Focus-visible/focus-trap pass.
- **F15-15** 200% browser zoom pass.
- **F15-16** Reduced-motion pass.
- **F15-17** Automated axe-style accessibility pass.

## Exit Gate

Every P0/P1 workflow remains usable on canonical desktop/mobile target independently.

---

# 22. WP-F16 — UI Polish & Visual Quality Gate

## Goal

Membawa seluruh aplikasi ke bar high-fidelity final PRD-13.

## Primary PRD References

- PRD-10 through PRD-13
- PRD-19

## Polish Pass Order

```text
Shared Component Pass
→ Page Pass
→ Cross-Product Pass
```

## Tasks

- **F16-01** Typography baseline audit.
- **F16-02** Icon optical alignment audit.
- **F16-03** Repeated structure alignment audit.
- **F16-04** Button/input/select geometry audit.
- **F16-05** Table header/body alignment audit.
- **F16-06** Schedule grid/calendar geometry audit.
- **F16-07** Sticky layer collision audit.
- **F16-08** Surface/border/elevation audit.
- **F16-09** Light Mode screenshot pass.
- **F16-10** Dark Mode parity screenshot pass.
- **F16-11** Loading/empty/error/permission/locked state pass.
- **F16-12** Long-content/truncation pass.
- **F16-13** Motion/jank pass.
- **F16-14** Modal/drawer/sheet proportions pass.
- **F16-15** Dashboard density pass.
- **F16-16** Settings consistency pass.
- **F16-17** Payroll trustworthiness visual pass.
- **F16-18** Reporting visual pass.
- **F16-19** Screenshot baseline update only after intentional review.

## Exit Gate

No unresolved visual P0/P1. Misalignment repeated structure is treated as defect, not preference.

---

# 23. WP-F17 — QA, Regression, Performance & Release Candidate

## Goal

Membuktikan bahwa integrated application memenuhi PRD-19 Definition of Release Ready sebelum production infrastructure promotion.

## Primary PRD References

- PRD-19
- seluruh PRD business/domain terkait

## Tasks

- **F17-01** Full static gate: format/lint/typecheck/build.
- **F17-02** Full unit/domain suite.
- **F17-03** Full DB/integration suite.
- **F17-04** API contract suite.
- **F17-05** Authorization/security suite.
- **F17-06** Scheduling regression suite.
- **F17-07** Exception regression suite.
- **F17-08** Payroll regression/reconciliation suite.
- **F17-09** Notification/report reconciliation suite.
- **F17-10** Critical Playwright E2E.
- **F17-11** Chromium/Firefox/WebKit matrix.
- **F17-12** Mobile Chromium/WebKit matrix.
- **F17-13** Visual regression full critical surfaces.
- **F17-14** Accessibility full critical flow.
- **F17-15** Small/Normal/Stress fixture performance test.
- **F17-16** Migration from empty DB test.
- **F17-17** Migration from previous schema snapshot test.
- **F17-18** Exploratory QA.
- **F17-19** Internal UAT.
- **F17-20** Release blocker triage and closure.

## Mandatory Critical E2E

```text
Login
→ Dashboard
→ My Schedule
→ Create Draft Schedule
→ Validate
→ Publish
→ View Published Schedule Mobile
→ Submit Request
→ Approve / Replace / Swap
→ Calculate Payroll
→ Review Breakdown
→ Finalize
→ Lock
→ Verify Historical Stability
→ Verify Notification Deep Link
→ Verify Report Reconciliation
```

## Exit Gate

- 0 unresolved P0/P1,
- no known flaky critical test,
- Release Candidate explicitly accepted.

---

# 24. WP-F18 — CI/CD, Staging, Backup & Observability

## Goal

Membuat production environment operable, observable, recoverable, dan rollback-capable.

## Primary PRD References

- PRD-14
- PRD-16
- PRD-19
- PRD-20

## Tasks

- **F18-01** Finalize CI merge gate.
- **F18-02** Create Preview environment contract.
- **F18-03** Create isolated Staging environment.
- **F18-04** Provision managed PostgreSQL staging/prod.
- **F18-05** Configure runtime secrets per environment.
- **F18-06** Configure production domain/HTTPS.
- **F18-07** Configure immutable release identification.
- **F18-08** Implement `/api/health/live`.
- **F18-09** Implement `/api/health/ready`.
- **F18-10** Structured logging with request/correlation/release IDs.
- **F18-11** Metrics for request, DB, critical business command failure.
- **F18-12** Actionable alerting + severity policy.
- **F18-13** Migration deployment job.
- **F18-14** Application rollback procedure.
- **F18-15** Backup/PITR configuration.
- **F18-16** Backup health monitoring.
- **F18-17** Restore runbook.
- **F18-18** Execute successful isolated restore drill.
- **F18-19** Verify target `RPO <= 15 minutes`.
- **F18-20** Verify target `RTO <= 2 hours` through drill/measurement where feasible.
- **F18-21** Incident response runbook.
- **F18-22** Secret rotation runbook.
- **F18-23** Production access/DB least-privilege review.

## Exit Gate

Production Readiness Review PRD-20 passes, including **proven restore**, not only configured backup.

---

# 25. WP-F19 — Production Go-Live & Post-Launch Verification

## Goal

Mempromosikan release candidate menjadi full-stack production secara controlled dan membuktikan sistem tetap benar setelah deploy.

## Primary PRD References

- PRD-19
- PRD-20
- seluruh PRD P0 behavior

## Pre-Go-Live Gate

Harus tersedia:

- accepted Release Candidate,
- successful staging deploy,
- migration verified,
- backup/PITR healthy,
- restore drill successful,
- rollback procedure tested/documented,
- security config production valid,
- health checks green,
- monitoring/alerts active,
- 0 unresolved P0/P1.

## Production Sequence

```text
Select exact accepted commit
→ Confirm backup/recovery point
→ Run production migration
→ Deploy application revision
→ Verify readiness/liveness
→ Run business smoke
→ Verify auth/session
→ Verify published schedule read
→ Verify schedule mutation guard
→ Verify payroll read/lifecycle state
→ Verify audit write
→ Verify notification path
→ Verify report reconciliation sample
→ Observe elevated monitoring window
→ Declare production accepted
```

## Business Smoke Must Include

- login valid account,
- permission-aware navigation,
- dashboard reads correct current schedule,
- My Schedule desktop/mobile,
- Team Schedule,
- schedule management read access,
- one safe non-destructive mutation in approved test context if production procedure allows,
- payroll historical record readable,
- locked payroll remains locked,
- Activity History accessible,
- notification deep-link functional,
- report sample matches canonical detail.

## Post-Go-Live Tasks

- **F19-01** Verify release/commit/schema metadata.
- **F19-02** Monitor error rate/latency.
- **F19-03** Monitor DB pressure.
- **F19-04** Monitor authentication failures.
- **F19-05** Monitor schedule/payroll command failures.
- **F19-06** Confirm backup continues after release.
- **F19-07** Close production readiness checklist.
- **F19-08** Create post-launch issue list for non-blocking P2/P3 improvements.
- **F19-09** Record lessons learned / implementation handoff.

## Final Exit Gate

NOCScheduler dianggap **Full-Stack Production v1** hanya jika:

- production sehat,
- critical business flow verified,
- data integrity verified,
- audit evidence verified,
- desktop/mobile usable,
- Light/Dark functional,
- backup/restore capability proven,
- operational ownership jelas.

---

# 26. PRD-to-Workplan Traceability Matrix

| PRD | Primary Workplan Coverage |
|---|---|
| PRD-01 Product Vision | All phases; especially F03, F07, F10, F19 |
| PRD-02 Feature Specification | F03, F05–F13 |
| PRD-03 Scheduling Logic | F04, F06, F07, F17 |
| PRD-04 Payroll Logic | F04, F09, F10, F12, F17 |
| PRD-05 Exceptions/Leave/Overtime | F04, F08, F09, F17 |
| PRD-06 Information Architecture | F02, F03, F07–F13 |
| PRD-07 Roles & Permissions | F02, F05, F14, F17 |
| PRD-08 Data Model | F04, F05, F06, F08, F09 |
| PRD-09 Audit & History | F04, F05–F13, F14 |
| PRD-10 UI/UX | F01–F03, F07, F08, F10–F16 |
| PRD-11 Design System | F01–F03, F15, F16 |
| PRD-12 Responsive/Mobile | F02, F03, F07, F08, F10, F12, F13, F15 |
| PRD-13 UI Polish | F01–F03, F15, F16, F17 |
| PRD-14 Technical Architecture | F00, F04–F14, F18 |
| PRD-15 API Contract | F05–F14, F17 |
| PRD-16 Security | F00, F05, F06, F08, F09, F12–F14, F17–F19 |
| PRD-17 Reporting | F03, F12, F17 |
| PRD-18 Notifications | F03, F08, F09, F13, F17 |
| PRD-19 QA | Every phase gate; especially F16–F19 |
| PRD-20 Operations | F00, F18, F19 |

---

# 27. Recommended Implementation Rhythm Per Task

Setiap task implementation ideal mengikuti rhythm berikut:

```text
Read relevant PRD/rules
→ Inspect current code
→ Implement smallest coherent change
→ Add/update tests
→ Lint
→ Typecheck
→ Relevant tests
→ Build when boundary changes
→ Visual QA if UI
→ Commit with narrow message
```

Untuk high-risk change:

```text
Business Rule Review
→ Implementation
→ Negative Test
→ Concurrency/Idempotency Test where relevant
→ Audit Verification
→ E2E/Integration
→ Commit
```

---

# 28. Commit Scope Guidance

Recommended commit granularity examples:

```text
chore: bootstrap Next.js strict project foundation
feat: add semantic light and dark theme tokens
feat: build responsive application shell
feat: add employee and role database schema
feat: implement capability authorization service
feat: implement schedule work-date resolver
feat: add schedule publication transaction
feat: connect manage schedule workspace to API
feat: implement approved leave workflow
feat: implement deterministic shift incentive calculation
feat: add payroll lock lifecycle
feat: add audit correlation timeline
feat: add shift distribution report
feat: add notification deduplication policy
fix: prevent stale schedule version overwrite
polish: align schedule grid header and body geometry
test: add locked payroll historical regression
ops: add production readiness health checks
```

Avoid commit seperti:

```text
feat: implement backend
feat: finish app
fix: various things
```

---

# 29. Stop-the-Line Conditions

Implementation phase harus dihentikan untuk memperbaiki akar masalah jika ditemukan:

- payroll miscalculation,
- historical data drift,
- authorization bypass,
- schedule partial publish,
- destructive migration risk,
- audit evidence missing pada high-risk mutation,
- cross-midnight date corruption,
- mobile critical flow unusable,
- design-system divergence yang menyebar ke banyak page,
- flaky critical regression test yang menyembunyikan race condition,
- backup/restore tidak dapat dibuktikan menjelang production.

Jangan menumpuk feature baru di atas broken invariant.

---

# 30. Final Implementation Success Criteria

Workplan dianggap selesai ketika NOCScheduler telah menjadi aplikasi production yang:

- memiliki authentication dan permission server-side,
- memiliki employee/config management,
- memiliki published schedule sebagai source of truth,
- mendukung cross-midnight shift dengan benar,
- mendukung request/exception/replacement/swap/overtime baseline,
- menghitung payroll deterministik dan explainable,
- menjaga historical payroll/schedule integrity,
- memiliki audit trail usable,
- memiliki reporting yang reconcile ke canonical source,
- memiliki operational notification yang tidak spammy,
- memiliki UI premium/spatial/high-fidelity,
- memiliki desktop dan mobile dengan kualitas setara,
- memiliki Light/Dark Mode parity,
- lulus accessibility/security/visual/performance gates,
- memiliki CI/CD predictable,
- memiliki health/metrics/logging/alerting,
- memiliki backup dan proven restore,
- memiliki documented rollback/incident process,
- berjalan sebagai full-stack production system yang dapat dipercaya oleh internal NOC.

---

# 31. Current Project State

Pada saat workplan ini dibuat:

- PRD-01 sampai PRD-20 telah tersedia sebagai product/engineering source of truth.
- Implementation application code belum menjadi fokus utama.
- Next implementation entry point adalah **WP-F00 — Project Setup & Engineering Baseline**.

Tidak boleh langsung melompat ke domain feature besar sebelum F00, F01, dan F02 memiliki foundation yang stabil.
