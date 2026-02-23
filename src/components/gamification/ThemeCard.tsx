"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ThemeCardProps {
  slug: string;
  nameEs: string;
  emoji: string;
  color: string;
  wordsLearned: number;
  totalWords: number;
}

export function ThemeCard({
  slug,
  nameEs,
  emoji,
  color,
  wordsLearned,
  totalWords,
}: ThemeCardProps) {
  const percentage = totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100) : 0;

  return (
    <Link href={`/learn?theme=${slug}`}>
      <div
        className={cn(
          "bg-[var(--color-bg-card)] border border-[var(--color-border)]",
          "rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)]",
          "transition-all duration-300",
          "hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:scale-[1.03]",
          "cursor-pointer group"
        )}
      >
        {/* Emoji icon */}
        <div
          className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ backgroundColor: `${color}20` }}
        >
          <span className="text-3xl">{emoji}</span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-[var(--color-text)] mb-2">{nameEs}</h3>

        {/* Progress */}
        <ProgressBar
          value={wordsLearned}
          max={totalWords}
          color={color}
          size="sm"
        />
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {wordsLearned}/{totalWords} palabras · {percentage}%
        </p>
      </div>
    </Link>
  );
}
