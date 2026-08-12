import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/shell-content";
import type { RouteMeta } from "@/components/layout/navigation";
import { Badge, Icon, ShiftBadge, Surface } from "@/components/ui";
import type { BadgeTone, ShiftKind } from "@/components/ui";

import {
  activityEvents,
  dashboardFixture,
  employees,
  mySchedule,
  notificationsFixture,
  payrollRows,
  reportMetrics,
  requests,
  teamSchedule,
  type PayrollRowFixture,
  type RequestFixture,
  type ScheduleCellFixture,
  type ShiftCode,
} from "./fixtures";

const money = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const compactMoney = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 1,
});

function toneForStatus(status: string): BadgeTone {
  if (["LOCKED", "APPROVED", "ACTIVE", "RESOLVED"].includes(status)) return "success";
  if (["PENDING", "DIRTY", "WARNING"].includes(status)) return "warning";
  if (["REJECTED", "FAILED", "CRITICAL"].includes(status)) return "danger";
  if (["CALCULATED", "UNREAD", "NOTICE"].includes(status)) return "info";
  return "neutral";
}

function shiftKind(shift: ShiftCode): ShiftKind {
  return shift;
}

function Avatar({ initials, name }: { initials: string; name: string }) {
  return (
    <span aria-label={name} className="product-avatar" title={name}>
      {initials}
    </span>
  );
}

function HeaderAction({ children, href, primary = false }: { children: ReactNode; href: string; primary?: boolean }) {
  return (
    <Link className={`product-action${primary ? " product-action--primary" : ""}`} href={href}>
      {children}
    </Link>
  );
}

