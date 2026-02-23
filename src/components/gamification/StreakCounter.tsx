"use client";

import { cn } from "@/lib/utils/cn";

interface StreakCounterProps {
  current: number;
  best: number;
  shields: number;
  className?: string;
}

export function StreakCounter({ current, best, shields, className }: StreakCounterProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Current streak */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            current > 0 && "animate-flame"
          )}
        >
          <span className="text-3xl">{current > 0 ? "🔥" : "❄️"}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{current}</p>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            {current === 1 ? "día" : "días"} seguidos
          </p>
        </div>
      </div>

      {/* Best streak */}
      <div className="text-center">
        <p className="text-[13px] font-medium text-[var(--color-text-muted)]">🏅 Mejor</p>
        <p className="text-lg font-bold text-[var(--color-text)]">{best}</p>
      </div>

      {/* Shields */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "text-xl transition-all duration-300",
              i < shields ? "scale-100 opacity-100" : "scale-75 opacity-30 grayscale"
            )}
          >
            🛡️
          </span>
        ))}
        <span className="text-[13px] text-[var(--color-text-secondary)] ml-1">
          {shields}/3
        </span>
      </div>
    </div>
  );
}
