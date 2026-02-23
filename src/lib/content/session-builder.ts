/**
 * Session Builder — Generates exercise sessions from the content bank.
 *
 * Takes a theme + level + desired exercise count, and produces a list
 * of exercises in the format the play page expects.
 *
 * Exercise types generated:
 * - vocabulary: Multiple choice (English → Spanish or Spanish → English)
 * - word_builder: Arrange letters to form a word
 * - fill_blank: Complete the sentence
 * - matching: Match English-Spanish pairs
 * - translate_phrase: Arrange words to form a sentence
 * - listening: Listen and pick the right meaning
 */

import {
  ContentItem,
  getContentByThemeAndLevel,
  getContentByTheme,
  CONTENT_BANK,
} from "./bank";

// === Exercise types matching play page interfaces ===

export type ExerciseType =
  | "vocabulary"
  | "listening"
  | "word_builder"
  | "fill_blank"
  | "matching"
  | "translate_phrase";

interface BaseExercise {
  type: ExerciseType;
  emoji: string;
  english: string;
  spanish: string;
  hint?: string;
}

interface MultipleChoiceExercise extends BaseExercise {
  type: "vocabulary" | "listening";
  questionEs: string;
  options: string[];
  correctIndex: number;
}

interface WordBuilderExercise extends BaseExercise {
  type: "word_builder";
  questionEs: string;
  letters: string[];
  answer: string;
}

interface FillBlankExercise extends BaseExercise {
  type: "fill_blank";
  sentence: string;
  questionEs: string;
  options: string[];
  correctIndex: number;
}

interface MatchingExercise extends BaseExercise {
  type: "matching";
  pairs: Array<{ en: string; es: string }>;
}

