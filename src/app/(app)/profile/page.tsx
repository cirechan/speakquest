"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RANKS, type RankId } from "@/lib/utils/constants";
import { useGameStore } from "@/stores/game-store";

export default function ProfilePage() {
  const playerName = useGameStore((s) => s.playerName);
  const avatarUrl = useGameStore((s) => s.avatarUrl);
  const xpTotal = useGameStore((s) => s.xpTotal);
  const rankId = useGameStore((s) => s.rank) as RankId;
  const wordsLearned = useGameStore((s) => s.wordsLearned);
  const sessionsCompleted = useGameStore((s) => s.sessionsCompleted);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const cards = useGameStore((s) => s.cards);

  const rank = RANKS[rankId] || RANKS.rookie;
  const rankOrder: RankId[] = ["rookie", "player", "pro", "champion", "legend"];
  const nextRankIdx = rankOrder.indexOf(rankId) + 1;
  const nextRank = nextRankIdx < rankOrder.length ? RANKS[rankOrder[nextRankIdx]] : null;
  const xpToNext = nextRank ? nextRank.threshold - xpTotal : 0;
  const xpProgress = xpTotal - rank.threshold;
  const xpNeeded = nextRank ? nextRank.threshold - rank.threshold : 1;

  const STATS = [
    { emoji: "📚", label: "Palabras", value: wordsLearned.length },
    { emoji: "🎮", label: "Sesiones", value: sessionsCompleted },
    { emoji: "🔥", label: "Mejor racha", value: `${bestStreak} dias` },
    { emoji: "🃏", label: "Cartas", value: cards.length },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-[var(--color-primary)] shadow-[var(--shadow-md)]" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary-light)] mx-auto mb-3 flex items-center justify-center text-5xl shadow-[var(--shadow-md)] animate-pulse-subtle">
            {rank.emoji}
          </div>
        )}
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{playerName || "Aventurero"}</h1>
        <Badge variant="rarity" rarityColor={rank.color} size="md" className="mt-2">
          {rank.emoji} {rank.name}
        </Badge>
        <Link href="/profile/settings" className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
          ⚙️ Ajustes
        </Link>
      </div>

      {nextRank && (
        <Card padding="md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <span className="font-medium text-[var(--color-text)]">XP Total</span>
            <span className="ml-auto text-lg font-bold text-[var(--color-primary)]">{xpTotal.toLocaleString()}</span>
          </div>
          <ProgressBar value={xpProgress} max={xpNeeded} color={rank.color} size="md" />
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            {nextRank.emoji} Te faltan <strong>{xpToNext.toLocaleString()} XP</strong> para ser {nextRank.name}
          </p>
        </Card>
      )}

      <section>
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-3">📊 Mis estadisticas</h2>
        <div className="grid grid-cols-2 gap-3">
          {STATS.map(({ emoji, label, value }) => (
            <Card key={label} padding="md" className="text-center hover:scale-[1.03] transition-transform">
              <span className="text-3xl block mb-2">{emoji}</span>
              <p className="text-xl font-bold text-[var(--color-text)]">{value}</p>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-1 font-medium uppercase tracking-wide">{label}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
