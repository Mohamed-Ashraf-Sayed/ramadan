"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            bg-ramadan-navy text-white placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-ramadan-navy resize-y min-h-[100px]
            ${
              error
                ? "border-error focus:border-error focus:ring-error/30"
                : "border-ramadan-gold/30 focus:border-ramadan-gold focus:ring-ramadan-gold/30"
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-white/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
