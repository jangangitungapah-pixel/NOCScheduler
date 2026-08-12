import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "tonal" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  children,
  className,
  disabled,
  iconOnly = false,
  leadingIcon,
  loading = false,
  size = "md",
  trailingIcon,
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cx(
        "ui-button",
        `ui-button--${variant}`,
        `ui-button--${size}`,
        iconOnly && "ui-button--icon",
        className,
      )}
      data-loading={loading}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      <span className="ui-button__content">
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
      {loading ? <span aria-hidden="true" className="ui-button__spinner" /> : null}
    </button>
  );
}
