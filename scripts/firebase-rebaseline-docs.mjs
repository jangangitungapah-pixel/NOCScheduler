import { readFile, writeFile } from "node:fs/promises";

const workplanPath = "docs/workplan/WORKPLAN_NOCScheduler_Fullstack_Implementation_Master_v1.md";
const f04NotesPath = "docs/engineering/WP-F04_IMPLEMENTATION_NOTES.md";
const f04rNotesPath = "docs/engineering/WP-F04R_FIREBASE_REBASELINE_NOTES.md";
const readmePath = "README.md";
const workflowPath = ".github/workflows/quality.yml";

function replaceRequired(source, searchValue, replacement, label) {
  const next = source.replace(searchValue, replacement);
  if (next === source) throw new Error(`Firebase rebaseline patch missed: ${label}`);
  return next;
}

async function addPlatformAmendmentNotice(path) {
  let content = await readFile(path, "utf8");
  if (content.includes("PRD-21 Firebase Platform Architecture Amendment")) return;

  const firstLineEnd = content.indexOf("\n");
  const notice =
    "\n> **Architecture Amendment:** Platform-specific persistence, authentication, hosting, deployment, and database assumptions in this document are superseded where they conflict with **PRD-21 — Firebase Platform Architecture Amendment**. Product/business requirements remain canonical.\n";
  content = `${content.slice(0, firstLineEnd + 1)}${notice}${content.slice(firstLineEnd + 1)}`;
  await writeFile(path, content);
}

