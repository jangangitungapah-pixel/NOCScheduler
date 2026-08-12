"use client";

import {
  useRef,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";

import { cx } from "@/lib/ui/cx";

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ className, label, ...props }: ChoiceProps) {
  return (
    <label className={cx("ui-choice", className)}>
      <input {...props} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ className, label, ...props }: ChoiceProps) {
  return (
    <label className={cx("ui-choice", className)}>
      <input {...props} type="radio" />
      <span>{label}</span>
    </label>
  );
}

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
};

export function Switch({ checked, className, disabled, label, onCheckedChange }: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cx("ui-switch", className)}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span aria-hidden="true" className="ui-switch__track">
        <span className="ui-switch__thumb" />
      </span>
      <span className="ui-switch__label">{label}</span>
    </button>
  );
}

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  ariaLabel: string;
  options: Array<SegmentedOption<T>>;
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  ariaLabel,
  className,
  onValueChange,
  options,
  value,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex = (index + direction + options.length) % options.length;
    const nextOption = options[nextIndex];
    if (!nextOption) return;
    onValueChange(nextOption.value);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div aria-label={ariaLabel} className={cx("ui-segmented", className)} role="radiogroup">
      {options.map((option, index) => (
        <button
          aria-checked={option.value === value}
          className="ui-segmented__item"
          key={option.value}
          onClick={() => onValueChange(option.value)}
          onKeyDown={(event) => move(event, index)}
          ref={(node) => {
            refs.current[index] = node;
          }}
          role="radio"
          tabIndex={option.value === value ? 0 : -1}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function controlledCheckboxHandler(
  setter: (checked: boolean) => void,
): ChangeEventHandler<HTMLInputElement> {
  return (event) => setter(event.target.checked);
}
