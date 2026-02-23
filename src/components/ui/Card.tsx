"use client";

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  hover = true,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] border border-[var(--color-border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]",
        "transition-shadow duration-[var(--transition-speed)]",
        hover && "hover:shadow-[var(--shadow-md)]",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
