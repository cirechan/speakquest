import type { ContentType, DifficultyLevel } from "@/lib/utils/constants";

const LEVEL_DESCRIPTIONS: Record<DifficultyLevel, string> = {
  beginner: "Very basic words (1-3 syllables), simple present tense, common everyday vocabulary. Ages 8-10.",
  elementary: "Simple sentences, present and past tense, basic connectors. Ages 10-11.",
  intermediate: "Compound sentences, varied tenses, idiomatic expressions. Ages 11-13.",
  upper: "Complex sentences, conditionals, phrasal verbs, abstract concepts. Ages 13-14.",
  advanced: "Sophisticated vocabulary, nuanced expressions, slang, cultural references. Ages 14+.",
};

interface PromptParams {
  theme: string;
  level: DifficultyLevel;
  count: number;
  contentType: ContentType;
  struggledWords?: string[];
  recentlyLearned?: string[];
  grammarGaps?: string[];
  interests?: string[];
}

export function buildContentPrompt(params: PromptParams): string {
  const { theme, level, count, contentType, struggledWords, recentlyLearned, grammarGaps, interests } = params;
  const levelDesc = LEVEL_DESCRIPTIONS[level];

  const avoidList = recentlyLearned?.length
    ? `\nAVOID these recently learned words (don't repeat them as main items): ${recentlyLearned.join(", ")}`
    : "";

  const struggleContext = struggledWords?.length
    ? `\nIMPORTANT: The student struggles with these words. Include them naturally in example sentences to provide additional exposure: ${struggledWords.join(", ")}`
    : "";

  const grammarContext = grammarGaps?.length
    ? `\nTry to naturally incorporate these grammar patterns the student hasn't covered yet: ${grammarGaps.join(", ")}`
    : "";

  const interestContext = interests?.length
    ? `\nThe student is especially interested in: ${interests.join(", ")}. Try to relate content to these interests when possible.`
    : "";

  const typeInstructions = getTypeInstructions(contentType);

  return `You are creating English learning content for Spanish-speaking children.

THEME: ${theme}
DIFFICULTY LEVEL: ${level} — ${levelDesc}
CONTENT TYPE: ${contentType}
GENERATE: ${count} items
${avoidList}${struggleContext}${grammarContext}${interestContext}

${typeInstructions}

RULES:
- Content must be age-appropriate and engaging for children
- All content must relate to the theme "${theme}"
- Spanish translations must use Latin American Spanish (not peninsular)
- Phonetic hints should use sounds familiar to Spanish speakers (e.g., "nais shot" for "nice shot")
- Example sentences must be relatable to children's daily life
- Difficulty must match ${level} level strictly
- Do NOT include profanity, violence references, or inappropriate content
- Each item must be unique and not a duplicate of others in the batch

Respond ONLY with valid JSON. No markdown, no explanation. Format:
${getOutputFormat(contentType)}`;
}

function getTypeInstructions(type: ContentType): string {
  switch (type) {
    case "vocabulary":
      return `For each vocabulary item, provide:
- english_text: the English word or very short phrase (1-4 words)
- spanish_translation: accurate Spanish translation
- phonetic_hint: simplified pronunciation using Spanish phonetics
- context_sentence: a natural example sentence (child-appropriate)
- context_translation: Spanish translation of the sentence
- tags: 2-4 relevant tags
- grammar_points: grammar concepts this demonstrates (empty array if none)
- difficulty_score: 1-100 difficulty estimate`;

    case "phrase":
      return `For each phrase, provide:
- english_text: a useful English phrase or expression (3-10 words)
- spanish_translation: natural Spanish equivalent (not literal)
- phonetic_hint: simplified pronunciation
- context_sentence: a dialogue context showing when to use this phrase
- context_translation: Spanish translation
- tags: 2-4 tags
- grammar_points: grammar concepts
- difficulty_score: 1-100`;

    case "dialogue":
      return `Create a short dialogue (4-8 lines) between two characters.
Provide:
- title_en: dialogue title in English
- title_es: dialogue title in Spanish
- scenario: brief description of the scenario
- lines: array of {speaker, english_text, spanish_translation, emotion}
  emotions: "neutral", "happy", "surprised", "questioning"`;

    case "listening":
      return `For each listening exercise, provide:
- english_text: a short paragraph or description (30-80 words) to be read aloud
- spanish_translation: Spanish translation
- questions: array of 3 multiple-choice questions, each with:
  - question_en: question in English
  - question_es: question in Spanish
  - options: 4 answer options in English
  - correct_index: 0-3 index of correct answer
- difficulty_score: 1-100`;

    case "pronunciation":
      return `For each pronunciation drill, provide:
- english_text: the phrase to practice (focus on challenging sounds for Spanish speakers)
- phonetic_hint: detailed phonetic guide
- difficulty_sounds: which sounds are challenging (e.g., "th", "v/b", "sh/ch")
- tips_es: 1-2 pronunciation tips in Spanish
- difficulty_score: 1-100`;

    default:
      return "";
  }
}

function getOutputFormat(type: ContentType): string {
  if (type === "dialogue") {
    return `{
  "dialogues": [
    {
      "title_en": "...",
      "title_es": "...",
      "scenario": "...",
      "lines": [
        {"speaker": "...", "english_text": "...", "spanish_translation": "...", "emotion": "neutral"}
      ]
    }
  ]
}`;
  }

  if (type === "listening") {
    return `{
  "items": [
    {
      "english_text": "...",
      "spanish_translation": "...",
      "questions": [
        {"question_en": "...", "question_es": "...", "options": ["A", "B", "C", "D"], "correct_index": 0}
      ],
      "difficulty_score": 50
    }
  ]
}`;
  }

  return `{
  "items": [
    {
      "english_text": "...",
      "spanish_translation": "...",
      "phonetic_hint": "...",
      "context_sentence": "...",
      "context_translation": "...",
      "tags": ["tag1", "tag2"],
      "grammar_points": [],
      "difficulty_score": 50
    }
  ]
}`;
}
