"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, options, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            bg-ramadan-navy text-white cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-ramadan-navy
            ${
              error
                ? "border-error focus:border-error focus:ring-error/30"
                : "border-ramadan-gold/30 focus:border-ramadan-gold focus:ring-ramadan-gold/30"
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-ramadan-navy text-white">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
