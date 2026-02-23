"use client";

import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

const questEmojis: Record<string, string> = {
  spy_mission: "🕵️",
  echo_challenge: "🎤",
  speed_reader: "📖",
  lucky_word: "🎲",
  boss_challenge: "🐉",
  tongue_twister: "👅",
  word_builder: "🔤",
};

interface QuestCardProps {
  titleEs: string;
  descriptionEs: string;
  questType: string;
  xpReward: number;
  currentProgress: number;
  targetCount: number;
  status: "active" | "completed" | "expired";
}

export function QuestCard({
  titleEs,
  descriptionEs,
  questType,
  xpReward,
  currentProgress,
  targetCount,
  status,
}: QuestCardProps) {
  const emoji = questEmojis[questType] || "⚔️";
  const isComplete = status === "completed";

  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] border border-[var(--color-border)]",
        "rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)]",
        "transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:scale-[1.01]",
        isComplete && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center shrink-0",
            "transition-transform duration-300",
            isComplete
              ? "bg-[var(--color-success-light)]"
              : "bg-[var(--color-primary-light)] hover:scale-110"
          )}
        >
          <span className="text-2xl">{isComplete ? "✅" : emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-[var(--color-text)] text-sm truncate">
              {titleEs}
            </h4>
            {isComplete && <Badge variant="success" size="sm">✅ Completada</Badge>}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">
            {descriptionEs}
          </p>

          <div className="flex items-center gap-3">
            <ProgressBar
              value={currentProgress}
              max={targetCount}
              size="sm"
              color={isComplete ? "var(--color-success)" : "var(--color-primary)"}
              className="flex-1"
            />
            <span className="text-xs font-medium text-[var(--color-warning)]">
              ✨ +{xpReward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
