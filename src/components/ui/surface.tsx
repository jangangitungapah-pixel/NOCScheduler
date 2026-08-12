import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: "base" | "subtle" | "raised" | "selected";
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
};

export function Surface({
  children,
  className,
  elevation = "base",
  padding = "md",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cx(
        "ui-surface",
        elevation !== "base" && `ui-surface--${elevation}`,
        padding !== "none" && `ui-surface--pad-${padding}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
