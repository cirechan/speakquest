// === Rank System ===
export const RANKS = {
  rookie: { name: "Rookie", threshold: 0, color: "#94a3b8", emoji: "🥉" },
  player: { name: "Player", threshold: 1000, color: "#22c55e", emoji: "🥈" },
  pro: { name: "Pro", threshold: 5000, color: "#3b82f6", emoji: "🥇" },
  champion: { name: "Champion", threshold: 15000, color: "#a855f7", emoji: "👑" },
  legend: { name: "Legend", threshold: 50000, color: "#f59e0b", emoji: "🏆" },
} as const;

export type RankId = keyof typeof RANKS;

// === XP Awards ===
export const XP_AWARDS = {
  exercise_attempt: 5,
  exercise_correct: 15,
  exercise_perfect_pronunciation: 25,
  exercise_streak_3: 10,
  exercise_first_word: 20,
  session_complete: 50,
  daily_login: 10,
  quest_daily: 50,
  quest_weekly: 150,
  quest_special: 300,
  album_complete: 100,
} as const;

// === Word Pack Rarity ===
export const RARITY_WEIGHTS = {
  common: 0.60,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03,
} as const;

export type Rarity = keyof typeof RARITY_WEIGHTS;

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#9ca3af",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
};

// === Difficulty Levels ===
export const DIFFICULTY_LEVELS = [
  "beginner",
  "elementary",
  "intermediate",
  "upper",
  "advanced",
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// === Content Types ===
export const CONTENT_TYPES = [
  "vocabulary",
  "phrase",
  "dialogue",
  "listening",
  "pronunciation",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

// === Exercise Types ===
export const EXERCISE_TYPES = [
  "echo_challenge",
  "spy_mission",
  "speed_reader",
  "word_builder",
  "boss_challenge",
  "tongue_twister",
] as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];

// === Sensory Profiles (TEA) ===
export const SENSORY_PROFILES = {
  standard: {
    label: "Standard",
    description: "Full animations and celebrations",
    animations: true,
    transitionSpeed: 300,
    celebrationLevel: "full" as const,
    autoplayAudio: true,
    timerVisible: true,
  },
  calm: {
    label: "Calm",
    description: "Gentle animations, muted colors",
    animations: true,
    transitionSpeed: 500,
    celebrationLevel: "moderate" as const,
    autoplayAudio: false,
    timerVisible: true,
  },
  minimal: {
    label: "Minimal",
    description: "No animations, text-only feedback",
    animations: false,
    transitionSpeed: 0,
    celebrationLevel: "subtle" as const,
    autoplayAudio: false,
    timerVisible: false,
  },
} as const;

export type SensoryProfile = keyof typeof SENSORY_PROFILES;

// === Themes (initial seed) ===
export const INITIAL_THEMES = [
  { slug: "gaming", nameEn: "Gaming", nameEs: "Videojuegos", emoji: "🎮", color: "#8b5cf6" },
  { slug: "sports", nameEn: "Sports", nameEs: "Deportes", emoji: "⚽", color: "#22c55e" },
  { slug: "movies", nameEn: "Movies & TV", nameEs: "Cine y TV", emoji: "🎬", color: "#ef4444" },
  { slug: "music", nameEn: "Music", nameEs: "Música", emoji: "🎵", color: "#ec4899" },
  { slug: "daily-life", nameEn: "Daily Life", nameEs: "Vida diaria", emoji: "🏠", color: "#f59e0b" },
  { slug: "school", nameEn: "School", nameEs: "Escuela", emoji: "🎓", color: "#3b82f6" },
  { slug: "food", nameEn: "Food & Drinks", nameEs: "Comida y bebida", emoji: "🍕", color: "#f97316" },
  { slug: "travel", nameEn: "Travel", nameEs: "Viajes", emoji: "✈️", color: "#06b6d4" },
] as const;
