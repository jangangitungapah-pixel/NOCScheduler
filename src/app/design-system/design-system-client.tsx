"use client";

import { useState } from "react";

import {
  AuditTimeline,
  Badge,
  Banner,
  BottomSheet,
  Button,
  CalendarDay,
  Checkbox,
  Combobox,
  ContextMenu,
  DataCell,
  DataRow,
  DataTable,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  ErrorState,
  HeadCell,
  Icon,
  InlineValidation,
  Input,
  Inspector,
  Popover,
  Radio,
  ScheduleCell,
  SearchInput,
  SegmentedControl,
  Select,
  ShiftBadge,
  Skeleton,
  Surface,
  Switch,
  Textarea,
  ThemeToggle,
  Toast,
  Tooltip,
} from "@/components/ui";

const employeeOptions = [
  { value: "budi", label: "Budi Santoso", description: "NOC Engineer · A01" },
  { value: "dina", label: "Dina Maharani", description: "NOC Engineer · A02" },
  { value: "rio", label: "Rio Pratama", description: "NOC Engineer · A03" },
];

const auditEvents = [
  {
    id: "a1",
    title: "Assignment diperbarui",
    actor: "Scheduler",
    timestamp: "12 Agu 2026 · 14:20",
    change: "S2 → S3 pada 18 Agustus 2026",
    reason: "Penyesuaian coverage malam",
  },
  {
    id: "a2",
    title: "Jadwal dipublikasikan",
    actor: "Scheduler",
    timestamp: "12 Agu 2026 · 13:55",
    change: "Draft v3 → Published v3",
  },
];

