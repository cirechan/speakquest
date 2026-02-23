"use client";

import { useEffect } from "react";
import { QuestCard } from "@/components/gamification/QuestCard";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/stores/game-store";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function QuestsPage() {
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const refreshDailyQuests = useGameStore((s) => s.refreshDailyQuests);

  useEffect(() => {
    refreshDailyQuests();
  }, [refreshDailyQuests]);

  const completedCount = dailyQuests.filter((q) => q.completed).length;
  const totalCount = dailyQuests.length;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-[var(--text-2xl)] font-extrabold text-[var(--color-text)] mb-1 tracking-tight">
          Misiones
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Completa misiones diarias para ganar XP y premios
        </p>
      </div>

      {/* Daily progress summary */}
      <Card padding="md">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎯</span>
          <span className="font-medium text-[var(--color-text)]">Progreso de hoy</span>
          <span className="ml-auto text-sm font-bold text-[var(--color-primary)]">
            {completedCount}/{totalCount} completadas
          </span>
        </div>
        <ProgressBar
          value={completedCount}
          max={totalCount || 1}
          color="var(--color-primary)"
          size="md"
        />
        {totalCount > 0 && completedCount === totalCount && (
          <p className="text-sm text-[var(--color-success)] mt-2 font-medium">
            🎉 ¡Todas las misiones de hoy completadas! ¡Genial!
          </p>
        )}
      </Card>

      {/* Quest list */}
      {dailyQuests.length > 0 ? (
        <div className="grid gap-3">
          {dailyQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              titleEs={`${quest.emoji} ${quest.description}`}
              descriptionEs={`${quest.current}/${quest.target} completado`}
              questType="daily"
              xpReward={quest.xpReward}
              currentProgress={quest.current}
              targetCount={quest.target}
              status={quest.completed ? "completed" : "active"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[var(--color-warning-light)] flex items-center justify-center">
            <span className="text-4xl">⚔️</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
            Misiones bloqueadas
          </h3>
          <p className="text-[15px] text-[var(--color-text-secondary)] mb-6 max-w-[280px] mx-auto leading-relaxed">
            Completa tu primera sesion de ejercicios para desbloquear las misiones diarias
          </p>
          <Link href="/learn">
            <Button size="lg" className="gap-2">
              Empezar a jugar
            </Button>
          </Link>
        </div>
      )}

      {/* Info card */}
      <Card padding="md" className="bg-[var(--color-bg-card)]">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-sm text-[var(--color-text)]">
              Consejo
            </p>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
              Las misiones se renuevan cada dia. Completa sesiones de ejercicios para avanzar en tus misiones
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
