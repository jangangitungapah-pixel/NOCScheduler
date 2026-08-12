"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/layout/shell-content";
import type { RouteMeta } from "@/components/layout/navigation";
import { Badge, Icon, ShiftBadge, Surface } from "@/components/ui";
import type { ShiftKind } from "@/components/ui";

import {
  employees,
  mySchedule,
  requests,
  teamSchedule,
  type RequestFixture,
  type ScheduleCellFixture,
  type ShiftCode,
} from "./fixtures";

type ScheduleMode = "agenda" | "week" | "month";
type TeamMobileMode = "day" | "employee";

type SurfaceFrameProps = {
  children: React.ReactNode;
  meta: RouteMeta;
  actions?: React.ReactNode;
  workspace?: boolean;
};

function SurfaceFrame({ actions, children, meta, workspace = false }: SurfaceFrameProps) {
  return (
    <div className={workspace || meta.workspace ? "app-page app-page--workspace" : "app-page"}>
      <PageHeader
        actions={actions}
        badge={
          <Badge showDot tone="brand">
            Fixture preview
          </Badge>
        }
        meta={meta}
      />
      <div className="product-page">{children}</div>
    </div>
  );
}

function Avatar({ initials, name }: { initials: string; name: string }) {
  return (
    <span aria-label={name} className="product-avatar" title={name}>
      {initials}
    </span>
  );
}

function shiftKind(shift: ShiftCode): ShiftKind {
  return shift;
}

function shiftTime(item: ScheduleCellFixture) {
  if (!item.start) return item.shift === "OFF" ? "Rest day" : (item.note ?? "No shift time");
  return `${item.start}–${item.end}${item.shift === "S3" ? " (+1 hari)" : ""}`;
}

function ScheduleAgenda({ items = mySchedule }: { items?: ScheduleCellFixture[] }) {
  return (
    <Surface className="product-agenda" padding="none">
      {items.map((item) => (
        <article
          className="product-agenda-row"
          id={item.workDate === "2026-08-13" ? "today" : undefined}
          key={item.workDate}
        >
          <div className="product-agenda-row__date">
            <span>{item.dayLabel}</span>
            <strong>{item.dateLabel}</strong>
          </div>
          <div className="product-agenda-row__main">
            <div className="product-row-title">
              <ShiftBadge expanded shift={shiftKind(item.shift)} />
              <strong>{shiftTime(item)}</strong>
            </div>
            <p>
              {item.note ??
                (item.state === "PLANNED"
                  ? "Published planned assignment"
                  : "Effective assignment")}
            </p>
          </div>
          <Badge tone={item.state === "EFFECTIVE" ? "success" : "neutral"}>{item.state}</Badge>
        </article>
      ))}
    </Surface>
  );
}

function ScheduleWeek() {
  return (
    <Surface className="product-week-grid" padding="none">
      {mySchedule.map((item) => (
        <article key={item.workDate}>
          <div className="product-week-grid__date">
            <span>{item.dayLabel.slice(0, 3)}</span>
            <strong>{item.dateLabel}</strong>
          </div>
          <ShiftBadge expanded shift={shiftKind(item.shift)} />
          <strong>{shiftTime(item)}</strong>
          <small>{item.note ?? "Published assignment"}</small>
        </article>
      ))}
    </Surface>
  );
}

