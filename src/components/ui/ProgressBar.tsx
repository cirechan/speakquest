"use client";

import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-5",
};

export function ProgressBar({
  value,
  max,
  color = "var(--color-primary)",
  size = "md",
  showLabel = false,
  label,
  animate = true,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-[var(--color-text)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-[var(--color-border)] rounded-[var(--radius-full)] overflow-hidden",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-[var(--radius-full)]",
            animate && "transition-all duration-500 ease-out"
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
