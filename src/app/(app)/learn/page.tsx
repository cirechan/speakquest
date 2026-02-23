"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeCard } from "@/components/gamification/ThemeCard";
import { INITIAL_THEMES, DIFFICULTY_LEVELS } from "@/lib/utils/constants";
import { SportsZaragoza } from "@/components/themes/SportsZaragoza";
import { getThemeWordCount } from "@/lib/content/bank";
import { useGameStore } from "@/stores/game-store";
import { useState, Suspense } from "react";
import Link from "next/link";

const DIFFICULTY_EMOJIS: Record<string, string> = {
  beginner: "🌱",
  elementary: "🌿",
  intermediate: "🌳",
  upper: "🏔️",
  advanced: "🚀",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Principiante",
  elementary: "Elemental",
  intermediate: "Intermedio",
  upper: "Avanzado",
  advanced: "Experto",
};

// Only show the 3 levels that have content seeded
const AVAILABLE_LEVELS = ["beginner", "elementary", "intermediate"] as const;

function LearnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTheme = searchParams.get("theme");
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [sessionDuration, setSessionDuration] = useState(10);
  const wordsLearned = useGameStore((s) => s.wordsLearned);

  if (selectedTheme) {
    const theme = INITIAL_THEMES.find((t) => t.slug === selectedTheme);
    if (!theme) return <p>Tema no encontrado</p>;

    return (
      <div className="space-y-5 animate-slide-up">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors min-h-[44px]"
        >
          ← Volver a temas
        </Link>

        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${theme.color}20` }}
          >
            <span className="text-3xl">{theme.emoji}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              {theme.nameEs}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{theme.nameEn}</p>
          </div>
        </div>

        {selectedTheme === "sports" && <SportsZaragoza />}

        <Card padding="md">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-3">
            📊 Elige tu nivel
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                  selectedLevel === level
                    ? "bg-[var(--color-primary)] text-white shadow-md scale-[1.03]"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] active:scale-[0.97]"
                }`}
              >
                <span className="text-lg">{DIFFICULTY_EMOJIS[level]}</span>
                {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h3 className="font-bold text-sm text-[var(--color-text)] mb-3">
            ⏱️ ¿Cuanto tiempo?
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((min) => (
              <button
                key={min}
                onClick={() => setSessionDuration(min)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl font-medium transition-all min-h-[52px] ${
                  sessionDuration === min
                    ? "bg-[var(--color-primary)] text-white shadow-md scale-[1.05]"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] active:scale-[0.97]"
                }`}
              >
                <span className="text-xl font-bold">{min}</span>
                <span className="text-[10px]">min</span>
              </button>
            ))}
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full gap-3 text-lg py-5 font-bold animate-pulse-subtle"
          onClick={() => router.push(`/learn/play?theme=${selectedTheme}&level=${selectedLevel}&duration=${sessionDuration}`)}
        >
          <span className="text-2xl">🎮</span>
          ¡A jugar! ({sessionDuration} min)
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">
          📚 ¿Que quieres aprender?
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Elige el tema que mas te guste
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {INITIAL_THEMES.map((theme) => {
          const totalWords = getThemeWordCount(theme.slug);
          // wordsLearned from store are English words — count how many are in this theme
          const learned = wordsLearned.length > 0
            ? Math.round(wordsLearned.length / INITIAL_THEMES.length) // approx per theme
            : 0;
          return (
            <ThemeCard
              key={theme.slug}
              {...theme}
              wordsLearned={Math.min(learned, totalWords)}
              totalWords={totalWords}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
      <LearnContent />
    </Suspense>
  );
}
