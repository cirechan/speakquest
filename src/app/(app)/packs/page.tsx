"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/game-store";
import { getPackTypeInfo } from "@/lib/gamification/packs";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export default function PacksPage() {
  const router = useRouter();
  const unopenedPacks = useGameStore((s) => s.unopenedPacks);
  const cards = useGameStore((s) => s.cards);

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          🎴 Mis Sobres
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {unopenedPacks.length > 0
            ? `Tienes ${unopenedPacks.length} sobre${unopenedPacks.length > 1 ? "s" : ""} sin abrir`
            : "Juega sesiones para ganar sobres"
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="text-center">
          <span className="text-2xl block">🎴</span>
          <p className="text-lg font-bold text-[var(--color-text)]">{unopenedPacks.length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Sin abrir</p>
        </Card>
        <Card padding="md" className="text-center">
          <span className="text-2xl block">🃏</span>
          <p className="text-lg font-bold text-[var(--color-text)]">{cards.length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Coleccionadas</p>
        </Card>
      </div>

      {/* Unopened packs */}
      {unopenedPacks.length > 0 ? (
        <div className="space-y-3">
          {unopenedPacks.map((pack) => {
            const info = getPackTypeInfo(pack.type);
            return (
              <button
                key={pack.id}
                onClick={() => router.push(`/packs/open?id=${pack.id}`)}
                className={cn(
                  "w-full p-5 rounded-[var(--radius-lg)] border-2 flex items-center gap-4 transition-all duration-300 active:scale-[0.98]",
                  "hover:scale-[1.02] hover:shadow-lg",
                  info.glow
                    ? "border-transparent animate-pulse-subtle"
                    : "border-[var(--color-border)]"
                )}
                style={{
                  backgroundColor: `${info.color}15`,
                  borderColor: info.glow ? info.color : undefined,
                  boxShadow: info.glow ? `0 0 20px ${info.color}30` : undefined,
                }}
              >
                <span className="text-5xl">{info.emoji}</span>
                <div className="text-left flex-1">
                  <p className="font-bold text-lg text-[var(--color-text)]">{info.name}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {pack.cardCount} cartas
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {pack.source === "session_complete" ? "Sesion completada" :
                     pack.source === "bonus_score" ? "Bonus por puntuacion" :
                     pack.source === "milestone" ? "Logro desbloqueado" : "Recompensa"}
                  </p>
                </div>
                <span className="text-2xl">👆</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <span className="text-5xl block mb-3">📦</span>
          <p className="font-bold text-[var(--color-text)] mb-2">
            No tienes sobres
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Completa sesiones de ejercicios para ganar sobres con cartas de vocabulario
          </p>
          <Button size="lg" className="gap-2" onClick={() => router.push("/learn")}>
            📚 Ir a jugar
          </Button>
        </Card>
      )}

      {/* Link to collection */}
      {cards.length > 0 && (
        <Link
          href="/collection"
          className="block text-center text-sm text-[var(--color-primary)] hover:underline"
        >
          🃏 Ver mi coleccion ({cards.length} cartas)
        </Link>
      )}
    </div>
  );
}
