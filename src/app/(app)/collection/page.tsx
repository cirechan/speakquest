"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { INITIAL_THEMES, type Rarity } from "@/lib/utils/constants";
import { useGameStore } from "@/stores/game-store";
import { getRarityInfo, getThemeEmoji } from "@/lib/gamification/packs";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const RARITY_FILTERS: Array<{ value: Rarity | "all"; label: string; emoji: string }> = [
  { value: "all", label: "Todas", emoji: "🃏" },
  { value: "common", label: "Comun", emoji: "⚪" },
  { value: "rare", label: "Rara", emoji: "🔵" },
  { value: "epic", label: "Epica", emoji: "🟣" },
  { value: "legendary", label: "Legendaria", emoji: "🌟" },
];

export default function CollectionPage() {
  const cards = useGameStore((s) => s.cards);
  const markCardsAsSeen = useGameStore((s) => s.markCardsAsSeen);
  const [filterRarity, setFilterRarity] = useState<Rarity | "all">("all");
  const [filterTheme, setFilterTheme] = useState<string | "all">("all");

  // Mark new cards as seen after viewing collection for 2 seconds
  const hasNewCards = cards.some(c => c.isNew);
  useEffect(() => {
    if (!hasNewCards) return;
    const timer = setTimeout(() => markCardsAsSeen(), 2000);
    return () => clearTimeout(timer);
  }, [hasNewCards, markCardsAsSeen]);

  const filteredCards = cards.filter(c => {
    if (filterRarity !== "all" && c.rarity !== filterRarity) return false;
    if (filterTheme !== "all" && c.theme !== filterTheme) return false;
    return true;
  });

  // Count by rarity
  const rarityCounts = {
    common: cards.filter(c => c.rarity === "common").length,
    rare: cards.filter(c => c.rarity === "rare").length,
    epic: cards.filter(c => c.rarity === "epic").length,
    legendary: cards.filter(c => c.rarity === "legendary").length,
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          🃏 Mi Coleccion
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {cards.length} carta{cards.length !== 1 ? "s" : ""} coleccionada{cards.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Rarity summary */}
      <div className="grid grid-cols-4 gap-2">
        {(["common", "rare", "epic", "legendary"] as Rarity[]).map(rarity => {
          const info = getRarityInfo(rarity);
          return (
            <Card key={rarity} padding="sm" className="text-center">
              <span className="text-xl">{info.emoji}</span>
              <p className="text-lg font-bold text-[var(--color-text)]">{rarityCounts[rarity]}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{info.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Rarity filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {RARITY_FILTERS.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => setFilterRarity(value)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px]",
              filterRarity === value
                ? "bg-[var(--color-primary)] text-white shadow-md"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
            )}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Theme filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterTheme("all")}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px]",
            filterTheme === "all"
              ? "bg-[var(--color-primary)] text-white shadow-md"
              : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
          )}
        >
          📚 Todos
        </button>
        {INITIAL_THEMES.map(theme => (
          <button
            key={theme.slug}
            onClick={() => setFilterTheme(theme.slug)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px]",
              filterTheme === theme.slug
                ? "bg-[var(--color-primary)] text-white shadow-md"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
            )}
          >
            {theme.emoji} {theme.nameEs}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map(card => {
            const rInfo = getRarityInfo(card.rarity);
            const tEmoji = getThemeEmoji(card.theme);
            return (
              <Card
                key={card.id}
                padding="md"
                className={cn(
                  "text-center transition-all hover:scale-[1.03]",
                  card.isNew && "ring-2 ring-[var(--color-primary)] animate-pulse-subtle"
                )}
                style={{
                  borderTop: `3px solid ${rInfo.color}`,
                }}
              >
                {card.isNew && (
                  <Badge variant="primary" size="sm" className="mb-2">NEW</Badge>
                )}
                <span className="text-2xl block mb-1">{tEmoji}</span>
                <p className="font-bold text-[var(--color-text)] text-sm">{card.word}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{card.translation}</p>
                <div className="mt-2">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${rInfo.color}20`, color: rInfo.color }}
                  >
                    {rInfo.emoji} {rInfo.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[var(--color-primary-light)] flex items-center justify-center">
            <span className="text-4xl">{cards.length === 0 ? "🃏" : "🔍"}</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
            {cards.length === 0 ? "Tu album esta vacio" : "Sin resultados"}
          </h3>
          <p className="text-[15px] text-[var(--color-text-secondary)] mb-6 max-w-[280px] mx-auto leading-relaxed">
            {cards.length === 0
              ? "Juega ejercicios y abre sobres para conseguir tus primeras cartas"
              : "Ninguna carta coincide con este filtro. Prueba otra combinacion"
            }
          </p>
          {cards.length === 0 && (
            <Link href="/learn">
              <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all min-h-[48px]">
                Empezar a jugar
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