interface TranslatePhraseExercise extends BaseExercise {
  type: "translate_phrase";
  questionEs: string;
  words: string[];
  answer: string[];
  distractors: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | WordBuilderExercise
  | FillBlankExercise
  | MatchingExercise
  | TranslatePhraseExercise;

// === Builder ===

const THEME_EMOJIS: Record<string, string[]> = {
  gaming: ["🎮", "🕹️", "👾", "🏆", "⚡", "💎", "🎯", "🐉"],
  sports: ["⚽", "🏀", "🏃", "🥇", "💪", "⚡", "🏟️", "🔥"],
  movies: ["🎬", "🍿", "🎭", "⭐", "🎥", "🦸", "👻", "🤖"],
  music: ["🎵", "🎸", "🥁", "🎤", "🎶", "💃", "🎧", "🌟"],
  "daily-life": ["🏠", "☀️", "😊", "🌈", "🐶", "💛", "🌸", "✨"],
  school: ["🎓", "📚", "✏️", "🧠", "🌟", "💡", "🎒", "🔬"],
  food: ["🍕", "🍰", "🍎", "🧁", "🍔", "🥤", "🌮", "🍫"],
  travel: ["✈️", "🗺️", "🏖️", "🌍", "🚀", "🧳", "🏔️", "🌅"],
};

// Fun question starters for variety — kids shouldn't see the same "¿Qué significa...?" every time
const FUN_VOCAB_QUESTIONS_EN_TO_ES = [
  (word: string) => `🤔 ¿Qué significa "${word}"?`,
  (word: string) => `🧠 ¡Piensa rápido! ¿"${word}" es...?`,
  (word: string) => `🔎 Descubre: ¿qué es "${word}"?`,
  (word: string) => `💡 ¿Sabes qué quiere decir "${word}"?`,
  (word: string) => `🎯 Apunta bien: "${word}" significa...`,
];

const FUN_VOCAB_QUESTIONS_ES_TO_EN = [
  (word: string) => `🇬🇧 ¿Cómo se dice "${word}" en inglés?`,
  (word: string) => `🚀 ¡Traduce! "${word}" es...`,
  (word: string) => `🧩 Elige la traducción de "${word}"`,
  (word: string) => `⭐ ¿"${word}" en inglés? ¡Tú puedes!`,
  (word: string) => `🎮 ¡Power-up! Traduce "${word}"`,
];

const FUN_LISTEN_QUESTIONS = [
  "🎧 ¡Escucha con atención! ¿Qué significa?",
  "👂 ¡Abre bien los oídos! ¿Qué han dicho?",
  "🔊 Escucha y elige la respuesta correcta",
  "🎵 ¡Presta atención! ¿Qué significa lo que oyes?",
];

const FUN_FILL_QUESTIONS = [
  "✏️ ¡Completa la frase!",
  "🧩 ¿Qué palabra falta aquí?",
  "🔮 Adivina la palabra que falta",
  "💡 ¡Pon la pieza que falta!",
];

const FUN_WORD_BUILDER_QUESTIONS = [
  (word: string) => `🔤 ¡Construye la palabra! (${word})`,
  (word: string) => `🧱 ¡Ordena las letras! (${word})`,
  (word: string) => `🏗️ Forma la palabra: "${word}"`,
  (word: string) => `✨ ¡Las letras están revueltas! (${word})`,
];

const FUN_TRANSLATE_QUESTIONS = [
  (phrase: string) => `🔄 Traduce: "${phrase}"`,
  (phrase: string) => `🧩 Ordena las palabras: "${phrase}"`,
  (phrase: string) => `🚀 ¡Traduce como un pro! "${phrase}"`,
  (phrase: string) => `⚡ ¡Rapidez! Traduce: "${phrase}"`,
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getThemeEmoji(theme: string): string {
  return pickRandom(THEME_EMOJIS[theme] || ["📚"]);
}

/**
 * Build a session of exercises from the content bank.
 *
 * @param theme - Theme slug
 * @param level - Difficulty level
 * @param count - Number of exercises (default 7)
 * @param excludeWords - Words already learned (for SM-2 later)
 */
export function buildSession(
  theme: string,
  level: string,
  count: number = 7,
  excludeWords: string[] = []
): Exercise[] {
  // Get content pool: current level + mix from easier level
  let pool = getContentByThemeAndLevel(theme, level).filter(
    (c) => !excludeWords.includes(c.english)
  );

  // If not enough content at this level, pull from all levels for this theme
  if (pool.length < count * 2) {
    pool = getContentByTheme(theme).filter(
      (c) => !excludeWords.includes(c.english)
    );
  }

  // If still not enough, use full bank for this theme
  if (pool.length < count) {
    pool = getContentByTheme(theme);
  }

  // Shuffle pool
  pool = shuffleArray(pool);

  // Decide exercise type distribution for the session
  const typeDistribution = getTypeDistribution(count);
  const exercises: Exercise[] = [];
  let contentIdx = 0;

  for (const exerciseType of typeDistribution) {
    const content = pool[contentIdx % pool.length];
    contentIdx++;

    const exercise = createExercise(exerciseType, content, pool, theme);
    if (exercise) {
      exercises.push(exercise);
    }
  }

  return shuffleArray(exercises);
}

/**
 * Distribute exercise types across the session for variety.
 */
function getTypeDistribution(count: number): ExerciseType[] {
  const types: ExerciseType[] = [
    "vocabulary",
    "word_builder",
    "fill_blank",
    "matching",
    "translate_phrase",
    "listening",
    "vocabulary",
  ];

  // For more exercises, cycle through types
  const result: ExerciseType[] = [];
  for (let i = 0; i < count; i++) {
    result.push(types[i % types.length]);
  }
  return result;
}

/**
 * Create a single exercise from a content item.
 */
function createExercise(
  type: ExerciseType,
  content: ContentItem,
  pool: ContentItem[],
  theme: string
): Exercise | null {
  switch (type) {
    case "vocabulary":
      return createVocabularyExercise(content, pool, theme);
    case "listening":
      return createListeningExercise(content, pool, theme);
    case "word_builder":
      return createWordBuilderExercise(content, theme);
    case "fill_blank":
      return createFillBlankExercise(content, pool, theme);
    case "matching":
      return createMatchingExercise(pool, theme);
    case "translate_phrase":
      return createTranslatePhraseExercise(content, theme);
    default:
      return null;
  }
}

function createVocabularyExercise(
  content: ContentItem,
  pool: ContentItem[],
  theme: string
): MultipleChoiceExercise {
  // Randomly decide direction: EN→ES or ES→EN
  const enToEs = Math.random() > 0.5;

  if (enToEs) {
    const distractors =
      content.distractorsEs ||
      shuffleArray(pool.filter((c) => c.id !== content.id))
        .slice(0, 3)
        .map((c) => c.spanish);
    const options = shuffleWithCorrect(content.spanish, distractors.slice(0, 3));

    return {
      type: "vocabulary",
      emoji: getThemeEmoji(theme),
      english: content.english,
      spanish: content.spanish,
      hint: content.hint,
      questionEs: pickRandom(FUN_VOCAB_QUESTIONS_EN_TO_ES)(content.english),
      options: options.items,
      correctIndex: options.correctIdx,
    };
  } else {
    const distractors =
      content.distractorsEn ||
      shuffleArray(pool.filter((c) => c.id !== content.id))
        .slice(0, 3)
        .map((c) => c.english);
    const options = shuffleWithCorrect(content.english, distractors.slice(0, 3));

    return {
      type: "vocabulary",
      emoji: getThemeEmoji(theme),
      english: content.english,
      spanish: content.spanish,
      hint: content.hint,
      questionEs: pickRandom(FUN_VOCAB_QUESTIONS_ES_TO_EN)(content.spanish),
      options: options.items,
      correctIndex: options.correctIdx,
    };
  }
}

function createListeningExercise(
  content: ContentItem,
  pool: ContentItem[],
  theme: string
): MultipleChoiceExercise {
  const textToListen = content.type === "phrase" ? content.english : content.exampleEn;
  const correctAnswer = content.type === "phrase" ? content.spanish : content.exampleEs;

  const distractors = shuffleArray(pool.filter((c) => c.id !== content.id))
    .slice(0, 3)
    .map((c) => (c.type === "phrase" ? c.spanish : c.exampleEs));

  const options = shuffleWithCorrect(correctAnswer, distractors);

  return {
    type: "listening",
    emoji: "🎧",
    english: textToListen,
    spanish: correctAnswer,
    hint: content.hint || `"${content.english}" = ${content.spanish}`,
    questionEs: pickRandom(FUN_LISTEN_QUESTIONS),
    options: options.items,
    correctIndex: options.correctIdx,
  };
}

function createWordBuilderExercise(
  content: ContentItem,
  theme: string
): WordBuilderExercise {
  const word = content.english.toUpperCase();
  // Only use first word if it's a phrase
  const targetWord = word.split(" ")[0];

  // Create letter pool: correct letters + some distractors
  const correctLetters = targetWord.split("");
  const extraLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter((l) => !correctLetters.includes(l));
  const distractorCount = Math.min(3, Math.max(2, 8 - correctLetters.length));
  const distractors = shuffleArray(extraLetters).slice(0, distractorCount);
  const allLetters = shuffleArray([...correctLetters, ...distractors]);

  return {
    type: "word_builder",
    emoji: getThemeEmoji(theme),
    english: content.english,
    spanish: content.spanish,
    hint: content.hint || `💡 Tiene ${targetWord.length} letras`,
    questionEs: pickRandom(FUN_WORD_BUILDER_QUESTIONS)(content.spanish),
    letters: allLetters,
    answer: targetWord,
  };
}

function createFillBlankExercise(
  content: ContentItem,
  pool: ContentItem[],
  theme: string
): FillBlankExercise {
  // Use the example sentence and blank out the key word
  const sentence = content.exampleEn.replace(
    new RegExp(`\\b${escapeRegex(content.english)}\\b`, "i"),
    "___"
  );

  // If we couldn't create a blank (word not in sentence), use a template
  const finalSentence = sentence.includes("___")
    ? sentence
    : `I like ___. (${content.spanish})`;

  const distractors = pool
    .filter((c) => c.id !== content.id && c.type === "vocabulary")
    .slice(0, 3)
    .map((c) => c.english);

  const options = shuffleWithCorrect(content.english, distractors);

  return {
    type: "fill_blank",
    emoji: getThemeEmoji(theme),
    english: content.english,
    spanish: content.spanish,
    hint: content.hint,
    sentence: finalSentence,
    questionEs: pickRandom(FUN_FILL_QUESTIONS),
    options: options.items,
    correctIndex: options.correctIdx,
  };
}

function createMatchingExercise(
  pool: ContentItem[],
  theme: string
): MatchingExercise {
  // Pick 4 random vocabulary items for matching
  const vocabPool = pool.filter((c) => c.type === "vocabulary");
  const items = shuffleArray(vocabPool).slice(0, 4);

  // Ensure we have at least 4 items
  while (items.length < 4) {
    const fallback = pool[items.length % pool.length];
    if (!items.find((i) => i.id === fallback.id)) {
      items.push(fallback);
    } else {
      break;
    }
  }

  return {
    type: "matching",
    emoji: "🎯",
    english: "matching",
    spanish: "emparejar",
    pairs: items.map((item) => ({
      en: item.english,
      es: item.spanish,
    })),
  };
}

function createTranslatePhraseExercise(
  content: ContentItem,
  theme: string
): TranslatePhraseExercise {
  // Use either the phrase itself or the example sentence
  const phrase = content.type === "phrase" ? content.english : content.exampleEn;
  const spanishPhrase = content.type === "phrase" ? content.spanish : content.exampleEs;

  // Split into words
  const words = phrase.replace(/[!?.,']/g, "").split(" ").filter(Boolean);

  // Generate distractor words
  const commonDistractors = ["the", "a", "is", "are", "was", "it", "at", "on", "in", "to", "for", "my", "we", "they"];
  const distractors = shuffleArray(
    commonDistractors.filter((d) => !words.map((w) => w.toLowerCase()).includes(d))
  ).slice(0, Math.min(3, Math.max(2, 6 - words.length)));

  return {
    type: "translate_phrase",
    emoji: getThemeEmoji(theme),
    english: phrase,
    spanish: spanishPhrase,
    questionEs: pickRandom(FUN_TRANSLATE_QUESTIONS)(spanishPhrase),
    words: words,
    answer: words,
    distractors: distractors,
  };
}

// === Utilities ===

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleWithCorrect(
  correct: string,
  distractors: string[]
): { items: string[]; correctIdx: number } {
  // Ensure we have exactly 3 distractors (pad if needed)
  const finalDistractors = [...distractors];
  const fallbacks = ["...", "---", "???"];
  while (finalDistractors.length < 3) {
    finalDistractors.push(fallbacks[finalDistractors.length] || "...");
  }

  // Create array with correct answer and shuffle
  const all = [correct, ...finalDistractors.slice(0, 3)];
  const shuffled = shuffleArray(all);
  const correctIdx = shuffled.indexOf(correct);

  return { items: shuffled, correctIdx };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
