import type { ExerciseType } from "@/lib/utils/constants";
import type { ContentUnit } from "./content";
import type { WordPack } from "./gamification";

export interface ExerciseSession {
  id: string;
  userId: string;
  themeId: string | null;
  sessionType: "practice" | "quest" | "boss" | "review" | "daily";
  exercises: ExerciseConfig[];
  currentIndex: number;
  startedAt: string;
  completedAt: string | null;
  totalExercises: number;
  correctCount: number;
  xpEarned: number;
}

export interface ExerciseConfig {
  type: ExerciseType;
  contentUnit: ContentUnit;
  difficulty: number;
  timeLimit: number | null;
  hints: HintConfig;
}

export interface HintConfig {
  maxHints: number;
  hintsAvailable: string[];
}

export type ExercisePhase = "instruction" | "active" | "feedback" | "complete";

export interface ExerciseState {
  phase: ExercisePhase;
  attempts: number;
  hintsUsed: number;
  startedAt: number;
  userResponse: string | null;
  result: ExerciseResult | null;
}

export interface ExerciseResult {
  isCorrect: boolean;
  qualityScore: number;
  accuracy: number;
  pronunciationScore?: PronunciationScore;
  timeMs: number;
  xpEarned: number;
  wordPackEarned?: WordPack;
  feedback: ExerciseFeedback;
}

export interface PronunciationScore {
  overall: number;
  wordScores?: { word: string; score: number }[];
}

export interface ExerciseFeedback {
  messageEn: string;
  messageEs: string;
  correctAnswer: string;
  explanationEs?: string;
  encouragement: string;
}

export interface ExerciseAttempt {
  id: string;
  sessionId: string;
  contentUnitId: string;
  exerciseType: ExerciseType;
  userResponse: string;
  correctResponse: string;
  isCorrect: boolean;
  qualityScore: number;
  scoreDetail: Record<string, unknown>;
  timeTakenMs: number;
  attemptOrder: number;
  hintsUsed: number;
}
