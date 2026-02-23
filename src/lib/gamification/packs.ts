import { RARITY_WEIGHTS, RARITY_COLORS, INITIAL_THEMES, type Rarity } from "@/lib/utils/constants";
import type { CollectedCard, Pack } from "@/stores/game-store";

// Vocabulary pool for card generation
const VOCABULARY_POOL: Array<{ word: string; translation: string; theme: string }> = [
  // Gaming
  { word: "player", translation: "jugador", theme: "gaming" },
  { word: "level", translation: "nivel", theme: "gaming" },
  { word: "score", translation: "puntuacion", theme: "gaming" },
  { word: "power", translation: "poder", theme: "gaming" },
  { word: "quest", translation: "mision", theme: "gaming" },
  { word: "shield", translation: "escudo", theme: "gaming" },
  { word: "sword", translation: "espada", theme: "gaming" },
  { word: "dragon", translation: "dragon", theme: "gaming" },
  { word: "treasure", translation: "tesoro", theme: "gaming" },
  { word: "hero", translation: "heroe", theme: "gaming" },
  // Sports
  { word: "goal", translation: "gol", theme: "sports" },
  { word: "team", translation: "equipo", theme: "sports" },
  { word: "ball", translation: "balon", theme: "sports" },
  { word: "coach", translation: "entrenador", theme: "sports" },
  { word: "win", translation: "ganar", theme: "sports" },
  { word: "match", translation: "partido", theme: "sports" },
  { word: "stadium", translation: "estadio", theme: "sports" },
  { word: "trophy", translation: "trofeo", theme: "sports" },
  { word: "champion", translation: "campeon", theme: "sports" },
  { word: "referee", translation: "arbitro", theme: "sports" },
  // Daily Life
  { word: "house", translation: "casa", theme: "daily-life" },
  { word: "family", translation: "familia", theme: "daily-life" },
  { word: "friend", translation: "amigo", theme: "daily-life" },
  { word: "school", translation: "escuela", theme: "daily-life" },
  { word: "morning", translation: "manana", theme: "daily-life" },
  { word: "water", translation: "agua", theme: "daily-life" },
  { word: "happy", translation: "feliz", theme: "daily-life" },
  { word: "sleep", translation: "dormir", theme: "daily-life" },
  // Food
  { word: "pizza", translation: "pizza", theme: "food" },
  { word: "chicken", translation: "pollo", theme: "food" },
  { word: "apple", translation: "manzana", theme: "food" },
  { word: "juice", translation: "zumo", theme: "food" },
  { word: "bread", translation: "pan", theme: "food" },
  { word: "cheese", translation: "queso", theme: "food" },
  { word: "chocolate", translation: "chocolate", theme: "food" },
  { word: "ice cream", translation: "helado", theme: "food" },
  // Music
  { word: "song", translation: "cancion", theme: "music" },
  { word: "guitar", translation: "guitarra", theme: "music" },
  { word: "drums", translation: "bateria", theme: "music" },
  { word: "singer", translation: "cantante", theme: "music" },
  { word: "concert", translation: "concierto", theme: "music" },
  { word: "dance", translation: "bailar", theme: "music" },
  // Movies
  { word: "movie", translation: "pelicula", theme: "movies" },
  { word: "actor", translation: "actor", theme: "movies" },
  { word: "scene", translation: "escena", theme: "movies" },
  { word: "story", translation: "historia", theme: "movies" },
  { word: "magic", translation: "magia", theme: "movies" },
  { word: "monster", translation: "monstruo", theme: "movies" },
  // Travel
  { word: "airplane", translation: "avion", theme: "travel" },
  { word: "beach", translation: "playa", theme: "travel" },
  { word: "mountain", translation: "montana", theme: "travel" },
  { word: "hotel", translation: "hotel", theme: "travel" },
  { word: "passport", translation: "pasaporte", theme: "travel" },
  { word: "adventure", translation: "aventura", theme: "travel" },
  // School
  { word: "teacher", translation: "profesor", theme: "school" },
  { word: "book", translation: "libro", theme: "school" },
  { word: "pencil", translation: "lapiz", theme: "school" },
  { word: "computer", translation: "ordenador", theme: "school" },
  { word: "homework", translation: "deberes", theme: "school" },
  { word: "science", translation: "ciencia", theme: "school" },
];

function rollRarity(guaranteed?: Rarity): Rarity {
  if (guaranteed) return guaranteed;
  const rand = Math.random();
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulative += weight;
    if (rand <= cumulative) return rarity as Rarity;
  }
  return "common";
}

export function generatePackCards(pack: Pack, existingCards: CollectedCard[]): CollectedCard[] {
  const cards: CollectedCard[] = [];
  const existingWords = new Set(existingCards.map(c => c.word));

  for (let i = 0; i < pack.cardCount; i++) {
    // First card of rare/epic packs gets guaranteed rarity
    const isGuaranteedSlot = i === 0 && pack.type !== "basic";
    const guaranteedRarity = isGuaranteedSlot
      ? pack.type === "epic" ? "epic" : "rare"
      : undefined;

    const rarity = rollRarity(guaranteedRarity);

    // Pick a random word, preferring ones not yet collected
    const uncollected = VOCABULARY_POOL.filter(v => !existingWords.has(v.word));
    const pool = uncollected.length > 0 ? uncollected : VOCABULARY_POOL;
    const vocab = pool[Math.floor(Math.random() * pool.length)];

    const card: CollectedCard = {
      id: `card-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      word: vocab.word,
      translation: vocab.translation,
      theme: vocab.theme,
      rarity,
      collectedAt: new Date().toISOString(),
      isNew: true,
    };

    cards.push(card);
    existingWords.add(vocab.word);
  }

  return cards;
}

export function getPackTypeInfo(type: Pack["type"]) {
  switch (type) {
    case "basic":
      return { emoji: "🎴", name: "Sobre Basico", color: "#9ca3af", glow: false };
    case "rare":
      return { emoji: "💎", name: "Sobre Raro", color: "#3b82f6", glow: true };
    case "epic":
      return { emoji: "🌟", name: "Sobre Epico", color: "#a855f7", glow: true };
  }
}

export function getRarityInfo(rarity: Rarity) {
  return {
    color: RARITY_COLORS[rarity],
    emoji: rarity === "legendary" ? "🌟" : rarity === "epic" ? "🟣" : rarity === "rare" ? "🔵" : "⚪",
    label: rarity === "legendary" ? "Legendaria" : rarity === "epic" ? "Epica" : rarity === "rare" ? "Rara" : "Comun",
  };
}

export function getThemeEmoji(themeSlug: string): string {
  return INITIAL_THEMES.find(t => t.slug === themeSlug)?.emoji || "📚";
}
