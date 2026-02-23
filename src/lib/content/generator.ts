import Anthropic from "@anthropic-ai/sdk";
import { buildContentPrompt } from "./prompts";
import type { ContentType, DifficultyLevel } from "@/lib/utils/constants";

export interface GenerationRequest {
  theme: string;
  contentType: ContentType;
  difficultyLevel: DifficultyLevel;
  count: number;
  userContext?: {
    userId: string;
    struggledWords: string[];
    recentlyLearned: string[];
    interests: string[];
    grammarGaps: string[];
  };
}

export interface GeneratedItem {
  englishText: string;
  spanishTranslation: string;
  phoneticHint?: string;
  contextSentence?: string;
  contextTranslation?: string;
  tags: string[];
  grammarPoints: string[];
  difficultyScore: number;
}

export interface GenerationResult {
  items: GeneratedItem[];
  dialogues?: Array<{
    titleEn: string;
    titleEs: string;
    scenario: string;
    lines: Array<{
      speaker: string;
      englishText: string;
      spanishTranslation: string;
      emotion: string;
    }>;
  }>;
  tokensUsed: number;
  modelVersion: string;
}

export async function generateContent(
  request: GenerationRequest
): Promise<GenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const client = new Anthropic({ apiKey });

  const prompt = buildContentPrompt({
    theme: request.theme,
    level: request.difficultyLevel,
    count: request.count,
    contentType: request.contentType,
    struggledWords: request.userContext?.struggledWords,
    recentlyLearned: request.userContext?.recentlyLearned,
    grammarGaps: request.userContext?.grammarGaps,
    interests: request.userContext?.interests,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const rawJson = textContent.text.trim();
  const parsed = JSON.parse(rawJson);

  const tokensUsed =
    (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

  // Normalize based on content type
  if (request.contentType === "dialogue") {
    return {
      items: [],
      dialogues: (parsed.dialogues || []).map(
        (d: Record<string, unknown>) => ({
          titleEn: d.title_en as string,
          titleEs: d.title_es as string,
          scenario: d.scenario as string,
          lines: (d.lines as Array<Record<string, string>>).map((l) => ({
            speaker: l.speaker,
            englishText: l.english_text,
            spanishTranslation: l.spanish_translation,
            emotion: l.emotion || "neutral",
          })),
        })
      ),
      tokensUsed,
      modelVersion: "claude-sonnet-4-5-20250929",
    };
  }

  return {
    items: (parsed.items || []).map(
      (item: Record<string, unknown>) => ({
        englishText: item.english_text as string,
        spanishTranslation: item.spanish_translation as string,
        phoneticHint: (item.phonetic_hint as string) || "",
        contextSentence: (item.context_sentence as string) || "",
        contextTranslation: (item.context_translation as string) || "",
        tags: (item.tags as string[]) || [],
        grammarPoints: (item.grammar_points as string[]) || [],
        difficultyScore: (item.difficulty_score as number) || 50,
      })
    ),
    tokensUsed,
    modelVersion: "claude-sonnet-4-5-20250929",
  };
}
