import type { Rarity } from "@/lib/utils/constants";

export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  eventType: string;
  sourceId: string;
  sourceType: string;
  multiplier: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  questType: "daily" | "weekly" | "special" | "story";
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  targetType: string;
  targetCount: number;
  themeRestriction: string | null;
  exerciseTypeRestriction: string | null;
  xpReward: number;
  availableFrom: string;
  availableUntil: string;
  recurrence: "none" | "daily" | "weekly";
  status: "active" | "inactive";
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  quest?: Quest;
  currentProgress: number;
  status: "active" | "completed" | "expired";
  startedAt: string;
  completedAt: string | null;
  rewardsClaimed: boolean;
}

export interface WordPack {
  id: string;
  contentUnitId: string;
  rarity: Rarity;
  albumId: string;
  cardArtUrl: string | null;
  flavorTextEn: string;
  flavorTextEs: string;
}

export interface UserWordPack {
  id: string;
  userId: string;
  wordPackId: string;
  wordPack?: WordPack;
  obtainedAt: string;
  obtainedVia: "exercise" | "quest" | "season" | "achievement";
  isNew: boolean;
}

export interface Album {
  id: string;
  themeId: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  totalCards: number;
  coverArtUrl: string | null;
  completionRewardXp: number;
}

export interface Season {
  id: string;
  nameEn: string;
  nameEs: string;
  themeDescription: string;
  startDate: string;
  endDate: string;
  totalLevels: number;
  status: "upcoming" | "active" | "ended";
}

export interface SeasonLevel {
  id: string;
  seasonId: string;
  levelNumber: number;
  xpRequired: number;
  rewardType: string;
  rewardData: Record<string, unknown>;
}

export interface UserSeason {
  id: string;
  userId: string;
  seasonId: string;
  currentLevel: number;
  xpInSeason: number;
  rewardsClaimed: number[];
}

export interface Streak {
  current: number;
  best: number;
  shields: number;
  lastActivityDate: string | null;
}

export interface Achievement {
  id: string;
  slug: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  iconUrl: string | null;
  category: "learning" | "social" | "collection" | "milestone";
  requirementType: string;
  requirementValue: number;
  xpReward: number;
}
