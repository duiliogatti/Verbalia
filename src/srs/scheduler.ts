import { addDays, type Day } from '../lib/dates';

// Spaced repetition based on SM-2: each correct answer pushes the next review
// further out, a mistake brings the word back tomorrow and makes it "harder".

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  due: Day;
  lastReviewed: Day;
}

export const MIN_EASE = 1.3;
export const START_EASE = 2.5;
/** A word counts as mastered once its review interval reaches three weeks. */
export const MASTERED_INTERVAL = 21;

export function newCard(day: Day): CardState {
  return { ease: START_EASE, intervalDays: 0, reps: 0, lapses: 0, due: day, lastReviewed: day };
}

export function review(card: CardState, grade: Grade, day: Day): CardState {
  if (grade === 'again') {
    return {
      ...card,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      intervalDays: 1,
      reps: 0,
      lapses: card.lapses + 1,
      due: addDays(day, 1),
      lastReviewed: day,
    };
  }

  const easeDelta = { hard: -0.15, good: 0, easy: 0.15 }[grade];
  const ease = Math.max(MIN_EASE, card.ease + easeDelta);

  let interval: number;
  if (card.reps === 0) interval = grade === 'easy' ? 3 : 1;
  else if (card.reps === 1) interval = grade === 'hard' ? 3 : grade === 'easy' ? 8 : 6;
  else {
    const factor = grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease;
    interval = Math.max(card.intervalDays + 1, Math.round(card.intervalDays * factor));
  }

  return {
    ease,
    intervalDays: interval,
    reps: card.reps + 1,
    lapses: card.lapses,
    due: addDays(day, interval),
    lastReviewed: day,
  };
}

export function isDue(card: CardState, day: Day): boolean {
  return card.due <= day;
}

export function isMastered(card: CardState): boolean {
  return card.intervalDays >= MASTERED_INTERVAL;
}