function ProductPage({
  actions,
  children,
  meta,
  workspace = false,
}: {
  actions?: ReactNode;
  children: ReactNode;
  meta: RouteMeta;
  workspace?: boolean;
}) {
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

function SectionHeading({
  action,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="product-section-heading">
      <div>
        {eyebrow ? <span className="product-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {action ? <div className="product-section-heading__action">{action}</div> : null}
    </div>
  );
}

function Stat({ detail, label, value }: { detail?: string; label: string; value: string }) {
  return (
    <div className="product-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function ShiftLine({ item }: { item: ScheduleCellFixture }) {
  return (
    <article className="product-agenda-row" id={item.workDate === "2026-08-13" ? "today" : undefined}>
      <div className="product-agenda-row__date">
        <span>{item.dayLabel}</span>
        <strong>{item.dateLabel}</strong>
      </div>
      <div className="product-agenda-row__main">
        <div className="product-row-title">
          <ShiftBadge expanded shift={shiftKind(item.shift)} />
          <strong>{item.start ? `${item.start}–${item.end}` : item.shift === "OFF" ? "Rest day" : "No shift time"}</strong>
        </div>
        <p>{item.note ?? (item.state === "PLANNED" ? "Published planned assignment" : "Effective assignment")}</p>
      </div>
      <Badge tone={item.state === "EFFECTIVE" ? "success" : "neutral"}>{item.state}</Badge>
    </article>
  );
}

function DashboardSurface({ meta }: { meta: RouteMeta }) {
  return (
    <ProductPage
      actions={
        <>
          <HeaderAction href="/notifications">Notifications</HeaderAction>
          <HeaderAction href="/schedule/me" primary>
            Open my schedule
          </HeaderAction>
        </>
      }
      meta={meta}
    >
      <section className="product-dashboard-grid" aria-label="Dashboard operational summary">
        <Surface className="product-shift-hero" elevation="raised" padding="lg">
          <div className="product-shift-hero__top">
            <div>
              <span className="product-eyebrow">Your shift today</span>
              <h2>{dashboardFixture.today.dateLabel}</h2>
            </div>
            <ShiftBadge expanded shift={dashboardFixture.today.shift} />
          </div>
          <div className="product-shift-hero__time">
            <strong>
              {dashboardFixture.today.start}–{dashboardFixture.today.end}
            </strong>
            <span>{dashboardFixture.today.location}</span>
          </div>
          <div className="product-inline-meta">
            <span>
              <Icon name="clock" size={16} /> Handover {dashboardFixture.today.handoverAt}
            </span>
            <span>
              <Icon name="calendar" size={16} /> Next {dashboardFixture.nextShift.dateLabel}
            </span>
          </div>
        </Surface>

        <Surface className="product-on-duty" padding="lg">
          <SectionHeading eyebrow="Live team context" title="Now on duty" />
          <div className="product-person-stack">
            {dashboardFixture.nowOnDuty.map((person) => (
              <div className="product-person-row" key={person.employeeId}>
                <Avatar initials={person.initials} name={person.name} />
                <div>
                  <strong>{person.name}</strong>
                  <span>NOC floor · active now</span>
                </div>
                <ShiftBadge shift={person.shift} />
              </div>
            ))}
          </div>
          <Link className="product-text-link" href="/schedule/team">
            View effective team coverage →
          </Link>
        </Surface>
      </section>

      <section>
        <SectionHeading eyebrow="Needs attention" title="Operational attention" />
        <div className="product-attention-grid">
          {dashboardFixture.attention.map((item) => (
            <Surface className="product-attention-card" key={item.label} padding="md">
              <Badge showDot tone={item.tone}>
                {item.label}
              </Badge>
              <strong>{item.value}</strong>
              <span>{item.detail}</span>
            </Surface>
          ))}
        </div>
      </section>

      <section className="product-dashboard-lower">
        <div>
          <SectionHeading eyebrow="August 2026" title="Monthly shift summary" />
          <Surface className="product-summary-strip" padding="none">
            {dashboardFixture.monthlySummary.map((item) => (
              <Stat detail={item.context} key={item.label} label={item.label} value={item.value} />
            ))}
          </Surface>
        </div>
        <div>
          <SectionHeading
            action={<Link className="product-text-link" href="/activity">View history</Link>}
            eyebrow="Latest updates"
            title="Recent changes"
          />
          <Surface className="product-change-list" padding="none">
            {dashboardFixture.changes.map((change) => (
              <div className="product-change-row" key={change.title}>
                <span className="product-change-row__icon">
                  <Icon name="history" size={16} />
                </span>
                <div>
                  <strong>{change.title}</strong>
                  <p>{change.detail}</p>
                </div>
                <time>{change.time}</time>
              </div>
            ))}
          </Surface>
        </div>
      </section>
    </ProductPage>
  );
}

function ScheduleHubSurface({ meta }: { meta: RouteMeta }) {
  const cards = [
    ["My Schedule", "Personal agenda, week, month, and change context.", "/schedule/me", "calendar"],
    ["Team Schedule", "Read team coverage by day or employee.", "/schedule/team", "users"],
    ["Manage Schedule", "Draft, validate, bulk-edit, and publish.", "/schedule/manage", "panel-left"],
    ["Requests", "Leave, swap, replacement, overtime, and permission.", "/schedule/requests", "file-text"],
  ] as const;

  return (
    <ProductPage meta={meta}>
      <section className="product-hub-grid">
        {cards.map(([title, description, href, icon]) => (
          <Link className="product-hub-card" href={href} key={href}>
            <span className="product-hub-card__icon">
              <Icon name={icon} size={20} />
            </span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <Icon name="chevron-right" size={18} />
          </Link>
        ))}
      </section>
    </ProductPage>
  );
}

function MyScheduleSurface({ meta }: { meta: RouteMeta }) {
  return (
    <ProductPage
      actions={
        <>
          <HeaderAction href="#today">Jump to today</HeaderAction>
          <HeaderAction href="/schedule/requests" primary>
            Request change
          </HeaderAction>
        </>
      }
      meta={meta}
      workspace
    >
      <div className="product-toolbar">
        <div className="product-segmented" aria-label="Schedule view">
          <button type="button">Month</button>
          <button type="button">Week</button>
          <button aria-pressed="true" type="button">Agenda</button>
        </div>
        <div className="product-period-control">
          <button aria-label="Previous period" type="button">‹</button>
          <strong>August 2026</strong>
          <button aria-label="Next period" type="button">›</button>
        </div>
      </div>

      <div className="product-date-strip" aria-label="Compact schedule date strip">
        {mySchedule.map((item, index) => (
          <a className={index === 0 ? "is-active" : undefined} href={`#${item.workDate}`} key={item.workDate}>
            <span>{item.dayLabel.slice(0, 3)}</span>
            <strong>{item.dateLabel}</strong>
            <i data-shift={item.shift} />
          </a>
        ))}
      </div>

      <section className="product-two-column">
        <div>
          <SectionHeading eyebrow="Published schedule" title="Upcoming assignments" />
          <Surface className="product-agenda" padding="none">
            {mySchedule.map((item) => <ShiftLine item={item} key={item.workDate} />)}
          </Surface>
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
            <p className="product-muted">Latest published correction changed 17 Aug from S2 to S3.</p>
            <Link className="product-text-link" href="/activity">Open change history →</Link>
          </Surface>
        </aside>
      </section>
    </ProductPage>
  );
}

function TeamScheduleSurface({ meta }: { meta: RouteMeta }) {
  return (
    <ProductPage
      actions={<HeaderAction href="/schedule/manage">Open manage workspace</HeaderAction>}
      meta={meta}
      workspace
    >
      <div className="product-toolbar">
        <div className="product-segmented product-mobile-mode" aria-label="Team schedule mode">
          <button aria-pressed="true" type="button">By Day</button>
          <button type="button">By Employee</button>
        </div>
        <div className="product-inline-meta">
          <Badge tone="success">Effective through 12 Aug</Badge>
          <Badge tone="neutral">Planned from 13 Aug</Badge>
        </div>
      </div>

      <Surface className="product-schedule-matrix-wrap" padding="none">
        <div className="product-schedule-matrix" role="table" aria-label="Team schedule fixture matrix">
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
                <div className="product-schedule-cell" data-state={cell.state} key={cell.workDate} role="cell">
                  <ShiftBadge shift={shiftKind(cell.shift)} />
                  <small>{cell.start ?? cell.note ?? "—"}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Surface>

      <div className="product-mobile-schedule-list">
        {teamSchedule[0]?.cells.slice(0, 4).map((date, dateIndex) => (
          <Surface key={date.workDate} padding="md">
            <SectionHeading eyebrow={date.dayLabel} title={`${date.dateLabel} August`} />
            <div className="product-person-stack">
              {teamSchedule.slice(0, 4).map((row) => {
                const cell = row.cells[dateIndex]!;
                return (
                  <div className="product-person-row" key={row.employeeId}>
                    <Avatar initials={row.initials} name={row.employeeName} />
                    <div><strong>{row.employeeName}</strong><span>{cell.start ? `${cell.start}–${cell.end}` : cell.note ?? "No active shift"}</span></div>
                    <ShiftBadge shift={shiftKind(cell.shift)} />
                  </div>
                );
              })}
            </div>
          </Surface>
        ))}
      </div>
    </ProductPage>
  );
}

function ManageScheduleSurface({ meta }: { meta: RouteMeta }) {
  return (
    <ProductPage
      actions={
        <>
          <HeaderAction href="/schedule/team">Preview published</HeaderAction>
          <HeaderAction href="#publish-review" primary>Review & publish</HeaderAction>
        </>
      }
      meta={meta}
      workspace
    >
      <div className="product-manage-banner">
        <div>
          <Badge showDot tone="warning">DRAFT</Badge>
          <strong>August 2026 · Revision 04</strong>
          <span>3 selected cells · 2 warnings · 0 blockers</span>
        </div>
        <div className="product-inline-meta"><span>Last saved 17:48</span><span>Owner: Yusuf</span></div>
      </div>

      <section className="product-manage-layout">
        <div className="product-manage-main">
          <div className="product-toolbar">
            <div className="product-segmented"><button aria-pressed="true" type="button">Assign shift</button><button type="button">Mark OFF</button><button type="button">Clear</button></div>
            <Badge tone="info">Bulk mode active</Badge>
          </div>
          <Surface className="product-schedule-matrix-wrap" padding="none">
            <div className="product-schedule-matrix product-schedule-matrix--manage" role="table">
              <div className="product-schedule-row product-schedule-row--head" role="row">
                <div role="columnheader">Employee</div>
                {teamSchedule[0]?.cells.map((cell) => <div key={cell.workDate} role="columnheader"><span>{cell.dayLabel}</span><strong>{cell.dateLabel}</strong></div>)}
              </div>
              {teamSchedule.map((row, rowIndex) => (
                <div className="product-schedule-row" key={row.employeeId} role="row">
                  <div className="product-schedule-person" role="rowheader"><Avatar initials={row.initials} name={row.employeeName} /><span>{row.employeeName}</span></div>
                  {row.cells.map((cell, cellIndex) => {
                    const selected = rowIndex < 3 && cellIndex === 3;
                    return <button className="product-schedule-cell product-schedule-cell--button" data-selected={selected || undefined} key={cell.workDate} role="cell" type="button"><ShiftBadge shift={shiftKind(cell.shift)} /><small>{cell.start ?? "—"}</small></button>;
                  })}
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <aside className="product-validation-panel">
          <Surface padding="md">
            <SectionHeading eyebrow="Selected cells" title="3 assignments" />
            <div className="product-side-focus"><ShiftBadge expanded shift="S1" /><strong>Apply Shift 1</strong><span>07:00–15:00 · 14 Aug</span></div>
          </Surface>
          <Surface padding="md">
            <SectionHeading eyebrow="Validation" title="Ready with warnings" />
            <div className="product-finding product-finding--warning"><Icon name="warning" size={16} /><div><strong>Rest window</strong><p>Dimas has 9h rest before this assignment.</p></div></div>
            <div className="product-finding"><Icon name="info" size={16} /><div><strong>Coverage</strong><p>All required S1 slots remain covered.</p></div></div>
          </Surface>
          <Surface id="publish-review" padding="md">
            <SectionHeading eyebrow="Publish review" title="Revision impact" />
            <ul className="product-compact-list"><li>3 assignments changed</li><li>1 employee notified</li><li>Payroll source will become dirty</li></ul>
            <button className="product-action product-action--primary product-action--full" type="button">Publish revision 04</button>
          </Surface>
        </aside>
      </section>
    </ProductPage>
  );
}

function requestTypeLabel(type: RequestFixture["type"]) {
  return type === "OVERTIME" ? "Overtime" : type.charAt(0) + type.slice(1).toLowerCase();
}

function RequestsSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const detailId = pathname.split("/")[3];
  const selected = requests.find((request) => request.id === detailId) ?? requests[0]!;
  const detailMode = Boolean(detailId);

  return (
    <ProductPage
      actions={<HeaderAction href="/schedule/requests?create=1" primary>New request</HeaderAction>}
      meta={meta}
    >
      <section className="product-list-detail">
        <div>
          <div className="product-filter-row"><button className="is-active" type="button">All</button><button type="button">Pending</button><button type="button">Approved</button><button type="button">Mine</button></div>
          <Surface className="product-request-list" padding="none">
            {requests.map((request) => (
              <Link className={`product-request-row${request.id === selected.id ? " is-selected" : ""}`} href={`/schedule/requests/${request.id}`} key={request.id}>
                <div><Badge tone="neutral">{requestTypeLabel(request.type)}</Badge><strong>{request.employeeName}</strong><span>{request.dateLabel}</span></div>
                <p>{request.summary}</p>
                <Badge tone={toneForStatus(request.status)}>{request.status}</Badge>
              </Link>
            ))}
          </Surface>
        </div>
        <aside className={detailMode ? "product-detail-panel product-detail-panel--active" : "product-detail-panel"}>
          <Surface padding="lg">
            <div className="product-detail-head"><div><span className="product-eyebrow">{selected.id}</span><h2>{requestTypeLabel(selected.type)} request</h2></div><Badge tone={toneForStatus(selected.status)}>{selected.status}</Badge></div>
            <dl className="product-definition-grid"><div><dt>Employee</dt><dd>{selected.employeeName}</dd></div><div><dt>Date</dt><dd>{selected.dateLabel}</dd></div><div><dt>Source state</dt><dd>Published schedule</dd></div><div><dt>Payroll impact</dt><dd>Explicit on approval</dd></div></dl>
            <div className="product-note"><strong>Reason</strong><p>{selected.summary}</p></div>
            <div className="product-approval-steps"><span className="is-done">Submitted</span><span className={selected.status !== "PENDING" ? "is-done" : "is-current"}>Supervisor decision</span><span>Effective state</span></div>
            {selected.status === "PENDING" ? <div className="product-button-row"><button className="product-action" type="button">Reject</button><button className="product-action product-action--primary" type="button">Approve request</button></div> : null}
          </Surface>
        </aside>
      </section>
    </ProductPage>
  );
}

function EmployeeListSurface({ meta }: { meta: RouteMeta }) {
  return (
    <ProductPage actions={<HeaderAction href="/settings/access">Manage access</HeaderAction>} meta={meta}>
      <div className="product-toolbar"><label className="product-search"><Icon name="search" size={16} /><input aria-label="Search employees" placeholder="Search employee" /></label><Badge tone="neutral">{employees.length} active people</Badge></div>
      <Surface className="product-directory" padding="none">
        {employees.map((employee) => (
          <Link className="product-directory-row" href={`/employees/${employee.id}`} key={employee.id}>
            <Avatar initials={employee.initials} name={employee.name} />
            <div><strong>{employee.name}</strong><span>{employee.role}</span></div>
            <Badge tone="success">{employee.status}</Badge>
            <div className="product-directory-row__meta"><span>Aug shifts 20</span><span>S2 6 · S3 5</span></div>
            <Icon name="chevron-right" size={18} />
          </Link>
        ))}
      </Surface>
    </ProductPage>
  );
}

function EmployeeDetailSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const employeeId = pathname.split("/")[2] ?? "emp-001";
  const employee = employees.find((item) => item.id === employeeId) ?? employees[0]!;
  const activeTab = pathname.endsWith("/schedule") ? "schedule" : pathname.endsWith("/payroll") ? "payroll" : pathname.endsWith("/history") ? "history" : "overview";

  return (
    <ProductPage meta={meta}>
      <Surface className="product-profile-hero" padding="lg">
        <Avatar initials={employee.initials} name={employee.name} />
        <div><span className="product-eyebrow">Employee profile</span><h2>{employee.name}</h2><p>{employee.role} · Internal NOC</p></div>
        <Badge tone="success">ACTIVE</Badge>
      </Surface>
      <nav className="product-tabs" aria-label="Employee detail tabs">
        <Link aria-current={activeTab === "overview" ? "page" : undefined} href={`/employees/${employee.id}`}>Overview</Link>
        <Link aria-current={activeTab === "schedule" ? "page" : undefined} href={`/employees/${employee.id}/schedule`}>Schedule</Link>
        <Link aria-current={activeTab === "payroll" ? "page" : undefined} href={`/employees/${employee.id}/payroll`}>Payroll</Link>
        <Link aria-current={activeTab === "history" ? "page" : undefined} href={`/employees/${employee.id}/history`}>History</Link>
      </nav>
      {activeTab === "overview" ? <div className="product-summary-grid"><Surface padding="md"><SectionHeading eyebrow="August" title="Operational summary" /><div className="product-summary-strip product-summary-strip--embedded"><Stat label="Assignments" value="20"/><Stat label="S2" value="6"/><Stat label="S3" value="5"/></div></Surface><Surface padding="md"><SectionHeading eyebrow="Next" title="Upcoming shift"/><div className="product-side-focus"><ShiftBadge expanded shift="S2"/><strong>15:00–23:00</strong><span>14 Aug · Main NOC Floor</span></div></Surface></div> : null}
      {activeTab === "schedule" ? <Surface className="product-agenda" padding="none">{mySchedule.map((item) => <ShiftLine item={item} key={item.workDate}/>)}</Surface> : null}
      {activeTab === "payroll" ? <PayrollBreakdown employee={payrollRows.find((row) => row.employeeId === employee.id) ?? payrollRows[0]!}/> : null}
      {activeTab === "history" ? <ActivityList compact/> : null}
    </ProductPage>
  );
}

function payrollTotal() {
  return payrollRows.reduce((sum, row) => sum + row.takeHomePay, 0);
}

function PayrollTable({ rows = payrollRows }: { rows?: PayrollRowFixture[] }) {
  return (
    <Surface className="product-table-wrap" padding="none">
      <table className="product-table">
        <thead><tr><th>Employee</th><th>Base salary</th><th>S2</th><th>S3</th><th>Adjustments</th><th>Calculated THP</th><th>Status</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.employeeId}><td><Link href={`/payroll/2026-08/${row.employeeId}`}>{row.employeeName}</Link></td><td>{money.format(row.baseSalary)}</td><td>{row.s2Count} · {money.format(row.s2Amount)}</td><td>{row.s3Count} · {money.format(row.s3Amount)}</td><td>{money.format(row.adjustments)}</td><td><strong>{money.format(row.takeHomePay)}</strong></td><td><Badge tone={toneForStatus(row.status)}>{row.status}</Badge></td></tr>)}</tbody>
      </table>
    </Surface>
  );
}

function PayrollBreakdown({ employee }: { employee: PayrollRowFixture }) {
  return (
    <section className="product-payroll-detail">
      <Surface className="product-payroll-total" elevation="raised" padding="lg"><span>Calculated take-home pay</span><strong>{money.format(employee.takeHomePay)}</strong><Badge tone={toneForStatus(employee.status)}>{employee.status}</Badge></Surface>
      <Surface padding="none"><div className="product-breakdown-row"><span>Base salary</span><strong>{money.format(employee.baseSalary)}</strong></div><div className="product-breakdown-row"><span>Shift 2 incentive · {employee.s2Count} shifts</span><strong>{money.format(employee.s2Amount)}</strong></div><div className="product-breakdown-row"><span>Shift 3 incentive · {employee.s3Count} shifts</span><strong>{money.format(employee.s3Amount)}</strong></div><div className="product-breakdown-row"><span>Manual adjustments</span><strong>{money.format(employee.adjustments)}</strong></div><div className="product-breakdown-row product-breakdown-row--total"><span>Calculated THP</span><strong>{money.format(employee.takeHomePay)}</strong></div></Surface>
      <Surface padding="md"><SectionHeading eyebrow="Source traceability" title="Why this number?"/><div className="product-source-line"><Icon name="calendar" size={16}/><div><strong>Published schedule · August 2026</strong><span>S2/S3 count uses work-date eligibility from revision 04.</span></div></div><div className="product-source-line"><Icon name="history" size={16}/><div><strong>Compensation version effective 1 Aug</strong><span>Historical rates remain attached to this calculation.</span></div></div></Surface>
    </section>
  );
}

function PayrollSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 3) {
    const employee = payrollRows.find((row) => row.employeeId === segments[2]) ?? payrollRows[0]!;
    return <ProductPage actions={<HeaderAction href="/payroll/2026-08">Back to monthly payroll</HeaderAction>} meta={meta} workspace><PayrollBreakdown employee={employee}/></ProductPage>;
  }

  const isMonthly = segments.length === 2;
  return (
    <ProductPage actions={<HeaderAction href="/reports/payroll">Open payroll report</HeaderAction>} meta={meta} workspace>
      <div className="product-payroll-period"><div><span className="product-eyebrow">August 2026</span><h2>{isMonthly ? "Monthly payroll review" : "Current payroll period"}</h2></div><div className="product-inline-meta"><Badge showDot tone="warning">DIRTY</Badge><span>Source changed 16:55</span></div></div>
      <div className="product-summary-strip product-summary-strip--cards"><Stat label="Total calculated THP" value={compactMoney.format(payrollTotal())} detail="5 employee fixture rows"/><Stat label="S2 incentive" value={money.format(payrollRows.reduce((sum,row)=>sum+row.s2Amount,0))} detail="31 eligible shifts"/><Stat label="S3 incentive" value={money.format(payrollRows.reduce((sum,row)=>sum+row.s3Amount,0))} detail="27 eligible shifts"/><Stat label="Adjustments" value={money.format(payrollRows.reduce((sum,row)=>sum+row.adjustments,0))} detail="manual, reason required"/></div>
      <SectionHeading eyebrow="Source-aware calculation" title="Employee payroll" />
      <PayrollTable/>
    </ProductPage>
  );
}

