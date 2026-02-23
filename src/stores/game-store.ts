import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";
import type { SensoryProfile, Rarity } from "@/lib/utils/constants";

// === Types ===

export type TextSize = "small" | "medium" | "large" | "xlarge";
export type CelebrationLevel = "full" | "moderate" | "subtle" | "none";

export interface CollectedCard {
  id: string;
  word: string;
  translation: string;
  theme: string;
  rarity: Rarity;
  collectedAt: string;
  isNew: boolean;
}

export interface Pack {
  id: string;
  type: "basic" | "rare" | "epic";
  cardCount: number;
  earnedAt: string;
  source: string; // "session_complete", "bonus_score", "milestone", etc.
}

export interface QuestProgress {
  id: string;
  type: "daily" | "weekly" | "special";
  description: string;
  emoji: string;
  current: number;
  target: number;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
}

interface GameState {
  // Profile
  playerName: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;

  // Progress
  xpTotal: number;
  rank: string;
  wordsLearned: string[];
  sessionsCompleted: number;

  // Streak
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  streakShields: number;

  // Collection
  cards: CollectedCard[];
  unopenedPacks: Pack[];

  // Quests
  dailyQuests: QuestProgress[];
  weeklyQuests: QuestProgress[];
  lastQuestRefresh: string | null;

  // Preferences (TEA accessibility)
  sensoryMode: SensoryProfile;
  reducedMotion: boolean;
  textSize: TextSize;
  highContrast: boolean;
  celebrationLevel: CelebrationLevel;
  reducedSound: boolean;
  timerVisible: boolean;
  favoriteThemes: string[];
}

interface GameActions {
  // Onboarding
  setPlayerName: (name: string) => void;
  setAvatarUrl: (url: string | null) => void;
  completeOnboarding: () => void;

  // Progress
  addXp: (amount: number) => void;
  updateRank: (rank: string) => void;
  addWordLearned: (word: string) => void;
  incrementSessions: () => void;

  // Streak
  updateStreak: () => void;
  addStreakShield: () => void;

  // Collection
  addCard: (card: CollectedCard) => void;
  markCardsAsSeen: () => void;
  addPack: (pack: Pack) => void;
  removePack: (packId: string) => void;

  // Quests
  updateQuestProgress: (questId: string, progress: number) => void;
  refreshDailyQuests: () => void;

  // Preferences
  setSensoryMode: (mode: SensoryProfile) => void;
  setReducedMotion: (value: boolean) => void;
  setTextSize: (size: TextSize) => void;
  setHighContrast: (value: boolean) => void;
  setCelebrationLevel: (level: CelebrationLevel) => void;
  setReducedSound: (value: boolean) => void;
  setTimerVisible: (value: boolean) => void;
  setFavoriteThemes: (themes: string[]) => void;