async function patchWorkplan() {
  let content = await readFile(workplanPath, "utf8");

  content = replaceRequired(
    content,
    "**Canonical Product References:** PRD-01 through PRD-20",
    "**Canonical Product References:** PRD-01 through PRD-21",
    "canonical PRD range",
  );
  content = replaceRequired(
    content,
    "→ Repository / PostgreSQL",
    "→ Repository / Cloud Firestore",
    "server-side canonical flow",
  );
  content = replaceRequired(
    content,
    "- migration telah direview bila schema berubah,",
    "- Firestore data contract, index, atau Security Rules change telah direview bila persistence boundary berubah,",
    "global phase done persistence gate",
  );
  content = replaceRequired(
    content,
    "| WP-F04 | Database & Domain Foundation | PostgreSQL schema, migrations, repositories, date/money core |",
    "| WP-F04R | Firebase Platform & Domain Foundation | App Hosting + Firebase Auth/Firestore/Admin foundation + date/money core |",
    "phase map F04 row",
  );

  const newF04F05 = `# 10. WP-F04R — Firebase Platform & Domain Foundation

## Goal

Membangun Firebase-managed platform foundation yang menjaga historical correctness tanpa self-managed application/database server.

WP-F04 PostgreSQL/Drizzle sebelumnya **superseded** sebelum acceptance dan disimpan hanya sebagai historical engineering record. PRD-21 menjadi architecture amendment yang mengikat phase ini dan semua phase setelahnya.

## Primary PRD References

- PRD-03 through PRD-09
- PRD-14 through PRD-16
- PRD-19/20
- PRD-21

## Tasks

- **F04R-01** Remove PostgreSQL/Drizzle/Docker runtime dependencies and CI assumptions.
- **F04R-02** Configure Firebase JS SDK + Firebase Admin SDK.
- **F04R-03** Configure Firebase App Hosting runtime baseline.
- **F04R-04** Configure Firebase Local Emulator Suite with isolated \`demo-*\` project.
- **F04R-05** Define typed canonical Firestore collection/document contracts.
- **F04R-06** Define Firestore composite-index baseline from canonical queries.
- **F04R-07** Start Firestore Security Rules fail-closed.
- **F04R-08** Implement stable identity/version/effective-date Firestore patterns.
- **F04R-09** Implement optimistic \`rowVersion\` transaction helper.
- **F04R-10** Implement create-only immutable historical-write helper.
- **F04R-11** Preserve central \`Asia/Jakarta\` business-date module.
- **F04R-12** Preserve integer-IDR money module.
- **F04R-13** Implement deterministic emulator seed with live-project refusal guard.
- **F04R-14** Implement Firebase Admin/Firestore contract tests.
- **F04R-15** Implement Firestore Security Rules emulator tests.
- **F04R-16** Rebaseline PRD/workplan platform assumptions before F05.
- **F04R-17** Retain complete F00–F03 product regression suite.

## Exit Gate

- no Docker/PostgreSQL/Drizzle prerequisite remains,
- Firebase emulator foundation is deterministic,
- direct Firestore browser access is fail-closed,
- immutable/versioned Firestore helpers are tested,
- existing UI/domain regression stays green,
- final CI is read-only,
- WP-F05 has not started.

---

# 11. WP-F05 — Authentication, Authorization, Employee & Settings Foundation

## Goal

Membuat Firebase identity, access, employee profile, dan configurable operational settings siap production pattern.

## Primary PRD References

- PRD-02
- PRD-07 through PRD-09
- PRD-14 through PRD-16
- PRD-21

## Tasks

- **F05-01** Integrate Firebase Authentication.
- **F05-02** Implement secure Firebase ID-token/session verification and origin/CSRF baseline for server mutations.
- **F05-03** Login/logout/session expiry UX.
- **F05-04** Account disable + token/session revocation strategy.
- **F05-05** Implement centralized capability service.
- **F05-06** Seed baseline roles: NOC Member, Scheduler/Supervisor, Administrator.
- **F05-07** Implement permission scopes in Firestore-backed access documents.
- **F05-08** Implement route/API server authorization guards.
- **F05-09** Last Administrator protection.
- **F05-10** Employee CRUD/archive/inactive workflow on Firestore.
- **F05-11** Shift configuration with effective dating.
- **F05-12** Salary and incentive configuration with effective dating.
- **F05-13** Holiday/settings configuration.
- **F05-14** Audit access/config mutation.
- **F05-15** Replace fixture data on Employee/Settings/Access pages with real Firebase-backed API/read models.
- **F05-16** Add capability-aware Firestore Security Rules only for deliberately exposed client reads.
- **F05-17** Adversarial authorization + Security Rules emulator tests.

## Exit Gate

- no UI-only permission boundary,
- self privilege escalation impossible,
- direct client writes to high-risk business collections remain prohibited,
- all configuration mutation audited,
- employee history retained after account disable,
- Settings UI remains consistent with design system.

---

# 12. WP-F06 — Scheduling Engine & Schedule API`;

  content = replaceRequired(
    content,
    /# 10\. WP-F04 — Database & Domain Foundation[\s\S]*?# 12\. WP-F06 — Scheduling Engine & Schedule API/,
    newF04F05,
    "F04/F05 section",
  );

  const simpleReplacements = [
    ["- **F17-03** Full DB/integration suite.", "- **F17-03** Full Firebase emulator/integration suite."],
    ["- **F17-16** Migration from empty DB test.", "- **F17-16** Empty-emulator deterministic seed + canonical Firestore contract test."],
    ["- **F17-17** Migration from previous schema snapshot test.", "- **F17-17** Firestore index/rules/data-contract compatibility test from previous release fixtures."],
    ["| PRD-03 Scheduling Logic | F04, F06, F07, F17 |", "| PRD-03 Scheduling Logic | F04R, F06, F07, F17 |"],
    ["| PRD-04 Payroll Logic | F04, F09, F10, F12, F17 |", "| PRD-04 Payroll Logic | F04R, F09, F10, F12, F17 |"],
    ["| PRD-05 Exceptions/Leave/Overtime | F04, F08, F09, F17 |", "| PRD-05 Exceptions/Leave/Overtime | F04R, F08, F09, F17 |"],
    ["| PRD-08 Data Model | F04, F05, F06, F08, F09 |", "| PRD-08 Data Model | F04R, F05, F06, F08, F09 |"],
    ["| PRD-09 Audit & History | F04, F05–F13, F14 |", "| PRD-09 Audit & History | F04R, F05–F13, F14 |"],
    ["| PRD-14 Technical Architecture | F00, F04–F14, F18 |", "| PRD-14 Technical Architecture | F00, F04R–F14, F18 |"],
    ["| PRD-20 Operations | F00, F18, F19 |", "| PRD-20 Operations | F00, F18, F19 |\n| PRD-21 Firebase Platform Amendment | F04R, F05–F19 |"],
    ["feat: add employee and role database schema", "feat: add employee and role Firestore contracts"],
    ["- destructive migration risk,", "- destructive or non-recoverable Firestore data migration risk,"],
  ];

  for (const [from, to] of simpleReplacements) {
    content = replaceRequired(content, from, to, from);
  }

  const newF18 = `# 24. WP-F18 — Firebase CI/CD, Staging, Backup & Observability

## Goal

Membuat Firebase production environment operable, observable, recoverable, cost-aware, dan rollback-capable.

## Primary PRD References

- PRD-14
- PRD-16
- PRD-19
- PRD-20
- PRD-21

## Tasks

- **F18-01** Finalize CI merge gate.
- **F18-02** Configure Firebase App Hosting GitHub integration and preview/rollout policy.
- **F18-03** Create isolated Firebase staging project/environment.
- **F18-04** Provision production Firebase project + Firestore database.
- **F18-05** Configure Firebase Authentication production providers/domains.
- **F18-06** Configure App Hosting runtime environment + Secret Manager references.
- **F18-07** Configure production custom domain/managed HTTPS.
- **F18-08** Configure immutable release/build identification.
- **F18-09** Implement \`/api/health/live\` and Firebase-aware readiness checks where useful.
- **F18-10** Structured logging with request/correlation/release IDs.
- **F18-11** Metrics for request, Firestore, Auth, and critical business-command failures.
- **F18-12** Actionable alerting + severity policy.
- **F18-13** Firestore index/Security Rules deployment validation.
- **F18-14** App Hosting rollout/rollback procedure.
- **F18-15** Configure Firestore backup/export/recovery strategy appropriate to selected Firebase/Google Cloud capabilities.
- **F18-16** Backup health monitoring.
- **F18-17** Restore runbook.
- **F18-18** Execute successful isolated restore drill.
- **F18-19** Measure and document practical RPO/RTO for the selected managed backup strategy.
- **F18-20** Configure budget alerts and cost monitoring for App Hosting/Firestore/Auth supporting services.
- **F18-21** Incident response runbook.
- **F18-22** Secret rotation runbook.
- **F18-23** Production IAM/Admin SDK least-privilege review.

## Exit Gate

Production Readiness Review PRD-20/21 passes, including proven restore and controlled App Hosting rollback—not only configured infrastructure.

---

# 25. WP-F19 — Production Go-Live & Post-Launch Verification`;

  content = replaceRequired(
    content,
    /# 24\. WP-F18 — CI\/CD, Staging, Backup & Observability[\s\S]*?# 25\. WP-F19 — Production Go-Live & Post-Launch Verification/,
    newF18,
    "F18 section",
  );

  content = content
    .replace("- migration verified,", "- Firestore indexes/rules/data-contract deployment verified,")
    .replace("Select exact accepted commit\n→ Confirm backup/recovery point\n→ Run production migration\n→ Deploy application revision", "Select exact accepted commit\n→ Confirm backup/recovery point\n→ Deploy Firestore indexes/rules/config changes\n→ Deploy App Hosting application revision")
    .replace("- **F19-01** Verify release/commit/schema metadata.", "- **F19-01** Verify release/commit/Firestore contract metadata.")
    .replace("- **F19-03** Monitor DB pressure.", "- **F19-03** Monitor Firestore usage/latency/quota pressure.");

  await writeFile(workplanPath, content);
}