function ReportBars() {
  const values = [86, 92, 74, 98, 88, 95, 79];
  return <div className="product-chart" aria-label="Coverage chart fixture">{values.map((value,index)=><div className="product-chart__column" key={index}><div style={{height:`${value}%`}}/><span>{11+index} Aug</span></div>)}</div>;
}

function ReportsSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const reportName = pathname.endsWith("/payroll") ? "Payroll reconciliation" : pathname.endsWith("/employees") ? "Employee monthly summary" : pathname.endsWith("/schedule") ? "Schedule coverage & fairness" : "Operational reporting overview";
  return (
    <ProductPage actions={<><HeaderAction href="#filters">Filters</HeaderAction><HeaderAction href="#export" primary>Export</HeaderAction></>} meta={meta} workspace>
      <div className="product-filter-bar" id="filters"><label>Period<select defaultValue="2026-08"><option value="2026-08">August 2026</option></select></label><label>View<select defaultValue="effective"><option value="effective">Effective state</option><option value="planned">Planned state</option></select></label><label>Employee<select defaultValue="all"><option value="all">All employees</option></select></label><button type="button">Reset</button></div>
      <div className="product-summary-strip product-summary-strip--cards">{reportMetrics.map((metric)=><Stat detail={metric.delta} key={metric.label} label={metric.label} value={metric.value}/>)}</div>
      <section className="product-report-layout"><Surface padding="lg"><SectionHeading eyebrow="August 11–17" title={reportName}/><ReportBars/></Surface><Surface padding="md"><SectionHeading eyebrow="Interpretation" title="Decision support"/><p className="product-muted">Fairness is contextual guidance, not an automatic employee judgment. Exact values remain available beside every visualization.</p><div className="product-finding product-finding--warning"><Icon name="warning" size={16}/><div><strong>18 Aug · S3 gap</strong><p>1 required slot remains uncovered.</p></div></div></Surface></section>
      <SectionHeading eyebrow="Exact values" title="Coverage by date"/>
      <Surface className="product-table-wrap" padding="none"><table className="product-table"><thead><tr><th>Work date</th><th>Shift</th><th>Required</th><th>Planned</th><th>Effective</th><th>Coverage</th></tr></thead><tbody>{[11,12,13,14,15].map((date,index)=><tr key={date}><td>{date} Aug 2026</td><td>S{(index%3)+1}</td><td>3</td><td>3</td><td>{index===4?2:3}</td><td><Badge tone={index===4?"warning":"success"}>{index===4?"66.7%":"100%"}</Badge></td></tr>)}</tbody></table></Surface>
      <Surface className="product-export-panel" id="export" padding="md"><div><strong>Export current report context</strong><span>Includes generated time, Asia/Jakarta timezone, filters, report identity, and source revision metadata.</span></div><div className="product-button-row"><button className="product-action" type="button">CSV</button><button className="product-action product-action--primary" type="button">XLSX</button></div></Surface>
    </ProductPage>
  );
}