  // Reset
  resetProgress: () => void;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getRankForXp(xp: number): string {
  if (xp >= 50000) return "legend";
  if (xp >= 15000) return "champion";
  if (xp >= 5000) return "pro";
  if (xp >= 1000) return "player";
  return "rookie";
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // === Default State ===
      playerName: "",
      avatarUrl: null,
      onboardingComplete: false,

      xpTotal: 0,
      rank: "rookie",
      wordsLearned: [],
      sessionsCompleted: 0,

      currentStreak: 0,
      bestStreak: 0,
      lastActivityDate: null,
      streakShields: 0,

      cards: [],
      unopenedPacks: [],

      dailyQuests: [],
      weeklyQuests: [],
      lastQuestRefresh: null,

      sensoryMode: "standard",
      reducedMotion: false,
      textSize: "medium",
      highContrast: false,
      celebrationLevel: "full",
      reducedSound: false,
      timerVisible: true,
      favoriteThemes: [],

      // === Actions ===

      setPlayerName: (name) => set({ playerName: name }),
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      completeOnboarding: () => set({ onboardingComplete: true }),

      addXp: (amount) => {
        const newXp = get().xpTotal + amount;
        set({ xpTotal: newXp, rank: getRankForXp(newXp) });
      },
      updateRank: (rank) => set({ rank }),
      addWordLearned: (word) => {
        const current = get().wordsLearned;
        if (!current.includes(word)) {
          set({ wordsLearned: [...current, word] });
        }
      },
      incrementSessions: () =>
        set({ sessionsCompleted: get().sessionsCompleted + 1 }),

      updateStreak: () => {
        const today = getToday();
        const { lastActivityDate, currentStreak, bestStreak } = get();

        if (lastActivityDate === today) return; // Already counted today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak: number;
        if (lastActivityDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else if (lastActivityDate && lastActivityDate < yesterdayStr) {
          // Streak broken — check for shield
          if (get().streakShields > 0) {
            newStreak = currentStreak + 1;
            set({ streakShields: get().streakShields - 1 });
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        set({
          currentStreak: newStreak,
          bestStreak: Math.max(newStreak, bestStreak),
          lastActivityDate: today,
        });
      },
      addStreakShield: () =>
        set({ streakShields: Math.min(get().streakShields + 1, 3) }),

      addCard: (card) => set({ cards: [...get().cards, card] }),
      markCardsAsSeen: () =>
        set({
          cards: get().cards.map((c) => ({ ...c, isNew: false })),
        }),
      addPack: (pack) => set({ unopenedPacks: [...get().unopenedPacks, pack] }),
      removePack: (packId) =>
        set({
          unopenedPacks: get().unopenedPacks.filter((p) => p.id !== packId),
        }),

      updateQuestProgress: (questId, progress) => {
        set({
          dailyQuests: get().dailyQuests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  current: Math.min(progress, q.target),
                  completed: progress >= q.target,
                  completedAt:
                    progress >= q.target ? new Date().toISOString() : undefined,
                }
              : q
          ),
          weeklyQuests: get().weeklyQuests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  current: Math.min(progress, q.target),
                  completed: progress >= q.target,
                  completedAt:
                    progress >= q.target ? new Date().toISOString() : undefined,
                }
              : q
          ),
        });
      },

      refreshDailyQuests: () => {
        const today = getToday();
        if (get().lastQuestRefresh === today) return;

        set({
          dailyQuests: [
            {
              id: `daily-1-${today}`,
              type: "daily",
              description: "Completa 1 sesion de ejercicios",
              emoji: "🎮",
              current: 0,
              target: 1,
              xpReward: 50,
              completed: false,
            },
            {
              id: `daily-2-${today}`,
              type: "daily",
              description: "Aprende 5 palabras nuevas",
              emoji: "📚",
              current: 0,
              target: 5,
              xpReward: 30,
              completed: false,
            },
            {
              id: `daily-3-${today}`,
              type: "daily",
              description: "Consigue una racha de 3",
              emoji: "🔥",
              current: 0,
              target: 3,
              xpReward: 20,
              completed: false,
            },
          ],
          lastQuestRefresh: today,
        });
      },

      setSensoryMode: (mode) => set({ sensoryMode: mode }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setTextSize: (size) => set({ textSize: size }),
      setHighContrast: (value) => set({ highContrast: value }),
      setCelebrationLevel: (level) => set({ celebrationLevel: level }),
      setReducedSound: (value) => set({ reducedSound: value }),
      setTimerVisible: (value) => set({ timerVisible: value }),
      setFavoriteThemes: (themes) => set({ favoriteThemes: themes }),

      resetProgress: () =>
        set({
          xpTotal: 0,
          rank: "rookie",
          wordsLearned: [],
          sessionsCompleted: 0,
          currentStreak: 0,
          bestStreak: 0,
          lastActivityDate: null,
          streakShields: 0,
          cards: [],
          unopenedPacks: [],
          dailyQuests: [],
          weeklyQuests: [],
          lastQuestRefresh: null,
        }),
    }),
    {
      name: "speakquest-game",
    }
  )
);

// Helper to check if the store has been rehydrated from localStorage
export const useGameStoreHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if already hydrated
    const unsub = useGameStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If hydration already finished before we subscribed
    if (useGameStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  return hydrated;
};
