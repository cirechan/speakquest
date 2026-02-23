import type { ContentType, DifficultyLevel } from "@/lib/utils/constants";

export interface Theme {
  id: string;
  slug: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  icon: string;
  color: string;
  sortOrder: number;
  status: "draft" | "published" | "archived";
}

export interface ContentUnit {
  id: string;
  themeId: string;
  contentType: ContentType;
  difficultyLevel: DifficultyLevel;
  difficultyScore: number;
  englishText: string;
  spanishTranslation: string;
  phoneticHint: string;
  contextSentence: string;
  contextTranslation: string;
  audioUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  grammarPoints: string[];
  source: "manual" | "ai_generated" | "ai_reviewed";
  qualityScore: number | null;
  status: "draft" | "review" | "published" | "rejected";
}

export interface Dialogue {
  id: string;
  themeId: string;
  titleEn: string;
  titleEs: string;
  scenarioDescription: string;
  difficultyLevel: DifficultyLevel;
  lines: DialogueLine[];
}

export interface DialogueLine {
  id: string;
  dialogueId: string;
  speaker: string;
  englishText: string;
  spanishTranslation: string;
  lineOrder: number;
  audioUrl: string | null;
  emotion: "neutral" | "happy" | "surprised" | "questioning";
}

export interface ContentGeneration {
  id: string;
  userId: string | null;
  promptUsed: string;
  modelVersion: string;
  requestParams: Record<string, unknown>;
  responseRaw: string;
  itemsGenerated: number;
  status: "pending" | "completed" | "failed" | "partial";
  errorMessage: string | null;
  createdAt: string;
  processingTimeMs: number | null;
}
