"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { Button } from "./button";
import { Icon } from "./icon";

type OverlayVariant = "dialog" | "drawer" | "inspector" | "sheet";

type OverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: OverlayVariant;
};

function Overlay({
  children,
  description,
  footer,
  onOpenChange,
  open,
  title,
  variant = "dialog",
}: OverlayProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="ui-dialog"
      data-variant={variant}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
      ref={ref}
    >
      {variant === "sheet" ? <div aria-hidden="true" className="ui-dialog__handle" /> : null}
      <header className="ui-dialog__header">
        <div>
          <h2 className="ui-dialog__title" id={titleId}>
            {title}
          </h2>
          {description ? (
            <p className="ui-dialog__description" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
        <Button aria-label="Tutup" iconOnly onClick={() => onOpenChange(false)} size="sm" variant="ghost">
          <Icon name="close" size={16} />
        </Button>
      </header>
      <div className="ui-dialog__body">{children}</div>
      {footer ? <footer className="ui-dialog__footer">{footer}</footer> : null}
    </dialog>
  );
}

export function Dialog(props: Omit<OverlayProps, "variant">) {
  return <Overlay {...props} variant="dialog" />;
}

export function Drawer(props: Omit<OverlayProps, "variant">) {
  return <Overlay {...props} variant="drawer" />;
}

export function Inspector(props: Omit<OverlayProps, "variant">) {
  return <Overlay {...props} variant="inspector" />;
}

export function BottomSheet(props: Omit<OverlayProps, "variant">) {
  return <Overlay {...props} variant="sheet" />;
}
