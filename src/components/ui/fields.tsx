"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cx } from "@/lib/ui/cx";

import { Icon } from "./icon";

type FieldMeta = {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

type FieldShellProps = FieldMeta & {
  id: string;
  children: ReactNode;
};

function FieldShell({ children, error, helperText, id, label, required }: FieldShellProps) {
  const message = error ?? helperText;

  return (
    <div className="ui-field">
      <div className="ui-field__label-row">
        <label className="ui-field__label" htmlFor={id}>
          {label}
          {required ? (
            <span aria-hidden="true" className="ui-field__required">
              {" "}
              *
            </span>
          ) : null}
        </label>
      </div>
      {children}
      {message ? (
        <p
          className="ui-field__helper"
          data-tone={error ? "error" : undefined}
          id={`${id}-message`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> &
  FieldMeta & {
    id?: string;
    leading?: ReactNode;
  };

export function Input({
  error,
  helperText,
  id: idProp,
  label,
  leading,
  required,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const describedBy = error || helperText ? `${id}-message` : props["aria-describedby"];

  return (
    <FieldShell error={error} helperText={helperText} id={id} label={label} required={required}>
      <div className="ui-field__control" data-leading={Boolean(leading)}>
        {leading ? <span className="ui-field__leading">{leading}</span> : null}
        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={error ? true : props["aria-invalid"]}
          className={cx("ui-input", props.className)}
          id={id}
          required={required}
        />
      </div>
    </FieldShell>
  );
}

export function SearchInput(props: Omit<InputProps, "leading" | "type">) {
  return <Input {...props} leading={<Icon name="search" size={16} />} type="search" />;
}

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> &
  FieldMeta & {
    id?: string;
  };

export function Textarea({
  error,
  helperText,
  id: idProp,
  label,
  required,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <FieldShell error={error} helperText={helperText} id={id} label={label} required={required}>
      <textarea
        {...props}
        aria-describedby={error || helperText ? `${id}-message` : props["aria-describedby"]}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cx("ui-textarea", props.className)}
        id={id}
        required={required}
      />
    </FieldShell>
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> &
  FieldMeta & {
    id?: string;
    children: ReactNode;
  };

export function Select({
  children,
  error,
  helperText,
  id: idProp,
  label,
  required,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <FieldShell error={error} helperText={helperText} id={id} label={label} required={required}>
      <select
        {...props}
        aria-describedby={error || helperText ? `${id}-message` : props["aria-describedby"]}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cx("ui-select", props.className)}
        id={id}
        required={required}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
};

type ComboboxProps = FieldMeta & {
  id?: string;
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
};

export function Combobox({
  disabled,
  emptyText = "Tidak ada hasil.",
  error,
  helperText,
  id: idProp,
  label,
  onValueChange,
  options,
  placeholder,
  required,
  value,
}: ComboboxProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const selectedOption = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selectedOption?.label ?? "");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setQuery(selectedOption?.label ?? "");
  }, [selectedOption?.label]);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    if (!normalized || selectedOption?.label === query) return options;

    return options.filter((option) =>
      `${option.label} ${option.description ?? ""}`.toLocaleLowerCase("id-ID").includes(normalized),
    );
  }, [options, query, selectedOption?.label]);

  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) setHighlightedIndex(0);
  }, [filteredOptions.length, highlightedIndex]);

  const choose = (option: ComboboxOption) => {
    setQuery(option.label);
    setOpen(false);
    onValueChange?.(option.value);
  };

  const activeOption = filteredOptions[highlightedIndex];

  return (
    <FieldShell error={error} helperText={helperText} id={id} label={label} required={required}>
      <div className="ui-combobox">
        <input
          aria-activedescendant={
            open && activeOption ? `${id}-option-${activeOption.value}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-describedby={error || helperText ? `${id}-message` : undefined}
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          className="ui-combobox__input"
          disabled={disabled}
          id={id}
          onBlur={() => window.setTimeout(() => setOpen(false), 0)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setHighlightedIndex((index) =>
                Math.min(index + 1, Math.max(filteredOptions.length - 1, 0)),
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setHighlightedIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && open && activeOption) {
              event.preventDefault();
              choose(activeOption);
            } else if (event.key === "Escape") {
              setOpen(false);
              setQuery(selectedOption?.label ?? "");
            }
          }}
          placeholder={placeholder}
          role="combobox"
          value={query}
        />
        {open && !disabled ? (
          <div className="ui-combobox__panel" id={listboxId} role="listbox">
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <div
                  aria-selected={option.value === value || index === highlightedIndex}
                  className="ui-combobox__option"
                  id={`${id}-option-${option.value}`}
                  key={option.value}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(option);
                  }}
                  role="option"
                >
                  <span className="ui-combobox__option-label">{option.label}</span>
                  {option.description ? (
                    <span className="ui-combobox__option-description">{option.description}</span>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="ui-combobox__empty">{emptyText}</div>
            )}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}
