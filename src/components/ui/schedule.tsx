import type { ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

import { ShiftBadge, type ShiftKind } from "./badge";
import { Icon } from "./icon";

type CalendarDayProps = {
  dayName: string;
  dateLabel: string;
  today?: boolean;
  selected?: boolean;
  weekend?: boolean;
  holiday?: boolean;
  className?: string;
};

export function CalendarDay({
  className,
  dateLabel,
  dayName,
  holiday,
  selected,
  today,
  weekend,
}: CalendarDayProps) {
  return (
    <div
      aria-current={today ? "date" : undefined}
      aria-selected={selected || undefined}
      className={cx("ui-calendar-day", className)}
      data-holiday={holiday || undefined}
      data-selected={selected || undefined}
      data-today={today || undefined}
      data-weekend={weekend || undefined}
      role="gridcell"
    >
      <span className="ui-calendar-day__name">{dayName}</span>
      <span className="ui-calendar-day__date">{dateLabel}</span>
    </div>
  );
}

type ScheduleCellProps = {
  assignment?: ShiftKind | "UNASSIGNED";
  state?: "draft" | "published";
  timeLabel?: string;
  exceptionLabel?: string;
  validationLabel?: string;
  selected?: boolean;
  className?: string;
  footer?: ReactNode;
};

export function ScheduleCell({
  assignment = "UNASSIGNED",
  className,
  exceptionLabel,
  footer,
  selected,
  state = "published",
  timeLabel,
  validationLabel,
}: ScheduleCellProps) {
  return (
    <div
      className={cx("ui-schedule-cell", className)}
      data-selected={selected || undefined}
      data-state={state}
    >
      <div className="ui-schedule-cell__top">
        {assignment === "UNASSIGNED" ? (
          <span className="ui-schedule-cell__unassigned">Belum diisi</span>
        ) : (
          <ShiftBadge shift={assignment} />
        )}
        <span className="ui-schedule-cell__meta">{state === "draft" ? "Draft" : "Published"}</span>
      </div>
      <div className="ui-schedule-cell__meta">
        {timeLabel ? (
          <>
            <Icon name="clock" size={14} />
            <span>{timeLabel}</span>
          </>
        ) : null}
        {exceptionLabel ? <span>{exceptionLabel}</span> : null}
      </div>
      {validationLabel ? (
        <span className="ui-schedule-cell__validation">
          <Icon name="warning" size={14} />
          {validationLabel}
        </span>
      ) : null}
      {footer}
    </div>
  );
}
