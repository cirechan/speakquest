"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { ThemeCard } from "@/components/gamification/ThemeCard";
import { INITIAL_THEMES } from "@/lib/utils/constants";
import { useGameStore } from "@/stores/game-store";
import Link from "next/link";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardPage() {
  const playerName = useGameStore((s) => s.playerName);
  const avatarUrl = useGameStore((s) => s.avatarUrl);
  const xpTotal = useGameStore((s) => s.xpTotal);
  const currentStreak = useGameStore((s) => s.currentStreak);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const streakShields = useGameStore((s) => s.streakShields);
  const wordsLearned = useGameStore((s) => s.wordsLearned);
  const sessionsCompleted = useGameStore((s) => s.sessionsCompleted);
  const unopenedPacks = useGameStore((s) => s.unopenedPacks);
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const refreshDailyQuests = useGameStore((s) => s.refreshDailyQuests);

  useEffect(() => {
    refreshDailyQuests();
  }, [refreshDailyQuests]);

  const themeProgress = INITIAL_THEMES.map((t) => ({
    ...t,
    wordsLearned: wordsLearned.length,
    totalWords: 30,
  }));

  const questsDoneToday = dailyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Welcome + Big play button */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]" />
          ) : (
            <span className="text-3xl">👋</span>
          )}
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            ¡Hola, {playerName || "Aventurero"}!
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {sessionsCompleted === 0
            ? "¿Listo para tu primera aventura en ingles?"
            : `${sessionsCompleted} sesiones · ${wordsLearned.length} palabras`
          }
        </p>
        <Link href="/learn">
          <Button size="lg" className="w-full gap-3 text-lg py-4 font-bold animate-pulse-subtle">
            <span className="text-2xl">🚀</span>
            ¡Empezar a jugar!
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="sm">
          <StreakCounter
            current={currentStreak}
            best={bestStreak}
            shields={streakShields}
          />
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <span className="font-medium text-sm text-[var(--color-text)]">Progreso</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <p className="text-lg font-bold text-[var(--color-primary)]">{xpTotal}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">XP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--color-text)]">{wordsLearned.length}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Palabras</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--color-text)]">{sessionsCompleted}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Sesiones</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Unopened packs notification */}
      {unopenedPacks.length > 0 && (
        <Link href="/packs">
          <Card padding="sm" className="bg-[var(--color-primary-light)] border border-[var(--color-primary)] active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse-subtle">🎴</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[var(--color-text)]">
                  ¡{unopenedPacks.length} sobre{unopenedPacks.length > 1 ? "s" : ""} sin abrir!
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Toca para descubrir tus cartas
                </p>
              </div>
              <span className="text-xl">→</span>
            </div>
          </Card>
        </Link>
      )}

      {/* Daily quests */}
      {dailyQuests.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              ⚔️ Misiones ({questsDoneToday}/{dailyQuests.length})
            </h2>
          </div>
          <div className="grid gap-2">
            {dailyQuests.map((quest) => (
              <Card key={quest.id} padding="sm" className={cn(
                "flex items-center gap-3",
                quest.completed && "opacity-60"
              )}>
                <span className="text-xl">{quest.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm text-[var(--color-text)]",
                    quest.completed && "line-through"
                  )}>
                    {quest.description}
                  </p>
                  {!quest.completed && (
                    <ProgressBar value={quest.current} max={quest.target} color="var(--color-primary)" size="sm" />
                  )}
                </div>
                <span className="text-xs font-bold text-[var(--color-primary)] whitespace-nowrap">
                  {quest.completed ? "✅" : `+${quest.xpReward}`}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Themes */}
      <section>
        <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
          📚 Temas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {themeProgress.map((theme) => (
            <ThemeCard key={theme.slug} {...theme} />
          ))}
        </div>
      </section>
    </div>
  );
}
