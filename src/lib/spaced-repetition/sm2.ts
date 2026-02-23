/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality ratings:
 *   0 - Complete blackout, no recognition
 *   1 - Incorrect response, but upon seeing the correct answer, remembered
 *   2 - Incorrect response, but the correct answer seemed easy to recall
 *   3 - Correct response with serious difficulty
 *   4 - Correct response after hesitation
 *   5 - Perfect response with no hesitation
 */

export interface SM2State {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
}

export interface SM2Result {
  newState: SM2State;
  nextReviewDate: Date;
  isCorrect: boolean;
}

const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;

export function sm2(state: SM2State, quality: number): SM2Result {
  const q = Math.min(5, Math.max(0, Math.round(quality)));
  const isCorrect = q >= 3;

  let { repetitions, easeFactor, intervalDays } = state;

  if (isCorrect) {
    // Correct response
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  if (easeFactor < MIN_EASE_FACTOR) {
    easeFactor = MIN_EASE_FACTOR;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return {
    newState: { repetitions, easeFactor, intervalDays },
    nextReviewDate,
    isCorrect,
  };
}

export function createInitialSM2State(): SM2State {
  return {
    repetitions: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    intervalDays: 0,
  };
}

/**
 * Convert exercise accuracy (0-1) to SM-2 quality rating (0-5)
 */
export function accuracyToQuality(accuracy: number, timeMs: number, targetTimeMs: number = 5000): number {
  if (accuracy < 0.3) return 0;
  if (accuracy < 0.5) return 1;
  if (accuracy < 0.7) return 2;

  // 3-5 depend on accuracy and speed
  const speedFactor = timeMs <= targetTimeMs ? 1 : Math.max(0, 1 - (timeMs - targetTimeMs) / targetTimeMs);
  const combined = accuracy * 0.7 + speedFactor * 0.3;

  if (combined < 0.75) return 3;
  if (combined < 0.9) return 4;
  return 5;
}