function ActivityList({ compact = false }: { compact?: boolean }) {
  return <Surface className="product-activity-list" padding="none">{activityEvents.map((event)=><div className="product-activity-row" key={event.id}><span className="product-activity-marker"/><div><div className="product-row-title"><strong>{event.action}</strong><Badge tone={toneForStatus(event.severity)}>{event.severity}</Badge></div><p>{event.actor} · {event.resource}</p>{!compact?<span>Reason: {event.reason}</span>:null}</div><time>{event.time}</time></div>)}</Surface>;
}

function ActivitySurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const detailMode = pathname.split("/").filter(Boolean).length > 1;
  return <ProductPage meta={meta} workspace><div className="product-toolbar"><label className="product-search"><Icon name="search" size={16}/><input aria-label="Search activity" placeholder="Actor, resource, event ID"/></label><div className="product-inline-meta"><Badge tone="neutral">Business history</Badge><Badge tone="neutral">Audit evidence</Badge></div></div><section className="product-list-detail"><div><ActivityList/></div><aside className={detailMode?"product-detail-panel product-detail-panel--active":"product-detail-panel"}><Surface padding="lg"><span className="product-eyebrow">AUD-8041</span><h2>Published schedule correction</h2><dl className="product-definition-grid"><div><dt>Actor</dt><dd>Yusuf Ramadhan</dd></div><div><dt>Recorded at</dt><dd>13 Aug · 17:22</dd></div><div><dt>Effective date</dt><dd>17 Aug 2026</dd></div><div><dt>Correlation</dt><dd>COR-88F2</dd></div></dl><div className="product-diff"><div><span>Before</span><strong>S2 · 15:00–23:00</strong></div><Icon name="chevron-right" size={20}/><div><span>After</span><strong>S3 · 23:00–07:00</strong></div></div><div className="product-note"><strong>Reason</strong><p>Holiday coverage adjustment.</p></div></Surface></aside></section></ProductPage>;
}

