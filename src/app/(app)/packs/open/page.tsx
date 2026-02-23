"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/game-store";
import { generatePackCards, getPackTypeInfo, getRarityInfo, getThemeEmoji } from "@/lib/gamification/packs";
import type { CollectedCard } from "@/stores/game-store";
import { cn } from "@/lib/utils/cn";

type Phase = "closed" | "opening" | "revealing" | "complete";

function PackOpenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packId = searchParams.get("id");

  const unopenedPacks = useGameStore((s) => s.unopenedPacks);
  const existingCards = useGameStore((s) => s.cards);
  const removePack = useGameStore((s) => s.removePack);
  const addCard = useGameStore((s) => s.addCard);

  const pack = unopenedPacks.find((p) => p.id === packId);
  const [phase, setPhase] = useState<Phase>("closed");
  const [revealedCards, setRevealedCards] = useState<CollectedCard[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(-1);
  const [allGenerated, setAllGenerated] = useState(false);

  // Generate cards on first open
  const generateCards = useCallback(() => {
    if (!pack || allGenerated) return;
    const cards = generatePackCards(pack, existingCards);
    setRevealedCards(cards);
    setAllGenerated(true);
  }, [pack, existingCards, allGenerated]);

  const packInfo = pack ? getPackTypeInfo(pack.type) : null;

  function handleOpenPack() {
    generateCards();
    setPhase("opening");
    setTimeout(() => {
      setPhase("revealing");
      setCurrentRevealIndex(0);
    }, 1200);
  }

  function handleRevealNext() {
    if (currentRevealIndex < revealedCards.length - 1) {
      setCurrentRevealIndex((prev) => prev + 1);
    } else {
      revealedCards.forEach((card) => addCard(card));
      if (pack) removePack(pack.id);
      setPhase("complete");
    }
  }

  function handleRevealAll() {
    revealedCards.forEach((card) => addCard(card));
    if (pack) removePack(pack.id);
    setCurrentRevealIndex(revealedCards.length - 1);
    setPhase("complete");
  }

  // Sound on reveal — ALL hooks must be above any early return
  useEffect(() => {
    if (phase === "revealing" && currentRevealIndex >= 0) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const card = revealedCards[currentRevealIndex];
        const isSpecial = card?.rarity === "legendary" || card?.rarity === "epic";
        osc.type = "sine";
        osc.frequency.setValueAtTime(isSpecial ? 880 : 523, ctx.currentTime);
        osc.frequency.setValueAtTime(isSpecial ? 1047 : 659, ctx.currentTime + 0.08);
        if (isSpecial) osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch { /* silent */ }
    }
  }, [currentRevealIndex, phase, revealedCards]);

  // === EARLY RETURNS after all hooks ===

  if (!pack || !packInfo) {
    return (
      <div className="px-4 text-center py-12 space-y-4">
        <span className="text-5xl block">📦</span>
        <p className="text-lg text-[var(--color-text)]">Sobre no encontrado</p>
        <Button onClick={() => router.push("/packs")} size="lg" className="w-full">
          Volver a sobres
        </Button>
      </div>
    );
  }

  // === CLOSED STATE ===
  if (phase === "closed") {
    return (
      <div className="px-4 text-center space-y-6 animate-slide-up">
        <div className="pt-6">
          <div
            className={cn(
              "w-40 h-56 mx-auto rounded-2xl flex items-center justify-center",
              "border-4 transition-all duration-500 cursor-pointer",
              "hover:scale-[1.05] active:scale-[0.95]",
              packInfo.glow ? "animate-pulse-subtle" : ""
            )}
            style={{
              backgroundColor: `${packInfo.color}20`,
              borderColor: packInfo.color,
              boxShadow: `0 0 30px ${packInfo.color}40, 0 0 60px ${packInfo.color}20`,
            }}
            onClick={handleOpenPack}
          >
            <div className="text-center">
              <span className="text-6xl block mb-2">{packInfo.emoji}</span>
              <p className="text-sm font-bold" style={{ color: packInfo.color }}>
                {packInfo.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {pack.cardCount} cartas
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xl font-bold text-[var(--color-text)] mb-1">
            ¡Toca para abrir!
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Descubre que cartas hay dentro
          </p>
        </div>

        <Button
          size="lg"
          className="w-full text-lg py-4 font-bold animate-pulse-subtle"
          onClick={handleOpenPack}
        >
          ✨ Abrir sobre
        </Button>
      </div>
    );
  }

  // === OPENING STATE ===
  if (phase === "opening") {
    return (
      <div className="px-4 text-center py-16 space-y-6">
        <div
          className="w-40 h-56 mx-auto rounded-2xl flex items-center justify-center border-4"
          style={{
            backgroundColor: `${packInfo.color}20`,
            borderColor: packInfo.color,
            boxShadow: `0 0 60px ${packInfo.color}60`,
            animation: "pack-open 1.2s ease-out forwards",
          }}
        >
          <span className="text-6xl animate-bounce-subtle">{packInfo.emoji}</span>
        </div>
        <p className="text-lg font-bold text-[var(--color-text)] animate-pulse-subtle">
          Abriendo...
        </p>
        <style>{`
          @keyframes pack-open {
            0% { transform: scale(1) rotate(0deg); }
            30% { transform: scale(1.1) rotate(-3deg); }
            50% { transform: scale(1.15) rotate(3deg); }
            70% { transform: scale(1.2) rotate(-2deg); }
            90% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // === REVEALING STATE ===
  if (phase === "revealing" && currentRevealIndex >= 0) {
    const currentCard = revealedCards[currentRevealIndex];
    const rarityInfo = getRarityInfo(currentCard.rarity);
    const themeEmoji = getThemeEmoji(currentCard.theme);
    const isSpecial = currentCard.rarity === "legendary" || currentCard.rarity === "epic";

    return (
      <div className="px-4 text-center space-y-5">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Carta {currentRevealIndex + 1} de {revealedCards.length}
        </p>

        <div
          key={currentRevealIndex}
          className={cn(
            "w-48 mx-auto rounded-2xl p-5 border-4 text-center",
            "animate-slide-up transition-all",
            isSpecial && "animate-pulse-subtle"
          )}
          style={{
            backgroundColor: `${rarityInfo.color}15`,
            borderColor: rarityInfo.color,
            boxShadow: isSpecial
              ? `0 0 40px ${rarityInfo.color}50, 0 0 80px ${rarityInfo.color}20`
              : `0 4px 20px ${rarityInfo.color}30`,
          }}
        >
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{ backgroundColor: `${rarityInfo.color}30`, color: rarityInfo.color }}
          >
            {rarityInfo.emoji} {rarityInfo.label}
          </div>
          <div className="text-4xl mb-2">{themeEmoji}</div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">
            {currentCard.word}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {currentCard.translation}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full text-lg py-4 font-bold"
            onClick={handleRevealNext}
          >
            {currentRevealIndex < revealedCards.length - 1
              ? "Siguiente carta →"
              : "✅ Guardar todas"
            }
          </Button>
          {currentRevealIndex < revealedCards.length - 1 && (
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={handleRevealAll}
            >
              Revelar todas
            </Button>
          )}
        </div>
      </div>
    );
  }

  // === COMPLETE STATE ===
  return (
    <div className="px-4 text-center space-y-5 animate-slide-up">
      <div className="text-5xl animate-bounce-subtle">🎉</div>
      <h2 className="text-2xl font-bold text-[var(--color-text)]">
        ¡Cartas añadidas!
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {revealedCards.map((card) => {
          const rInfo = getRarityInfo(card.rarity);
          const tEmoji = getThemeEmoji(card.theme);
          return (
            <Card
              key={card.id}
              padding="sm"
              className="flex items-center gap-3"
              style={{ borderLeft: `4px solid ${rInfo.color}` }}
            >
              <span className="text-2xl">{tEmoji}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-[var(--color-text)] truncate">{card.word}</p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">{card.translation}</p>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
                style={{ backgroundColor: `${rInfo.color}20`, color: rInfo.color }}
              >
                {rInfo.emoji} {rInfo.label}
              </span>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3 pb-4">
        {unopenedPacks.length > 1 && (
          <Button
            size="lg"
            className="w-full gap-2 text-lg font-bold"
            onClick={() => router.push("/packs")}
          >
            🎴 Abrir mas sobres ({unopenedPacks.length - 1})
          </Button>
        )}
        <Button
          size="lg"
          variant={unopenedPacks.length > 1 ? "secondary" : "primary"}
          className="w-full gap-2 text-lg"
          onClick={() => router.push("/collection")}
        >
          🃏 Ver coleccion
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2 text-lg"
          onClick={() => router.push("/dashboard")}
        >
          🏠 Volver al inicio
        </Button>
      </div>
    </div>
  );
}

export default function PackOpenPage() {
  return (
    <Suspense fallback={
      <div className="px-4 text-center py-12">
        <span className="text-5xl block animate-pulse-subtle">🎴</span>
        <p className="text-lg text-[var(--color-text-secondary)] mt-4">Preparando sobre...</p>
      </div>
    }>
      <PackOpenerContent />
    </Suspense>
  );
}
