"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

// Mock season data
const MOCK_SEASON = {
  name: "Game On",
  emoji: "🎮",
  currentLevel: 12,
  totalLevels: 30,
  xpInSeason: 1250,
  daysRemaining: 18,
};

const LEVEL_REWARDS: Record<string, { emoji: string; label: string }> = {
  xp_boost: { emoji: "⚡", label: "XP Boost" },
  word_pack: { emoji: "🎴", label: "Sobre" },
  special: { emoji: "🎁", label: "Premio" },
};

const MOCK_LEVELS = Array.from({ length: 30 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.round(50 + i * i * 2),
  reward: i % 5 === 4 ? "special" : i % 3 === 0 ? "word_pack" : "xp_boost",
  unlocked: i + 1 <= MOCK_SEASON.currentLevel,
  isCurrent: i + 1 === MOCK_SEASON.currentLevel,
}));

// Next unlock info
const nextLevel = MOCK_LEVELS.find(l => !l.unlocked);

export default function EnglishPassPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Season header - big and exciting */}
      <div className="text-center">
        <Badge variant="primary" size="md" className="mb-2 animate-pulse-subtle">
          🎫 Temporada 1
        </Badge>
        <h1 className="text-3xl font-bold text-[var(--color-text)] flex items-center justify-center gap-3">
          <span className="text-4xl">{MOCK_SEASON.emoji}</span>
          {MOCK_SEASON.name}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mt-2">
          ⏰ {MOCK_SEASON.daysRemaining} días restantes
        </p>
      </div>

      {/* Progress overview */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <span className="font-medium text-[var(--color-text)]">
              Nivel {MOCK_SEASON.currentLevel} de {MOCK_SEASON.totalLevels}
            </span>
          </div>
          <span className="text-lg font-bold text-[var(--color-primary)]">
            ✨ {MOCK_SEASON.xpInSeason} XP
          </span>
        </div>
        <ProgressBar
          value={MOCK_SEASON.currentLevel}
          max={MOCK_SEASON.totalLevels}
          color="var(--color-primary)"
          size="lg"
        />
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          🏁 {MOCK_SEASON.totalLevels - MOCK_SEASON.currentLevel} niveles más para completar la temporada
        </p>
      </Card>

      {/* Next unlock - motivational */}
      {nextLevel && (
        <Card padding="md" className="border-2 border-dashed border-[var(--color-primary)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--color-primary-light)] flex items-center justify-center">
              <span className="text-3xl">{LEVEL_REWARDS[nextLevel.reward].emoji}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[var(--color-text)]">
                🔓 Próximo premio: Nivel {nextLevel.level}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {LEVEL_REWARDS[nextLevel.reward].label} — ¡Necesitas {nextLevel.xpRequired} XP más!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Level track - visual and clear */}
      <section>
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-3">
          🗺️ Mapa de niveles
        </h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {MOCK_LEVELS.map(({ level, reward, unlocked, isCurrent }) => (
            <div
              key={level}
              className={cn(
                "relative aspect-square rounded-[var(--radius-md)] flex flex-col items-center justify-center text-xs font-bold border-2 transition-all duration-200",
                unlocked
                  ? "bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]",
                isCurrent && "ring-2 ring-[var(--color-warning)] ring-offset-2 scale-110 animate-pulse-subtle",
                unlocked && "hover:scale-110 cursor-pointer"
              )}
            >
              {unlocked ? (
                <>
                  <span className="text-lg">{LEVEL_REWARDS[reward].emoji}</span>
                  <span className="text-xs">{level}</span>
                </>
              ) : (
                <>
                  <span className="text-base">🔒</span>
                  <span className="text-xs">{level}</span>
                </>
              )}
              {reward === "special" && !unlocked && (
                <div className="absolute -top-1.5 -right-1.5">
                  <span className="text-sm">🎁</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Legend */}
      <Card padding="md">
        <h3 className="font-medium text-[var(--color-text)] mb-2 text-sm">
          📖 Tipos de premio
        </h3>
        <div className="flex gap-4 flex-wrap">
          {Object.entries(LEVEL_REWARDS).map(([key, { emoji, label }]) => (
            <div key={key} className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <span className="text-lg">{emoji}</span>
              {label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