function ScheduleMonth() {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const assignmentByDay = new Map(mySchedule.map((item) => [Number(item.dateLabel), item]));

  return (
    <Surface className="product-month-calendar" padding="none">
      <div className="product-month-calendar__weekdays" aria-hidden="true">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="product-month-calendar__grid">
        {days.map((day) => {
          const item = assignmentByDay.get(day);
          return (
            <div className={day === 13 ? "is-today" : undefined} data-shift={item?.shift} key={day}>
              <strong>{day}</strong>
              {item ? (
                <>
                  <ShiftBadge shift={shiftKind(item.shift)} />
                  <small>{item.start ?? item.note ?? "Rest day"}</small>
                </>
              ) : (
                <small>—</small>
              )}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

export function MyScheduleExperience({ meta }: { meta: RouteMeta }) {
  const [mode, setMode] = useState<ScheduleMode>("agenda");

  return (
    <SurfaceFrame
      actions={
        <>
          <a className="product-action" href="#today">
            Jump to today
          </a>
          <Link
            className="product-action product-action--primary"
            href="/schedule/requests?create=1"
          >
            Request change
          </Link>
        </>
      }
      meta={meta}
      workspace
    >
      <div className="product-toolbar">
        <div className="product-segmented" aria-label="Schedule view">
          {(["month", "week", "agenda"] as const).map((value) => (
            <button
              aria-pressed={mode === value}
              key={value}
              onClick={() => setMode(value)}
              type="button"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <div className="product-period-control">
          <button aria-label="Previous period" type="button">
            ‹
          </button>
          <strong>August 2026</strong>
          <button aria-label="Next period" type="button">
            ›
          </button>
        </div>
      </div>

      <div className="product-date-strip" aria-label="Compact schedule date strip">
        {mySchedule.map((item, index) => (
          <a
            className={index === 0 ? "is-active" : undefined}
            href={`#${item.workDate}`}
            key={item.workDate}
          >
            <span>{item.dayLabel.slice(0, 3)}</span>
            <strong>{item.dateLabel}</strong>
            <i data-shift={item.shift} />
          </a>
        ))}
      </div>

      <section className="product-two-column">
        <div className="product-view-panel" data-mode={mode}>
          <div className="product-section-heading">
            <div>
              <span className="product-eyebrow">Published schedule</span>
              <h2>{mode === "agenda" ? "Upcoming assignments" : `${mode} view`}</h2>
            </div>
          </div>
          {mode === "agenda" ? <ScheduleAgenda /> : null}
          {mode === "week" ? <ScheduleWeek /> : null}
          {mode === "month" ? <ScheduleMonth /> : null}
        </div>
        <aside className="product-side-stack">
          <Surface padding="md">
            <span className="product-eyebrow">Next shift</span>
            <div className="product-side-focus">
              <ShiftBadge expanded shift="S2" />
              <strong>15:00–23:00</strong>
              <span>14 Aug · Main NOC Floor</span>
            </div>
          </Surface>
          <Surface padding="md">
            <span className="product-eyebrow">Schedule history</span>
            <h3>2 changes this month</h3>
            <p className="product-muted">Latest correction changed 17 Aug from S2 to S3.</p>
            <Link className="product-text-link" href="/activity/AUD-8041">
              Open change history →
            </Link>
          </Surface>
        </aside>
      </section>
    </SurfaceFrame>
  );
}

function TeamByDay({ dateIndex }: { dateIndex: number }) {
  const date = teamSchedule[0]?.cells[dateIndex];
  if (!date) return null;

  return (
    <div className="product-team-mobile-list">
      <div className="product-section-heading">
        <div>
          <span className="product-eyebrow">{date.dayLabel}</span>
          <h2>{date.dateLabel} August</h2>
        </div>
        <Badge tone={date.state === "EFFECTIVE" ? "success" : "neutral"}>{date.state}</Badge>
      </div>
      <Surface padding="none">
        {(["S1", "S2", "S3", "OFF", "LEAVE"] as const).map((shift) => {
          const rows = teamSchedule.filter((row) => row.cells[dateIndex]?.shift === shift);
          if (!rows.length) return null;
          return (
            <section className="product-team-shift-group" key={shift}>
              <div className="product-team-shift-group__heading">
                <ShiftBadge expanded shift={shift} />
                <span>{rows.length} employee</span>
              </div>
              {rows.map((row) => {
                const cell = row.cells[dateIndex]!;
                return (
                  <div className="product-person-row" key={row.employeeId}>
                    <Avatar initials={row.initials} name={row.employeeName} />
                    <div>
                      <strong>{row.employeeName}</strong>
                      <span>{shiftTime(cell)}</span>
                    </div>
                    <Badge tone={cell.state === "EFFECTIVE" ? "success" : "neutral"}>
                      {cell.state}
                    </Badge>
                  </div>
                );
              })}
            </section>
          );
        })}
      </Surface>
    </div>
  );
}

function TeamByEmployee({ employeeId }: { employeeId: string }) {
  const row = teamSchedule.find((item) => item.employeeId === employeeId) ?? teamSchedule[0]!;
  return (
    <div className="product-team-mobile-list">
      <label className="product-inline-select">
        Employee
        <select value={row.employeeId} onChange={() => undefined}>
          <option value={row.employeeId}>{row.employeeName}</option>
        </select>
      </label>
      <ScheduleAgenda items={row.cells} />
    </div>
  );
}

export function TeamScheduleExperience({ meta }: { meta: RouteMeta }) {
  const [mobileMode, setMobileMode] = useState<TeamMobileMode>("day");
  const [dateIndex, setDateIndex] = useState(2);
  const [employeeId, setEmployeeId] = useState(teamSchedule[0]!.employeeId);

  return (
    <SurfaceFrame
      actions={
        <Link className="product-action" href="/schedule/manage">
          Open manage workspace
        </Link>
      }
      meta={meta}
      workspace
    >
      <div className="product-toolbar product-desktop-team-toolbar">
        <div className="product-inline-meta">
          <Badge tone="success">Effective through 12 Aug</Badge>
          <Badge tone="neutral">Planned from 13 Aug</Badge>
        </div>
      </div>

      <Surface className="product-schedule-matrix-wrap product-team-desktop-matrix" padding="none">
        <div
          className="product-schedule-matrix"
          role="table"
          aria-label="Team schedule fixture matrix"
        >
          <div className="product-schedule-row product-schedule-row--head" role="row">
            <div role="columnheader">Employee</div>
            {teamSchedule[0]?.cells.map((cell) => (
              <div key={cell.workDate} role="columnheader">
                <span>{cell.dayLabel}</span>
                <strong>{cell.dateLabel}</strong>
              </div>
            ))}
          </div>
          {teamSchedule.map((row) => (
            <div className="product-schedule-row" key={row.employeeId} role="row">
              <div className="product-schedule-person" role="rowheader">
                <Avatar initials={row.initials} name={row.employeeName} />
                <span>{row.employeeName}</span>
              </div>
              {row.cells.map((cell) => (
                <div
                  className="product-schedule-cell"
                  data-state={cell.state}
                  key={cell.workDate}
                  role="cell"
                >
                  <ShiftBadge shift={shiftKind(cell.shift)} />
                  <small>{cell.start ?? cell.note ?? "—"}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Surface>

      <section className="product-team-mobile" aria-label="Mobile team schedule">
        <div className="product-segmented product-mobile-mode" aria-label="Team schedule mode">
          <button
            aria-pressed={mobileMode === "day"}
            onClick={() => setMobileMode("day")}
            type="button"
          >
            By Day
          </button>
          <button
            aria-pressed={mobileMode === "employee"}
            onClick={() => setMobileMode("employee")}
            type="button"
          >
            By Employee
          </button>
        </div>

        {mobileMode === "day" ? (
          <>
            <div className="product-date-strip" aria-label="Team date selector">
              {teamSchedule[0]?.cells.map((cell, index) => (
                <button
                  className={dateIndex === index ? "is-active" : undefined}
                  key={cell.workDate}
                  onClick={() => setDateIndex(index)}
                  type="button"
                >
                  <span>{cell.dayLabel}</span>
                  <strong>{cell.dateLabel}</strong>
                </button>
              ))}
            </div>
            <TeamByDay dateIndex={dateIndex} />
          </>
        ) : (
          <>
            <label className="product-inline-select">
              Employee
              <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
                {teamSchedule.map((row) => (
                  <option key={row.employeeId} value={row.employeeId}>
                    {row.employeeName}
                  </option>
                ))}
              </select>
            </label>
            <TeamByEmployee employeeId={employeeId} />
          </>
        )}
      </section>
    </SurfaceFrame>
  );
}

export function ManageScheduleExperience({
  meta,
  period = "2026-08",
}: {
  meta: RouteMeta;
  period?: string;
}) {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([
    "emp-001",
    "emp-002",
    "emp-003",
  ]);
  const [selectedShift, setSelectedShift] = useState<ShiftCode>("S1");
  const [selectedDate, setSelectedDate] = useState("2026-08-14");

  function toggleEmployee(employeeId: string) {
    setSelectedEmployeeIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  }

  return (
    <SurfaceFrame meta={meta} workspace>
      <div className="product-manage-banner">
        <div>
          <Badge showDot tone="warning">
            DRAFT
          </Badge>
          <strong>{period === "2026-08" ? "August 2026" : period} · Revision 04</strong>
          <span>{selectedEmployeeIds.length} selected cells · 2 warnings · 0 blockers</span>
        </div>
        <div className="product-inline-meta">
          <span>Last saved 17:48</span>
          <span>Owner: Yusuf</span>
        </div>
      </div>

      <section className="product-manage-desktop">
        <div className="product-manage-layout">
          <div className="product-manage-main">
            <div className="product-toolbar">
              <div className="product-segmented">
                <button aria-pressed="true" type="button">
                  Assign shift
                </button>
                <button type="button">Mark OFF</button>
                <button type="button">Clear</button>
              </div>
              <Badge tone="info">Bulk mode active</Badge>
            </div>
            <Surface className="product-schedule-matrix-wrap" padding="none">
              <div className="product-schedule-matrix product-schedule-matrix--manage" role="table">
                <div className="product-schedule-row product-schedule-row--head" role="row">
                  <div role="columnheader">Employee</div>
                  {teamSchedule[0]?.cells.map((cell) => (
                    <div key={cell.workDate} role="columnheader">
                      <span>{cell.dayLabel}</span>
                      <strong>{cell.dateLabel}</strong>
                    </div>
                  ))}
                </div>
                {teamSchedule.map((row, rowIndex) => (
                  <div className="product-schedule-row" key={row.employeeId} role="row">
                    <div className="product-schedule-person" role="rowheader">
                      <Avatar initials={row.initials} name={row.employeeName} />
                      <span>{row.employeeName}</span>
                    </div>
                    {row.cells.map((cell, cellIndex) => {
                      const selected = rowIndex < 3 && cellIndex === 3;
                      return (
                        <button
                          className="product-schedule-cell product-schedule-cell--button"
                          data-selected={selected || undefined}
                          key={cell.workDate}
                          role="cell"
                          type="button"
                        >
                          <ShiftBadge shift={shiftKind(cell.shift)} />
                          <small>{cell.start ?? "—"}</small>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Surface>
          </div>
          <aside className="product-validation-panel">
            <Surface padding="md">
              <span className="product-eyebrow">Selected cells</span>
              <h2>{selectedEmployeeIds.length} assignments</h2>
              <div className="product-side-focus">
                <ShiftBadge expanded shift={shiftKind(selectedShift)} />
                <strong>Apply {selectedShift}</strong>
                <span>07:00–15:00 · 14 Aug</span>
              </div>
            </Surface>
            <ValidationAndPublish />
          </aside>
        </div>
      </section>

      <section className="product-manage-mobile" aria-label="Focused mobile schedule editor">
        <Surface padding="md">
          <span className="product-eyebrow">Step 1 · Choose work date</span>
          <label className="product-inline-select">
            Work date
            <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
              {teamSchedule[0]?.cells.map((cell) => (
                <option key={cell.workDate} value={cell.workDate}>
                  {cell.dayLabel}, {cell.dateLabel} Aug
                </option>
              ))}
            </select>
          </label>
        </Surface>

        <Surface padding="md">
          <span className="product-eyebrow">Step 2 · Select employees</span>
          <div className="product-mobile-select-list">
            {employees.map((employee) => (
              <label key={employee.id}>
                <input
                  checked={selectedEmployeeIds.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  type="checkbox"
                />
                <Avatar initials={employee.initials} name={employee.name} />
                <span>
                  <strong>{employee.name}</strong>
                  <small>{employee.role}</small>
                </span>
              </label>
            ))}
          </div>
        </Surface>

        <Surface padding="md">
          <span className="product-eyebrow">Step 3 · Assign work state</span>
          <div className="product-shift-picker">
            {(["S1", "S2", "S3", "OFF"] as const).map((shift) => (
              <button
                aria-pressed={selectedShift === shift}
                key={shift}
                onClick={() => setSelectedShift(shift)}
                type="button"
              >
                <ShiftBadge expanded shift={shift} />
              </button>
            ))}
          </div>
        </Surface>

        <ValidationAndPublish mobile />
      </section>
    </SurfaceFrame>
  );
}

function ValidationAndPublish({ mobile = false }: { mobile?: boolean }) {
  return (
    <Surface className={mobile ? "product-mobile-review" : undefined} padding="md">
      <span className="product-eyebrow">Validation & publish review</span>
      <h2>Ready with warnings</h2>
      <div className="product-finding product-finding--warning">
        <Icon name="warning" size={16} />
        <div>
          <strong>Rest window</strong>
          <p>Dimas has 9h rest before this assignment.</p>
        </div>
      </div>
      <div className="product-note">
        <strong>Revision impact</strong>
        <p>3 assignments changed · 1 employee notified · payroll source becomes dirty.</p>
      </div>
      <button className="product-action product-action--primary product-action--full" type="button">
        Review & publish revision 04
      </button>
    </Surface>
  );
}

function requestTypeLabel(type: RequestFixture["type"]) {
  return type === "OVERTIME" ? "Overtime" : type.charAt(0) + type.slice(1).toLowerCase();
}

export function RequestsExperience({
  meta,
  initialCreate = false,
}: {
  meta: RouteMeta;
  initialCreate?: boolean;
}) {
  const [createMode, setCreateMode] = useState(initialCreate);
  const [type, setType] = useState<RequestFixture["type"]>("LEAVE");
  const [date, setDate] = useState("2026-08-18");
  const [reason, setReason] = useState("");
  const selectedRequest = requests[0]!;

  return (
    <SurfaceFrame
      actions={
        <button
          className="product-action product-action--primary"
          onClick={() => setCreateMode(true)}
          type="button"
        >
          New request
        </button>
      }
      meta={meta}
    >
      {createMode ? (
        <section className="product-request-create">
          <Surface padding="lg">
            <div className="product-section-heading">
              <div>
                <span className="product-eyebrow">Create request</span>
                <h2>Operational schedule request</h2>
              </div>
              <button className="product-action" onClick={() => setCreateMode(false)} type="button">
                Cancel
              </button>
            </div>
            <div className="product-form-grid">
              <label>
                Request type
                <select
                  aria-label="Request type"
                  value={type}
                  onChange={(event) => setType(event.target.value as RequestFixture["type"])}
                >
                  <option value="LEAVE">Leave</option>
                  <option value="SWAP">Swap</option>
                  <option value="REPLACEMENT">Replacement</option>
                  <option value="OVERTIME">Overtime</option>
                  <option value="PERMISSION">Permission</option>
                </select>
              </label>
              <label>
                Work date
                <input
                  aria-label="Request work date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              <label className="product-form-grid__wide">
                Reason
                <textarea
                  aria-label="Request reason"
                  placeholder="Explain the operational reason and useful context"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </label>
            </div>
            <div className="product-request-impact">
              <div>
                <span className="product-eyebrow">Current published assignment</span>
                <ShiftBadge expanded shift="S3" />
                <strong>23:00–07:00 (+1 hari)</strong>
              </div>
              <Icon name="chevron-right" size={20} />
              <div>
                <span className="product-eyebrow">Requested outcome</span>
                <Badge tone="info">{requestTypeLabel(type)}</Badge>
                <strong>{date}</strong>
              </div>
            </div>
            <div className="product-note">
              <strong>Payroll awareness</strong>
              <p>
                Approval determines effective work state. Payroll impact remains explicit and is
                never inferred silently.
              </p>
            </div>
            <div className="product-button-row">
              <button className="product-action" onClick={() => setCreateMode(false)} type="button">
                Save draft
              </button>
              <button
                className="product-action product-action--primary"
                disabled={!reason.trim()}
                type="button"
              >
                Submit request
              </button>
            </div>
          </Surface>
        </section>
      ) : (
        <section className="product-list-detail">
          <div>
            <div className="product-filter-row">
              <button className="is-active" type="button">
                All
              </button>
              <button type="button">Pending</button>
              <button type="button">Approved</button>
              <button type="button">Mine</button>
            </div>
            <Surface className="product-request-list" padding="none">
              {requests.map((request) => (
                <Link
                  className={`product-request-row${request.id === selectedRequest.id ? " is-selected" : ""}`}
                  href={`/schedule/requests/${request.id}`}
                  key={request.id}
                >
                  <div>
                    <Badge tone="neutral">{requestTypeLabel(request.type)}</Badge>
                    <strong>{request.employeeName}</strong>
                    <span>{request.dateLabel}</span>
                  </div>
                  <p>{request.summary}</p>
                  <Badge
                    tone={
                      request.status === "PENDING"
                        ? "warning"
                        : request.status === "APPROVED"
                          ? "success"
                          : "danger"
                    }
                  >
                    {request.status}
                  </Badge>
                </Link>
              ))}
            </Surface>
          </div>
          <aside className="product-detail-panel">
            <Surface padding="lg">
              <span className="product-eyebrow">{selectedRequest.id}</span>
              <h2>Pending request context</h2>
              <p className="product-muted">
                Select a request to review source state, approval history, and operational impact.
              </p>
              <Link className="product-text-link" href={`/schedule/requests/${selectedRequest.id}`}>
                Open full request detail →
              </Link>
            </Surface>
          </aside>
        </section>
      )}
    </SurfaceFrame>
  );
}
