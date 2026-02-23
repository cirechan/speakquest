export interface FlowState {
  recentResults: boolean[]; // last N exercise results (true = correct)
  currentDifficultyScore: number;
  adjustmentCount: number;
}

export interface DifficultyAdjustment {
  direction: "up" | "down" | "maintain";
  newScore: number;
  reason: string;
}

const FLOW_MIN = 0.65; // Below this = too hard
const FLOW_MAX = 0.85; // Above this = too easy
const WINDOW_SIZE = 5;  // Rolling window of last N exercises
const ADJUSTMENT_STEP = 5;
const MIN_DIFFICULTY = 5;
const MAX_DIFFICULTY = 95;

export function createFlowState(startingDifficulty: number): FlowState {
  return {
    recentResults: [],
    currentDifficultyScore: startingDifficulty,
    adjustmentCount: 0,
  };
}

export function adjustDifficulty(state: FlowState): DifficultyAdjustment {
  const window = state.recentResults.slice(-WINDOW_SIZE);
  if (window.length < 3) {
    return { direction: "maintain", newScore: state.currentDifficultyScore, reason: "not enough data" };
  }

  const accuracy = window.filter(Boolean).length / window.length;

  if (accuracy > FLOW_MAX) {
    const newScore = Math.min(MAX_DIFFICULTY, state.currentDifficultyScore + ADJUSTMENT_STEP);
    return { direction: "up", newScore, reason: `accuracy ${(accuracy * 100).toFixed(0)}% > ${FLOW_MAX * 100}%` };
  }

  if (accuracy < FLOW_MIN) {
    const newScore = Math.max(MIN_DIFFICULTY, state.currentDifficultyScore - ADJUSTMENT_STEP);
    return { direction: "down", newScore, reason: `accuracy ${(accuracy * 100).toFixed(0)}% < ${FLOW_MIN * 100}%` };
  }

  return { direction: "maintain", newScore: state.currentDifficultyScore, reason: "in flow" };
}

export function recordResult(state: FlowState, isCorrect: boolean): FlowState {
  const newResults = [...state.recentResults, isCorrect].slice(-WINDOW_SIZE * 2);
  const adjustment = adjustDifficulty({ ...state, recentResults: newResults });

  return {
    recentResults: newResults,
    currentDifficultyScore: adjustment.newScore,
    adjustmentCount: adjustment.direction !== "maintain"
      ? state.adjustmentCount + 1
      : state.adjustmentCount,
  };
}