const settingsSections = [
  ["general","General","Locale, timezone, and workspace identity"],
  ["shifts","Shifts","Shift codes, times, and effective versions"],
  ["payroll","Payroll","Calculation and lifecycle parameters"],
  ["compensation","Compensation","Salary and shift incentive versions"],
  ["holidays","Holidays","Indonesia holiday and operational context"],
  ["access","Access","Role, capability, scope, and account access"],
  ["notifications","Notifications","Awareness preferences and grouping"],
] as const;

function SettingsContent({ section }: { section: string }) {
  if (section === "shifts") return <div className="product-setting-stack">{[["Shift 1","S1","07:00","15:00","Rp0"],["Shift 2","S2","15:00","23:00","Rp50.000"],["Shift 3","S3","23:00","07:00","Rp75.000"]].map(([name,code,start,end,incentive])=><Surface className="product-setting-row" key={code} padding="md"><ShiftBadge shift={code as ShiftKind}/><div><strong>{name}</strong><span>{start}–{end}</span></div><div><span>Current incentive</span><strong>{incentive}</strong></div><Badge tone="success">Effective 1 Aug</Badge></Surface>)}</div>;
  if (section === "compensation") return <Surface padding="lg"><SectionHeading eyebrow="Effective-dated configuration" title="Compensation versions"/><div className="product-form-grid"><label>Employee<select defaultValue="emp-001"><option value="emp-001">Raka Pratama</option></select></label><label>Base salary<input defaultValue="7500000"/></label><label>Effective from<input defaultValue="2026-08-01" type="date"/></label><label>Change reason<input defaultValue="Annual compensation review"/></label></div><div className="product-note"><strong>Historical impact</strong><p>New effective versions change future calculations only. Existing historical references remain stable.</p></div></Surface>;
  if (section === "access") return <Surface className="product-table-wrap" padding="none"><table className="product-table"><thead><tr><th>User</th><th>Role</th><th>Schedule</th><th>Payroll</th><th>Access</th></tr></thead><tbody><tr><td>Yusuf Ramadhan</td><td>Administrator</td><td>Manage</td><td>Finalize + Lock</td><td><Badge tone="success">Admin</Badge></td></tr><tr><td>Nadia Putri</td><td>Scheduler/Supervisor</td><td>Manage + Publish</td><td>Read</td><td><Badge tone="info">Scoped</Badge></td></tr><tr><td>Raka Pratama</td><td>NOC Member</td><td>Read + Request</td><td>Read</td><td><Badge tone="neutral">Member</Badge></td></tr></tbody></table></Surface>;
  if (section === "holidays") return <Surface padding="none"><div className="product-setting-row"><div className="product-date-block"><strong>17</strong><span>Aug</span></div><div><strong>Hari Kemerdekaan Republik Indonesia</strong><span>Holiday does not automatically imply OFF; staffing requirement remains explicit.</span></div><Badge tone="info">National</Badge></div><div className="product-setting-row"><div className="product-date-block"><strong>25</strong><span>Dec</span></div><div><strong>Holiday fixture</strong><span>Operational requirement to be configured per shift.</span></div><Badge tone="neutral">Future</Badge></div></Surface>;
  if (section === "notifications") return <Surface padding="lg"><SectionHeading eyebrow="Awareness preferences" title="Notification behavior"/><div className="product-setting-toggle"><div><strong>Schedule changes</strong><span>Published correction, swap result, replacement.</span></div><input aria-label="Schedule change notifications" defaultChecked type="checkbox"/></div><div className="product-setting-toggle"><div><strong>Payroll attention</strong><span>Dirty state, finalize readiness, lock completion.</span></div><input aria-label="Payroll notifications" defaultChecked type="checkbox"/></div><div className="product-setting-toggle"><div><strong>Resolved operational warnings</strong><span>Keep resolved items grouped instead of deleting them.</span></div><input aria-label="Resolved warning notifications" defaultChecked type="checkbox"/></div></Surface>;
  return <Surface padding="lg"><SectionHeading eyebrow="Workspace configuration" title={section === "payroll"?"Payroll policy":"General settings"}/><div className="product-form-grid"><label>Workspace name<input defaultValue="NOCScheduler"/></label><label>Timezone<select defaultValue="Asia/Jakarta"><option>Asia/Jakarta</option></select></label><label>Locale<select defaultValue="id-ID"><option value="id-ID">Indonesia</option></select></label><label>Currency<select defaultValue="IDR"><option>IDR</option></select></label></div><div className="product-button-row"><button className="product-action" type="button">Discard</button><button className="product-action product-action--primary" type="button">Save changes</button></div></Surface>;
}

function SettingsSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  const section = pathname.split("/")[2] ?? "general";
  return <ProductPage meta={meta}><section className="product-settings-layout"><nav className="product-settings-nav" aria-label="Settings sections">{settingsSections.map(([id,label,description])=><Link aria-current={section===id?"page":undefined} href={`/settings/${id}`} key={id}><strong>{label}</strong><span>{description}</span></Link>)}</nav><div><SettingsContent section={section}/></div></section></ProductPage>;
}

function NotificationsSurface({ meta }: { meta: RouteMeta }) {
  return <ProductPage actions={<HeaderAction href="/settings/notifications">Preferences</HeaderAction>} meta={meta}><div className="product-toolbar"><div className="product-segmented"><button aria-pressed="true" type="button">All</button><button type="button">Unread</button><button type="button">Resolved</button></div><button className="product-action" type="button">Mark all read</button></div><Surface className="product-notification-list" padding="none">{notificationsFixture.map((notification)=><Link className="product-notification-row" data-state={notification.state} href={notification.href} key={notification.id}><span className="product-notification-icon"><Icon name={notification.group==="Payroll"?"wallet":notification.group==="Schedule"?"calendar":notification.group==="Request"?"file-text":"warning"} size={18}/></span><div><div className="product-row-title"><strong>{notification.title}</strong><Badge tone={toneForStatus(notification.state)}>{notification.state}</Badge></div><p>{notification.detail}</p><span>{notification.group} · {notification.time}</span></div><Icon name="chevron-right" size={18}/></Link>)}</Surface></ProductPage>;
}

