"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      iconPosition = "start",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ramadan-navy disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] cursor-pointer";

    const variants = {
      primary:
        "bg-gradient-to-l from-ramadan-gold to-ramadan-amber text-ramadan-dark hover:from-ramadan-gold-light hover:to-ramadan-gold focus:ring-ramadan-gold shadow-lg shadow-ramadan-gold/25 hover:shadow-xl hover:shadow-ramadan-gold/30 hover:-translate-y-0.5",
      secondary:
        "bg-gradient-to-l from-ramadan-orange to-orange-400 text-white hover:from-orange-400 hover:to-ramadan-orange focus:ring-ramadan-orange shadow-lg shadow-ramadan-orange/25 hover:shadow-xl hover:shadow-ramadan-orange/30 hover:-translate-y-0.5",
      accent:
        "bg-ramadan-orange text-white hover:bg-orange-400 focus:ring-ramadan-orange shadow-md hover:shadow-lg hover:-translate-y-0.5",
      outline:
        "border-2 border-ramadan-gold text-ramadan-gold bg-transparent hover:bg-ramadan-gold hover:text-ramadan-dark focus:ring-ramadan-gold hover:shadow-lg hover:shadow-ramadan-gold/20 hover:-translate-y-0.5",
      ghost:
        "text-ramadan-gold bg-transparent hover:bg-ramadan-gold/10 focus:ring-ramadan-gold/50 hover:text-ramadan-gold-light",
      danger:
        "bg-gradient-to-l from-error to-red-500 text-white hover:from-red-500 hover:to-error focus:ring-error shadow-lg shadow-error/25 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-1.5",
      md: "px-6 py-2.5 text-base gap-2",
      lg: "px-8 py-3 text-lg gap-2.5",
      xl: "px-10 py-4 text-xl gap-3",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    const loadingSpinner = (
      <svg
        className={`animate-spin ${iconSizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            {loadingSpinner}
            <span>جاري التحميل...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "start" && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === "end" && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
