import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  showDot?: boolean;
  children: ReactNode;
};

export function Badge({ children, className, showDot = false, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span className={cx("ui-badge", className)} data-tone={tone} {...props}>
      {showDot ? <span aria-hidden="true" className="ui-badge__dot" /> : null}
      {children}
    </span>
  );
}

export type ShiftKind = "S1" | "S2" | "S3" | "OFF" | "LEAVE" | "EXCEPTION";

const shiftLabels: Record<ShiftKind, string> = {
  S1: "Shift 1",
  S2: "Shift 2",
  S3: "Shift 3",
  OFF: "OFF",
  LEAVE: "Leave",
  EXCEPTION: "Exception",
};

type ShiftBadgeProps = Omit<BadgeProps, "children" | "tone"> & {
  shift: ShiftKind;
  expanded?: boolean;
};

export function ShiftBadge({ className, expanded = false, shift, ...props }: ShiftBadgeProps) {
  return (
    <span
      className={cx("ui-badge", "ui-shift-badge", className)}
      data-shift={shift}
      title={shiftLabels[shift]}
      {...props}
    >
      <span aria-hidden="true" className="ui-badge__dot" />
      {expanded ? shiftLabels[shift] : shift}
    </span>
  );
}
