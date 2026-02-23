"use client";

import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)] shadow-sm hover:shadow-md active:shadow-none",
  secondary:
    "bg-[var(--color-bg-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary-light)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]",
  danger:
    "bg-[var(--color-error)] text-white hover:bg-red-600 focus-visible:ring-[var(--color-error)] shadow-sm",
  success:
    "bg-[var(--color-success)] text-white hover:bg-green-600 focus-visible:ring-[var(--color-success)] shadow-sm",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-[var(--radius-md)] min-h-[40px]",
  md: "px-5 py-2.5 text-base rounded-[var(--radius-md)] min-h-[46px]",
  lg: "px-6 py-3.5 text-lg rounded-[var(--radius-lg)] min-h-[52px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-all duration-[var(--transition-speed)] ease-[var(--transition-ease)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.97]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
