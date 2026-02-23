import type { Streak } from "@/types/gamification";

export interface StreakUpdate {
  action: "continued" | "already_active" | "shield_used" | "reset";
  newStreak: Streak;
  shieldUsed: boolean;
  milestoneReached: number | null;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];
const MAX_SHIELDS = 3;
const SHIELD_EARN_INTERVAL = 7; // earn 1 shield every 7 days

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function checkStreak(current: Streak): StreakUpdate {
  const today = todayISO();

  // Already active today
  if (current.lastActivityDate === today) {
    return {
      action: "already_active",
      newStreak: current,
      shieldUsed: false,
      milestoneReached: null,
    };
  }

  // First ever activity
  if (!current.lastActivityDate) {
    const newStreak: Streak = {
      current: 1,
      best: 1,
      shields: 0,
      lastActivityDate: today,
    };
    return {
      action: "continued",
      newStreak,
      shieldUsed: false,
      milestoneReached: null,
    };
  }

  const daysMissed = daysBetween(current.lastActivityDate, today);

  // Consecutive day
  if (daysMissed === 1) {
    const newCurrent = current.current + 1;
    const earnedShield =
      newCurrent % SHIELD_EARN_INTERVAL === 0 && current.shields < MAX_SHIELDS;

    const newStreak: Streak = {
      current: newCurrent,
      best: Math.max(current.best, newCurrent),
      shields: earnedShield ? current.shields + 1 : current.shields,
      lastActivityDate: today,
    };

    const milestone = STREAK_MILESTONES.find((m) => m === newCurrent) || null;

    return {
      action: "continued",
      newStreak,
      shieldUsed: false,
      milestoneReached: milestone,
    };
  }

  // Missed 1 day — use shield if available
  if (daysMissed === 2 && current.shields > 0) {
    const newCurrent = current.current + 1;
    const newStreak: Streak = {
      current: newCurrent,
      best: Math.max(current.best, newCurrent),
      shields: current.shields - 1,
      lastActivityDate: today,
    };

    const milestone = STREAK_MILESTONES.find((m) => m === newCurrent) || null;

    return {
      action: "shield_used",
      newStreak,
      shieldUsed: true,
      milestoneReached: milestone,
    };
  }

  // Streak broken
  const newStreak: Streak = {
    current: 1,
    best: current.best,
    shields: current.shields,
    lastActivityDate: today,
  };

  return {
    action: "reset",
    newStreak,
    shieldUsed: false,
    milestoneReached: null,
  };
}

export function getStreakMessage(update: StreakUpdate): {
  titleEs: string;
  messageEs: string;
} {
  switch (update.action) {
    case "continued":
      if (update.milestoneReached) {
        return {
          titleEs: `${update.milestoneReached} días seguidos`,
          messageEs: `¡Increíble! Llevas ${update.milestoneReached} días seguidos aprendiendo.`,
        };
      }
      return {
        titleEs: `${update.newStreak.current} días seguidos`,
        messageEs: "¡Sigue así! Cada día cuenta.",
      };
    case "shield_used":
      return {
        titleEs: "Escudo activado",
        messageEs: `Se usó un escudo protector. Tu racha de ${update.newStreak.current} días sigue activa.`,
      };
    case "reset":
      return {
        titleEs: "¡Nueva aventura!",
        messageEs: "Vamos a por otra racha. ¡Tú puedes!",
      };
    case "already_active":
      return {
        titleEs: `${update.newStreak.current} días seguidos`,
        messageEs: "Ya has practicado hoy. ¡Genial!",
      };
  }
}
