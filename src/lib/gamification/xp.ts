import { RANKS, XP_AWARDS, type RankId } from "@/lib/utils/constants";

export interface XPAwardResult {
  amount: number;
  newTotal: number;
  rankUp: boolean;
  previousRank: RankId;
  newRank: RankId;
}

const RANK_ORDER: RankId[] = ["rookie", "player", "pro", "champion", "legend"];

export function calculateRank(xpTotal: number): RankId {
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (xpTotal >= RANKS[RANK_ORDER[i]].threshold) {
      return RANK_ORDER[i];
    }
  }
  return "rookie";
}

export function getNextRankThreshold(currentRank: RankId): number | null {
  const idx = RANK_ORDER.indexOf(currentRank);
  if (idx >= RANK_ORDER.length - 1) return null;
  return RANKS[RANK_ORDER[idx + 1]].threshold;
}

export function awardXP(
  currentTotal: number,
  eventType: keyof typeof XP_AWARDS,
  multiplier: number = 1
): XPAwardResult {
  const baseAmount = XP_AWARDS[eventType];
  const amount = Math.round(baseAmount * multiplier);
  const newTotal = currentTotal + amount;

  const previousRank = calculateRank(currentTotal);
  const newRank = calculateRank(newTotal);

  return {
    amount,
    newTotal,
    rankUp: newRank !== previousRank,
    previousRank,
    newRank,
  };
}

export function calculateStreakMultiplier(streakDays: number): number {
  if (streakDays <= 1) return 1;
  if (streakDays <= 7) return 1.1;
  if (streakDays <= 14) return 1.2;
  if (streakDays <= 30) return 1.3;
  return 1.5;
}
