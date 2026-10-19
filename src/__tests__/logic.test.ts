import { describe, expect, it } from '@jest/globals';
import { CONCEPTS, LANGUAGES } from '../content';
import { checkTyped } from '../exercises/answers';
import { buildSession, optionsFor, retryStep } from '../exercises/session';
import { addDays, daysBetween } from '../lib/dates';
import { isMastered, MASTERED_INTERVAL, newCard, review } from '../srs/scheduler';
import { completeDay, emptyStreak, visibleStreak } from '../srs/streak';
import { initialState, reducer } from '../state/model';

// Deterministic random numbers so sessions are reproducible.
function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const DAY = '2026-10-20';
const cfg = { native: 'es' as const, target: 'en' as const, level: 'A1' as const, newPerDay: 7, maxReviews: 20 };

describe('content', () => {
  it('has unique ids and every word and example in every language', () => {
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(CONCEPTS.length);
    for (const c of CONCEPTS) {
      for (const lang of LANGUAGES) {
        expect(c.terms[lang].word.trim()).not.toBe('');
        expect(c.terms[lang].example.trim()).not.toBe('');
      }
    }
  });
});

describe('dates', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-02-27', '2026-03-02')).toBe(3);
  });
});

describe('scheduler', () => {
  it('spaces reviews out and reaches mastery after repeated success', () => {
    let card = newCard(DAY);
    const intervals: number[] = [];
    let day = DAY;
    while (!isMastered(card)) {
      card = review(card, 'good', day);
      intervals.push(card.intervalDays);
      day = card.due;
    }
    expect(intervals.slice(0, 3)).toEqual([1, 6, 15]);
    expect(card.intervalDays).toBeGreaterThanOrEqual(MASTERED_INTERVAL);
  });

  it('brings a forgotten word back tomorrow and lowers its ease', () => {
    const learned = review(review(newCard(DAY), 'good', DAY), 'good', DAY);
    const lapsed = review(learned, 'again', DAY);
    expect(lapsed.due).toBe(addDays(DAY, 1));
    expect(lapsed.reps).toBe(0);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.ease).toBeLessThan(learned.ease);
  });
});

describe('streak', () => {
  it('grows on consecutive days and ignores a second session the same day', () => {
    let s = completeDay(emptyStreak, '2026-10-01');
    s = completeDay(s, '2026-10-01');
    s = completeDay(s, '2026-10-02');
    expect(s.current).toBe(2);
  });

  it('uses a freeze for a missed day, and resets without one', () => {
    let s = emptyStreak;
    for (let i = 0; i < 7; i++) s = completeDay(s, addDays('2026-10-01', i));
    expect(s.freezes).toBe(1);

    const saved = completeDay(s, addDays(s.lastActive!, 2));
    expect(saved.current).toBe(8);
    expect(saved.freezes).toBe(0);

    const broken = completeDay(saved, addDays(saved.lastActive!, 2));
    expect(broken.current).toBe(1);
    expect(broken.longest).toBe(8);
  });

  it('shows zero once the streak is broken', () => {
    const s = completeDay(emptyStreak, '2026-10-01');
    expect(visibleStreak(s, '2026-10-02')).toBe(1);
    expect(visibleStreak(s, '2026-10-03')).toBe(0);
  });
});

describe('typed answers', () => {
  it('accepts answers with or without articles and punctuation', () => {
    expect(checkTyped('chien', 'le chien', 'fr')).toBe('correct');
    expect(checkTyped('Le chien', 'le chien', 'fr')).toBe('correct');
    expect(checkTyped('eat', 'to eat', 'en')).toBe('correct');
    expect(checkTyped('arbre', "l'arbre", 'fr')).toBe('correct');
  });

  it('flags missing accents but counts them', () => {
    expect(checkTyped('arbol', 'el árbol', 'es')).toBe('accent');
    expect(checkTyped('soeur', 'la sœur', 'fr')).toBe('accent');
  });

  it('rejects wrong or empty answers', () => {
    expect(checkTyped('gato', 'el perro', 'es')).toBe('wrong');
    expect(checkTyped('  ', 'el perro', 'es')).toBe('wrong');
  });
});

describe('session', () => {
  it('starts a new learner with intro cards and new words only', () => {
    const steps = buildSession({}, cfg, DAY, seeded());
    expect(steps.filter((s) => s.kind === 'intro')).toHaveLength(7);
    expect(steps).toHaveLength(14);
    expect(steps[0].kind).toBe('intro');
  });

  it('includes due reviews and skips cards that are not due', () => {
    const cards = {
      dog: { ...newCard(DAY), reps: 1, intervalDays: 1, due: DAY },
      cat: { ...newCard(DAY), reps: 1, intervalDays: 6, due: addDays(DAY, 3) },
    };
    const steps = buildSession(cards, { ...cfg, newPerDay: 0 }, DAY, seeded());
    expect(steps.map((s) => s.conceptId)).toEqual(['dog']);
  });

  it('builds four distinct options that include the answer', () => {
    const dog = CONCEPTS.find((c) => c.id === 'dog')!;
    const options = optionsFor(dog, 'fr', seeded(7));
    expect(options).toHaveLength(4);
    expect(new Set(options).size).toBe(4);
    expect(options).toContain('le chien');
  });

  it('retries missed words ungraded', () => {
    const [, choice] = buildSession({}, cfg, DAY, seeded());
    const retry = retryStep(choice, cfg, seeded());
    expect(retry && retry.kind !== 'intro' && retry.graded).toBe(false);
  });
});

describe('state', () => {
  it('records answers on the current target language', () => {
    let s = reducer(initialState, { type: 'setProfile', profile: { native: 'es', target: 'fr', level: 'A1' } });
    s = reducer(s, { type: 'answer', conceptId: 'dog', grade: 'good', day: DAY });
    expect(s.cards.fr?.dog.reps).toBe(1);
    expect(s.history[DAY]).toBe(1);
    expect(s.profile?.newPerDay).toBe(7);
  });
});
