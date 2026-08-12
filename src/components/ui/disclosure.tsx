import { useId, type ReactNode } from "react";

import { cx } from "@/lib/ui/cx";

type TooltipProps = {
  content: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ children, className, content }: TooltipProps) {
  const id = useId();

  return (
    <span className={cx("ui-tooltip", className)}>
      <span aria-describedby={id}>{children}</span>
      <span className="ui-tooltip__bubble" id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
}

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "start" | "end";
};

export function Popover({ children, className, trigger }: PopoverProps) {
  return (
    <details className={cx("ui-popover", className)}>
      <summary>{trigger}</summary>
      <div className="ui-popover__panel">{children}</div>
    </details>
  );
}

type MenuItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type DropdownMenuProps = {
  trigger: ReactNode;
  items: MenuItem[];
  groupLabel?: string;
  className?: string;
};

export function DropdownMenu({ className, groupLabel, items, trigger }: DropdownMenuProps) {
  return (
    <Popover className={className} trigger={trigger}>
      <div className="ui-menu" role="menu">
        {groupLabel ? <div className="ui-menu__group-label">{groupLabel}</div> : null}
        {items.map((item) => (
          <button
            className="ui-menu__item"
            data-danger={item.danger || undefined}
            disabled={item.disabled}
            key={item.id}
            onClick={item.onSelect}
            role="menuitem"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </Popover>
  );
}

export function ContextMenu(props: DropdownMenuProps) {
  return <DropdownMenu {...props} />;
}
