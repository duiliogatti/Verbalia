import { daysBetween, type Day } from '../lib/dates';

export interface Streak {
  current: number;
  longest: number;
  lastActive: Day | null;
  /** Each freeze covers one missed day automatically. */
  freezes: number;
}

export const MAX_FREEZES = 2;
/** A freeze is earned every this many days of streak. */
export const FREEZE_EVERY = 7;

export const emptyStreak: Streak = { current: 0, longest: 0, lastActive: null, freezes: 0 };

/** Records a completed daily session on `day`. */
export function completeDay(streak: Streak, day: Day): Streak {
  if (streak.lastActive === day) return streak;

  let current = 1;
  let freezes = streak.freezes;
  if (streak.lastActive) {
    const missed = daysBetween(streak.lastActive, day) - 1;
    if (missed <= 0) current = streak.current + 1;
    else if (missed <= freezes) {
      freezes -= missed;
      current = streak.current + 1;
    }
  }

  if (current % FREEZE_EVERY === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);

  return { current, longest: Math.max(streak.longest, current), lastActive: day, freezes };
}

/** The streak to show on `day`: zero once it is broken beyond the freezes. */
export function visibleStreak(streak: Streak, day: Day): number {
  if (!streak.lastActive) return 0;
  const missed = daysBetween(streak.lastActive, day) - 1;
  return missed <= streak.freezes ? streak.current : 0;
}