export function DesignSystemClient() {
  const [employee, setEmployee] = useState("budi");
  const [notifications, setNotifications] = useState(true);
  const [view, setView] = useState<"month" | "week" | "agenda">("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <main className="ds-page">
      <header className="ds-header">
        <div>
          <p className="ds-kicker">WP-F01 · Visual Reference</p>
          <h1 className="ds-title">NOCScheduler Design System</h1>
          <p className="ds-lead">
            Satu visual grammar untuk operasi NOC yang padat, presisi, responsif, dan tetap tenang.
            Surface ini sengaja berdiri sebelum application shell dan halaman bisnis penuh.
          </p>
        </div>
        <div className="ds-toolbar">
          <Badge tone="success" showDot>
            F01 Reference
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <Banner tone="info" title="Light-first, Dark-ready">
        Gunakan tombol theme di kanan atas untuk memeriksa parity tanpa reload halaman.
      </Banner>

      <section className="ds-section" aria-labelledby="tokens-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="tokens-title">Token & surfaces</h2>
            <p className="ds-section__description">Semantic roles, bukan raw color di feature page.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card">
            <p className="ds-card__title">Semantic surfaces</p>
            <div className="ds-stack">
              {[
                ["surface.canvas", "canvas"],
                ["surface.base", "base"],
                ["surface.selected", "selected"],
                ["action.primary", "primary"],
              ].map(([label, token]) => (
                <div className="ds-token-line" key={label}>
                  <span>{label}</span>
                  <span className="ds-token-swatch" data-token={token} />
                </div>
              ))}
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-card__title">Depth</p>
            <div className="ds-stack">
              <Surface elevation="subtle" padding="sm">Subtle / E0</Surface>
              <Surface padding="sm">Base / E1</Surface>
              <Surface elevation="raised" padding="sm">Raised / E2</Surface>
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-card__title">Typography</p>
            <div className="ds-stack">
              <strong>Operational clarity</strong>
              <span>Body text untuk informasi padat.</span>
              <span className="ui-numeric">Rp6.125.000 · 23:00–07:00</span>
              <small>Caption untuk metadata sekunder.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="actions-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="actions-title">Actions & status</h2>
            <p className="ds-section__description">State visual konsisten tanpa membuat destructive action terlalu dominan.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card ds-card--wide">
            <p className="ds-card__title">Buttons</p>
            <div className="ds-row">
              <Button leadingIcon={<Icon name="plus" size={16} />} variant="primary">Buat jadwal</Button>
              <Button variant="secondary">Review</Button>
              <Button variant="tonal">Validate</Button>
              <Button variant="ghost">Batal</Button>
              <Button leadingIcon={<Icon name="trash" size={16} />} variant="destructive">Hapus</Button>
              <Button loading variant="primary">Menyimpan</Button>
              <Tooltip content="Aksi icon-only tetap punya accessible label.">
                <Button aria-label="Opsi lainnya" iconOnly variant="secondary"><Icon name="more" size={18} /></Button>
              </Tooltip>
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-card__title">Status & shift identity</p>
            <div className="ds-row">
              <Badge tone="info" showDot>Calculated</Badge>
              <Badge tone="success" showDot>Locked</Badge>
              <Badge tone="warning" showDot>Dirty</Badge>
              <Badge tone="danger" showDot>Error</Badge>
              <ShiftBadge shift="S1" />
              <ShiftBadge shift="S2" />
              <ShiftBadge shift="S3" />
              <ShiftBadge shift="OFF" />
              <ShiftBadge shift="LEAVE" />
            </div>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="forms-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="forms-title">Form family</h2>
            <p className="ds-section__description">Persistent labels, helper text, focus, error, disabled, dan searchable selection.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card ds-card--wide">
            <div className="ds-form-grid">
              <Input helperText="Kode unik employee." label="Employee code" placeholder="A01" />
              <SearchInput label="Cari employee" placeholder="Nama atau kode" />
              <Select defaultValue="S2" label="Shift">
                <option value="S1">Shift 1 · Pagi</option>
                <option value="S2">Shift 2 · Siang</option>
                <option value="S3">Shift 3 · Malam</option>
              </Select>
              <Combobox
                label="Employee"
                onValueChange={setEmployee}
                options={employeeOptions}
                placeholder="Cari employee"
                value={employee}
              />
              <Input error="Nominal harus lebih besar dari Rp0." label="Incentive" placeholder="Rp75.000" />
              <Input disabled label="Locked payroll period" value="Agustus 2026" />
            </div>
            <div style={{ marginTop: "var(--space-4)" }}>
              <Textarea helperText="Alasan disimpan sebagai bagian dari business history." label="Reason" placeholder="Jelaskan perubahan..." />
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-card__title">Selection controls</p>
            <div className="ds-stack">
              <Checkbox defaultChecked label="Tampilkan exception" />
              <Radio defaultChecked label="Planned coverage" name="coverage" />
              <Radio label="Effective coverage" name="coverage" />
              <Switch checked={notifications} label="Notification in-app" onCheckedChange={setNotifications} />
              <SegmentedControl
                ariaLabel="Tampilan jadwal"
                onValueChange={setView}
                options={[
                  { value: "month", label: "Month" },
                  { value: "week", label: "Week" },
                  { value: "agenda", label: "Agenda" },
                ]}
                value={view}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="layers-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="layers-title">Contextual layers</h2>
            <p className="ds-section__description">Discoverable actions tetap tersedia; gesture/context menu hanya enhancement.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card ds-card--full">
            <div className="ds-row">
              <Popover trigger={<Button trailingIcon={<Icon name="chevron-down" size={16} />}>Popover</Button>}>
                <strong>Coverage context</strong>
                <p style={{ marginBottom: 0, color: "var(--text-secondary)" }}>S3 memiliki 2 personel efektif dari target 3.</p>
              </Popover>
              <DropdownMenu
                groupLabel="Schedule actions"
                items={[
                  { id: "edit", label: "Edit assignment" },
                  { id: "duplicate", label: "Copy ke tanggal berikut" },
                  { id: "delete", label: "Hapus assignment", danger: true },
                ]}
                trigger={<Button trailingIcon={<Icon name="chevron-down" size={16} />}>Dropdown</Button>}
              />
              <ContextMenu
                items={[{ id: "inspect", label: "Inspect cell" }, { id: "history", label: "Lihat history" }]}
                trigger={<Button variant="ghost">Context menu surface</Button>}
              />
              <Button onClick={() => setDialogOpen(true)} variant="secondary">Dialog</Button>
              <Button onClick={() => setDrawerOpen(true)} variant="secondary">Drawer</Button>
              <Button onClick={() => setInspectorOpen(true)} variant="secondary">Inspector</Button>
              <Button onClick={() => setSheetOpen(true)} variant="secondary">Bottom sheet</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="feedback-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="feedback-title">Feedback & states</h2>
            <p className="ds-section__description">Blocking error dekat sumbernya; toast hanya transient feedback.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card">
            <div className="ds-stack">
              <Banner tone="warning" title="Payroll dirty">Source schedule berubah setelah kalkulasi.</Banner>
              <InlineValidation title="Minimum rest belum terpenuhi." tone="danger" />
              <Toast tone="success" title="Perubahan tersimpan">Draft belum dipublikasikan.</Toast>
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-card__title">Skeleton geometry</p>
            <div className="ds-stack">
              <Skeleton variant="title" />
              <Skeleton />
              <Skeleton />
              <Skeleton variant="block" />
            </div>
          </div>
          <div className="ds-card">
            <EmptyState description="Tidak ada request yang membutuhkan tindakan." title="Inbox operasional bersih" />
          </div>
          <div className="ds-card">
            <ErrorState actionLabel="Coba lagi" description="Data gagal dimuat. Perubahan lokal belum dikirim." title="Tidak dapat memuat data" />
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="data-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="data-title">Dense operational data</h2>
            <p className="ds-section__description">Numeric alignment dan scanability adalah first-class.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card ds-card--full">
            <DataTable caption="Payroll preview · Agustus 2026">
              <thead>
                <tr>
                  <HeadCell sticky>Employee</HeadCell>
                  <HeadCell align="center" sticky>S2</HeadCell>
                  <HeadCell align="center" sticky>S3</HeadCell>
                  <HeadCell align="right" sticky>Base salary</HeadCell>
                  <HeadCell align="right" sticky>THP</HeadCell>
                  <HeadCell align="center" sticky>Status</HeadCell>
                </tr>
              </thead>
              <tbody>
                <DataRow>
                  <DataCell>Budi Santoso</DataCell>
                  <DataCell align="center">6</DataCell>
                  <DataCell align="center">7</DataCell>
                  <DataCell align="right">Rp5.000.000</DataCell>
                  <DataCell align="right">Rp6.125.000</DataCell>
                  <DataCell align="center"><Badge tone="success">LOCKED</Badge></DataCell>
                </DataRow>
                <DataRow selected>
                  <DataCell>Dina Maharani</DataCell>
                  <DataCell align="center">7</DataCell>
                  <DataCell align="center">6</DataCell>
                  <DataCell align="right">Rp5.000.000</DataCell>
                  <DataCell align="right">Rp6.075.000</DataCell>
                  <DataCell align="center"><Badge tone="info">CALCULATED</Badge></DataCell>
                </DataRow>
              </tbody>
            </DataTable>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="schedule-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="schedule-title">Calendar & schedule semantics</h2>
            <p className="ds-section__description">Today ≠ selected; OFF ≠ unassigned; validation tetap punya explanation cue.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card">
            <p className="ds-card__title">Date states</p>
            <div className="ds-row" role="grid" aria-label="Contoh state tanggal">
              <CalendarDay dateLabel="12" dayName="Rab" today />
              <CalendarDay dateLabel="13" dayName="Kam" selected />
              <CalendarDay dateLabel="15" dayName="Sab" weekend />
              <CalendarDay dateLabel="17" dayName="Sen" holiday />
            </div>
          </div>
          <div className="ds-card ds-card--wide">
            <p className="ds-card__title">Schedule cell anatomy</p>
            <div className="ds-schedule-grid">
              <ScheduleCell assignment="S1" state="published" timeLabel="07:00–15:00" />
              <ScheduleCell assignment="S2" selected state="draft" timeLabel="15:00–23:00" validationLabel="Rest warning" />
              <ScheduleCell assignment="S3" state="published" timeLabel="23:00–07:00" />
              <ScheduleCell assignment="OFF" state="published" />
              <ScheduleCell assignment="LEAVE" exceptionLabel="Approved" state="published" />
              <ScheduleCell assignment="UNASSIGNED" state="draft" />
            </div>
          </div>
        </div>
      </section>

      <section className="ds-section" aria-labelledby="history-title">
        <div className="ds-section__header">
          <div>
            <h2 className="ds-section__title" id="history-title">Human-readable history</h2>
            <p className="ds-section__description">Audit payload mentah bukan default human view.</p>
          </div>
        </div>
        <div className="ds-grid">
          <div className="ds-card ds-card--wide">
            <AuditTimeline events={auditEvents} />
          </div>
        </div>
      </section>

      <Dialog
        description="Bounded task dengan fokus yang jelas."
        footer={<><Button onClick={() => setDialogOpen(false)} variant="ghost">Batal</Button><Button onClick={() => setDialogOpen(false)} variant="primary">Simpan</Button></>}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title="Edit assignment"
      >
        <Input label="Work date" type="date" value="2026-08-18" readOnly />
      </Dialog>
      <Drawer description="Context di belakang tetap terlihat." onOpenChange={setDrawerOpen} open={drawerOpen} title="Employee detail">
        <AuditTimeline events={auditEvents} />
      </Drawer>
      <Inspector description="Detail kontekstual tanpa memindahkan user dari workspace." onOpenChange={setInspectorOpen} open={inspectorOpen} title="Schedule inspector">
        <ScheduleCell assignment="S3" state="published" timeLabel="23:00–07:00" />
      </Inspector>
      <BottomSheet
        description="Mobile contextual action dengan safe-area footer."
        footer={<Button onClick={() => setSheetOpen(false)} variant="primary">Tutup</Button>}
        onOpenChange={setSheetOpen}
        open={sheetOpen}
        title="Shift detail"
      >
        <ScheduleCell assignment="S2" state="published" timeLabel="15:00–23:00" />
      </BottomSheet>
    </main>
  );
}