function ProfileSurface({ meta }: { meta: RouteMeta }) {
  const employee=employees[0]!;
  return <ProductPage meta={meta}><Surface className="product-profile-hero" padding="lg"><Avatar initials={employee.initials} name={employee.name}/><div><span className="product-eyebrow">Signed-in fixture</span><h2>{employee.name}</h2><p>raka.pratama@internal.example · NOC Member</p></div><Badge tone="success">Active</Badge></Surface><div className="product-summary-grid"><Surface padding="lg"><SectionHeading eyebrow="Account" title="Profile details"/><dl className="product-definition-grid"><div><dt>Employee ID</dt><dd>{employee.id}</dd></div><div><dt>Role</dt><dd>NOC Member</dd></div><div><dt>Timezone</dt><dd>Asia/Jakarta</dd></div><div><dt>Theme</dt><dd>Stored browser preference</dd></div></dl></Surface><Surface padding="lg"><SectionHeading eyebrow="Security boundary" title="Authentication arrives in F05"/><p className="product-muted">This profile is a typed frontend fixture only. Session, password, revoke, and step-up controls remain intentionally deferred.</p></Surface></div></ProductPage>;
}

export function ProductSurface({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  if (pathname === "/dashboard") return <DashboardSurface meta={meta}/>;
  if (pathname === "/schedule") return <ScheduleHubSurface meta={meta}/>;
  if (pathname === "/schedule/me") return <MyScheduleSurface meta={meta}/>;
  if (pathname === "/schedule/team") return <TeamScheduleSurface meta={meta}/>;
  if (pathname === "/schedule/manage" || pathname.startsWith("/schedule/manage/")) return <ManageScheduleSurface meta={meta}/>;
  if (pathname === "/schedule/requests" || pathname.startsWith("/schedule/requests/")) return <RequestsSurface meta={meta} pathname={pathname}/>;
  if (pathname === "/employees") return <EmployeeListSurface meta={meta}/>;
  if (pathname.startsWith("/employees/")) return <EmployeeDetailSurface meta={meta} pathname={pathname}/>;
  if (pathname === "/payroll" || pathname.startsWith("/payroll/")) return <PayrollSurface meta={meta} pathname={pathname}/>;
  if (pathname === "/reports" || pathname.startsWith("/reports/")) return <ReportsSurface meta={meta} pathname={pathname}/>;
  if (pathname === "/activity" || pathname.startsWith("/activity/")) return <ActivitySurface meta={meta} pathname={pathname}/>;
  if (pathname === "/settings" || pathname.startsWith("/settings/")) return <SettingsSurface meta={meta} pathname={pathname}/>;
  if (pathname === "/notifications") return <NotificationsSurface meta={meta}/>;
  if (pathname === "/profile") return <ProfileSurface meta={meta}/>;

  return <ProductPage meta={meta}><Surface padding="lg"><SectionHeading eyebrow="Fixture surface" title={meta.title}/><p className="product-muted">Canonical route is available and shares the F03 product-surface system.</p></Surface></ProductPage>;
}
