"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type DropdownItem = string | DropdownOption;

export interface DropdownProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> {
  label?: string;
  labelSrOnly?: boolean;
  value?: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  options?: DropdownItem[];
  className?: string;
  selectClassName?: string;
  icon?: React.ReactNode;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  function Dropdown(
    {
      label,
      labelSrOnly = false,
      value,
      onChange,
      options,
      className = "",
      selectClassName = "",
      icon,
      disabled,
      id,
      children,
      ...selectProps
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id || (label ? generatedId : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value, e);
    };

    return (
      <div
        className={`relative ${
          label && !labelSrOnly ? "flex flex-col gap-1.5" : "block"
        } ${className}`}
      >
        {label && (
          <label
            htmlFor={selectId}
            className={
              labelSrOnly
                ? "sr-only"
                : "text-xs font-semibold text-ink cursor-pointer"
            }
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-label={labelSrOnly ? label : selectProps["aria-label"]}
            className={`w-full appearance-none pl-3.5 pr-9 py-2.5 min-h-[46px] rounded border border-line bg-surface text-ink text-sm font-normal outline-none transition-colors hover:border-gold/50 focus:ring-2 focus:ring-gold/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 ${selectClassName}`}
            {...selectProps}
          >
            {options
              ? options.map((item, index) => {
                  const opt =
                    typeof item === "string"
                      ? { value: item, label: item }
                      : item;
                  return (
                    <option
                      key={`${opt.value}-${index}`}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </option>
                  );
                })
              : children}
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none shrink-0 transition-colors">
            {icon ?? <ChevronDown size={16} />}
          </span>
        </div>
      </div>
    );
  },
);