async function patchHistoricalNotes() {
  let content = await readFile(f04NotesPath, "utf8");
  if (!content.includes("SUPERSEDED by WP-F04R")) {
    content = content.replace(
      "> Status: **COMPLETE — awaiting user acceptance**  ",
      "> Status: **SUPERSEDED by WP-F04R / PRD-21 — historical engineering record only**  ",
    );
    content = content.replace(
      "## Goal",
      "## Supersession notice\n\nThis PostgreSQL/Drizzle implementation was completed technically but was superseded before acceptance when the owner selected a fully managed Firebase architecture. It is retained only to explain repository history. Active implementation must follow `PRD-21_Firebase_Platform_Architecture_Amendment.md` and `WP-F04R`.\n\n## Goal",
    );
    await writeFile(f04NotesPath, content);
  }
}

async function finalize() {
  let notes = await readFile(f04rNotesPath, "utf8");
  notes = notes.replace(
    "> Status: **IN PROGRESS — architecture rebaseline before WP-F05**  ",
    "> Status: **COMPLETE — awaiting user acceptance**  ",
  );
  if (!notes.includes("Bootstrap verification run:")) {
    notes = notes.replace(
      "> WP-F05: **NOT STARTED**",
      `> WP-F05: **NOT STARTED**  \n> Bootstrap verification run: \`${process.env.GITHUB_RUN_ID ?? "local"}\``,
    );
  }
  await writeFile(f04rNotesPath, notes);

  let readme = await readFile(readmePath, "utf8");
  readme = readme.replace(
    "- **WP-F04R — Firebase Platform & Domain Foundation: IN PROGRESS**",
    "- **WP-F04R — Firebase Platform & Domain Foundation: COMPLETE — awaiting user acceptance**",
  );
  await writeFile(readmePath, readme);

  const finalWorkflow = `name: Quality

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: quality-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: F04R Firebase quality gate
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup pnpm and Node.js
        uses: pnpm/setup@v2
        with:
          version: 11.17.0
          runtime: node@24.18.0
          install: false
          cache: true

      - name: Setup Java for Firebase emulators
        uses: actions/setup-java@v5
        with:
          distribution: temurin
          java-version: '21'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Static and application quality gates
        run: pnpm quality

      - name: Firebase emulator contracts and Security Rules
        run: pnpm firebase:test

      - name: Install Chromium
        run: pnpm exec playwright install --with-deps chromium

      - name: Playwright regression
        run: pnpm e2e
`;

  await writeFile(workflowPath, finalWorkflow);
}

if (process.argv.includes("--finalize")) {
  await finalize();
} else {
  await patchWorkplan();
  await patchHistoricalNotes();
  for (const path of [
    "docs/prd/PRD-08_Data_Model_Database_Architecture.md",
    "docs/prd/PRD-14_Technical_Architecture_Technology_Stack.md",
    "docs/prd/PRD-15_API_Backend_Contract.md",
    "docs/prd/PRD-16_Authentication_Security_Data_Integrity.md",
    "docs/prd/PRD-19_QA_Testing_Acceptance_Criteria.md",
    "docs/prd/PRD-20_Deployment_Operations_Backup_Observability.md",
  ]) {
    await addPlatformAmendmentNotice(path);
  }
}
