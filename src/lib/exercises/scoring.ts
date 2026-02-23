import type { ExerciseType } from "@/lib/utils/constants";
import type { PronunciationScore } from "@/types/voice";

export interface ScoreInput {
  exerciseType: ExerciseType;
  userResponse: string;
  expectedResponse: string;
  pronunciationScore?: PronunciationScore;
  timeTakenMs: number;
  hintsUsed: number;
}

export interface ScoreResult {
  isCorrect: boolean;
  accuracy: number;    // 0-1
  qualityScore: number; // 0-5 for SM-2
  xpBase: number;
  feedback: {
    messageEn: string;
    messageEs: string;
    encouragement: string;
  };
}

export function scoreExercise(input: ScoreInput): ScoreResult {
  switch (input.exerciseType) {
    case "echo_challenge":
    case "tongue_twister":
      return scorePronunciation(input);
    case "spy_mission":
      return scoreMultipleChoice(input);
    case "speed_reader":
      return scoreReading(input);
    case "word_builder":
      return scoreTyping(input);
    case "boss_challenge":
      return scoreConversation(input);
    default:
      return scoreTyping(input);
  }
}

function scorePronunciation(input: ScoreInput): ScoreResult {
  const score = input.pronunciationScore?.overall ?? 0;
  const isCorrect = score >= 0.6;
  const quality = scoreToQuality(score);

  let messageEn: string, messageEs: string, encouragement: string;
  if (score >= 0.9) {
    messageEn = "Perfect pronunciation!";
    messageEs = "¡Pronunciación perfecta!";
    encouragement = "You sound amazing!";
  } else if (score >= 0.7) {
    messageEn = "Good pronunciation!";
    messageEs = "¡Buena pronunciación!";
    encouragement = "Almost perfect, keep going!";
  } else if (score >= 0.5) {
    messageEn = "Getting there!";
    messageEs = "¡Vas por buen camino!";
    encouragement = "Try listening again and repeat.";
  } else {
    messageEn = "Let's try again!";
    messageEs = "¡Vamos a intentarlo de nuevo!";
    encouragement = "Listen carefully and try once more.";
  }

  const hintPenalty = input.hintsUsed * 0.1;
  const xpBase = isCorrect ? (score >= 0.9 ? 25 : score >= 0.7 ? 15 : 10) : 5;

  return {
    isCorrect,
    accuracy: Math.max(0, score - hintPenalty),
    qualityScore: quality,
    xpBase,
    feedback: { messageEn, messageEs, encouragement },
  };
}

function scoreMultipleChoice(input: ScoreInput): ScoreResult {
  const isCorrect = normalize(input.userResponse) === normalize(input.expectedResponse);
  return {
    isCorrect,
    accuracy: isCorrect ? 1 : 0,
    qualityScore: isCorrect ? (input.timeTakenMs < 5000 ? 5 : 4) : 1,
    xpBase: isCorrect ? 15 : 5,
    feedback: {
      messageEn: isCorrect ? "Correct!" : `The answer was: ${input.expectedResponse}`,
      messageEs: isCorrect ? "¡Correcto!" : `La respuesta era: ${input.expectedResponse}`,
      encouragement: isCorrect ? "Great job!" : "Don't worry, you'll get it next time!",
    },
  };
}

function scoreReading(input: ScoreInput): ScoreResult {
  const isCorrect = normalize(input.userResponse) === normalize(input.expectedResponse);
  const speedBonus = input.timeTakenMs < 10000 ? 0.1 : 0;
  return {
    isCorrect,
    accuracy: isCorrect ? 1 + speedBonus : 0,
    qualityScore: isCorrect ? (input.timeTakenMs < 8000 ? 5 : 4) : 1,
    xpBase: isCorrect ? 15 : 5,
    feedback: {
      messageEn: isCorrect ? "You got it!" : `The answer was: ${input.expectedResponse}`,
      messageEs: isCorrect ? "¡Lo tienes!" : `La respuesta era: ${input.expectedResponse}`,
      encouragement: isCorrect ? "Fast reader!" : "Try reading it one more time.",
    },
  };
}

function scoreTyping(input: ScoreInput): ScoreResult {
  const spoken = normalize(input.userResponse);
  const expected = normalize(input.expectedResponse);

  if (spoken === expected) {
    return {
      isCorrect: true,
      accuracy: 1,
      qualityScore: input.hintsUsed === 0 ? 5 : 4,
      xpBase: input.hintsUsed === 0 ? 15 : 10,
      feedback: {
        messageEn: "Perfect!",
        messageEs: "¡Perfecto!",
        encouragement: "You spelled it right!",
      },
    };
  }

  // Calculate character similarity
  const distance = levenshteinDistance(spoken, expected);
  const maxLen = Math.max(spoken.length, expected.length);
  const similarity = maxLen > 0 ? 1 - distance / maxLen : 0;
  const isClose = similarity >= 0.7;

  return {
    isCorrect: false,
    accuracy: similarity,
    qualityScore: isClose ? 2 : 0,
    xpBase: 5,
    feedback: {
      messageEn: isClose ? `Close! The correct answer is: ${input.expectedResponse}` : `The answer is: ${input.expectedResponse}`,
      messageEs: isClose ? `¡Casi! La respuesta correcta es: ${input.expectedResponse}` : `La respuesta es: ${input.expectedResponse}`,
      encouragement: isClose ? "So close! Try again." : "No worries, learning takes time!",
    },
  };
}

function scoreConversation(input: ScoreInput): ScoreResult {
  // Boss challenge scoring is simplified here — Claude will evaluate more deeply
  return {
    isCorrect: true,
    accuracy: 0.8,
    qualityScore: 4,
    xpBase: 20,
    feedback: {
      messageEn: "Good conversation!",
      messageEs: "¡Buena conversación!",
      encouragement: "You're getting better at talking!",
    },
  };
}

function scoreToQuality(score: number): number {
  if (score >= 0.95) return 5;
  if (score >= 0.85) return 4;
  if (score >= 0.7) return 3;
  if (score >= 0.5) return 2;
  if (score >= 0.3) return 1;
  return 0;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
