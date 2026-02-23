"use client";

import { cn } from "@/lib/utils/cn";
import { RANKS, type RankId } from "@/lib/utils/constants";

interface XPBarProps {
  xpTotal: number;
  rank: RankId;
  streakCurrent: number;
  className?: string;
}

function getNextRank(currentRank: RankId): { name: string; threshold: number; emoji: string } | null {
  const rankOrder: RankId[] = ["rookie", "player", "pro", "champion", "legend"];
  const idx = rankOrder.indexOf(currentRank);
  if (idx >= rankOrder.length - 1) return null;
  const nextRank = rankOrder[idx + 1];
  return RANKS[nextRank];
}

export function XPBar({ xpTotal, rank, streakCurrent, className }: XPBarProps) {
  const currentRank = RANKS[rank];
  const nextRank = getNextRank(rank);
  const xpInRank = xpTotal - currentRank.threshold;
  const xpNeeded = nextRank ? nextRank.threshold - currentRank.threshold : 1;
  const progress = nextRank ? Math.min((xpInRank / xpNeeded) * 100, 100) : 100;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 bg-[var(--color-bg-card)]",
        "border-b-2 border-[var(--color-border)] shadow-[0_1px_3px_rgb(0_0_0/0.04)]",
        className
      )}
    >
      {/* Rank badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] text-[13px] font-bold"
        style={{ backgroundColor: `${currentRank.color}20`, color: currentRank.color }}
      >
        <span>{currentRank.emoji}</span>
        <span>{currentRank.name}</span>
      </div>

      {/* XP Progress */}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-[var(--color-border)] rounded-[var(--radius-full)] overflow-hidden">
          <div
            className="h-full rounded-[var(--radius-full)] xp-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: currentRank.color,
            }}
          />
        </div>
        <span className="text-[13px] font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">
          ✨ {xpTotal.toLocaleString()} XP
        </span>
      </div>

      {/* Streak */}
      {streakCurrent > 0 && (
        <div className="flex items-center gap-1 text-sm font-bold animate-flame">
          <span className="text-lg">🔥</span>
          <span className="text-[var(--color-warning)]">{streakCurrent}</span>
        </div>
      )}
    </div>
  );
}
