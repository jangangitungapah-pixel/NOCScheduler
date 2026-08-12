import type { ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

import { Button } from "./button";
import { Icon, type IconName } from "./icon";

export type FeedbackTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneIcon: Record<FeedbackTone, IconName> = {
  neutral: "info",
  info: "info",
  success: "check",
  warning: "warning",
  danger: "alert",
};

type FeedbackProps = {
  tone?: FeedbackTone;
  title: string;
  children?: ReactNode;
  className?: string;
};

function FeedbackContent({ children, title, tone = "neutral" }: FeedbackProps) {
  return (
    <>
      <Icon name={toneIcon[tone]} size={18} />
      <div>
        <p className="ui-feedback__title">{title}</p>
        {children ? <div className="ui-feedback__body">{children}</div> : null}
      </div>
    </>
  );
}

export function Banner({ className, tone = "neutral", ...props }: FeedbackProps) {
  return (
    <div className={cx("ui-banner", className)} data-tone={tone} role={tone === "danger" ? "alert" : "status"}>
      <FeedbackContent {...props} tone={tone} />
    </div>
  );
}

export function Toast({ className, tone = "neutral", ...props }: FeedbackProps) {
  return (
    <div className={cx("ui-toast", className)} data-tone={tone} role={tone === "danger" ? "alert" : "status"}>
      <FeedbackContent {...props} tone={tone} />
    </div>
  );
}

export function InlineValidation({ className, tone = "danger", ...props }: FeedbackProps) {
  return (
    <div className={cx("ui-inline-feedback", className)} data-tone={tone} role={tone === "danger" ? "alert" : "status"}>
      <FeedbackContent {...props} tone={tone} />
    </div>
  );
}

type SkeletonProps = {
  variant?: "line" | "title" | "avatar" | "block";
  className?: string;
};

export function Skeleton({ className, variant = "line" }: SkeletonProps) {
  return <span aria-hidden="true" className={cx("ui-skeleton", className)} data-variant={variant} />;
}

type StateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
  className?: string;
};

function StatePrimitive({ actionLabel, className, description, icon = "info", onAction, title }: StateProps) {
  return (
    <div className={cx("ui-state", className)}>
      <div className="ui-state__icon">
        <Icon name={icon} size={20} />
      </div>
      <h3 className="ui-state__title">{title}</h3>
      <p className="ui-state__description">{description}</p>
      {actionLabel ? (
        <div className="ui-state__action">
          <Button onClick={onAction} variant="tonal">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function EmptyState(props: StateProps) {
  return <StatePrimitive {...props} />;
}

export function ErrorState(props: StateProps) {
  return <StatePrimitive {...props} icon={props.icon ?? "alert"} />;
}
