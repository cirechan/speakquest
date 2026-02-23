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
          "bg-[var(--color-bg-card)] relative overflow-hidden",
          "rounded-[20px] p-4 shadow-[var(--shadow-sm)]",
          "border border-[var(--color-border)]/50",
          "transition-all duration-300 ease-out",
          "hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
          "cursor-pointer group"
        )}
      >
        {/* Subtle color accent on top */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]" style={{ backgroundColor: color }} />

        {/* Emoji icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <span className="text-3xl">{emoji}</span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-[var(--color-text)] mb-2 tracking-tight">{nameEs}</h3>

        {/* Progress */}
        <ProgressBar
          value={wordsLearned}
          max={totalWords}
          color={color}
          size="sm"
        />
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5">
          {wordsLearned}/{totalWords} palabras · {percentage}%
        </p>
      </div>
    </Link>
  );
}
