"use client";

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "primary" | "rarity";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  rarityColor?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-border)] text-[var(--color-text-secondary)]",
  success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  error: "bg-[var(--color-error-light)] text-[var(--color-error)]",
  primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  rarity: "",
};

const sizeStyles = {
  sm: "px-2.5 py-1 text-[13px]",
  md: "px-3 py-1.5 text-sm",
};

export function Badge({
  variant = "default",
  size = "sm",
  rarityColor,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-[var(--radius-full)]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={
        variant === "rarity" && rarityColor
          ? { backgroundColor: `${rarityColor}20`, color: rarityColor }
          : undefined
      }
      {...props}
    >
      {children}
    </span>
  );
}
