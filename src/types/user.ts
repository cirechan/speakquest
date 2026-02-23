import type { RankId, SensoryProfile, DifficultyLevel } from "@/lib/utils/constants";

export interface User {
  id: string;
  email: string;
  displayName: string;
  nativeLanguage: string;
  currentLevel: DifficultyLevel;
  xpTotal: number;
  xpCurrentLevel: number;
  rank: RankId;
  avatarConfig: AvatarConfig | null;
  streakCurrent: number;
  streakBest: number;
  streakShields: number;
  lastActivityDate: string | null;
  onboardingComplete: boolean;
}

export interface AvatarConfig {
  baseCharacter: string;
  hair?: string;
  outfit?: string;
  accessories?: string[];
  background?: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  favoriteThemes: string[];
  difficultyMode: "easy" | "adaptive" | "challenge";
  sessionDuration: number;
  dailyGoalXp: number;
  preferredVoice: string;
  speechRate: number;
  sensoryMode: SensoryProfile;
  reducedMotion: boolean;
  reducedSound: boolean;
  textSize: "small" | "medium" | "large" | "xlarge";
  highContrast: boolean;
  predictableLayout: boolean;
  timerVisible: boolean;
  celebrationLevel: "full" | "moderate" | "subtle" | "none";
}
