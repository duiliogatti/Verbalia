import { CONCEPTS, conceptsFromLevel, getConcept, type Concept, type Lang, type Level } from '../content';
import type { Day } from '../lib/dates';
import { isDue, type CardState, type Grade } from '../srs/scheduler';
import type { Verdict } from './answers';

export type Rng = () => number;

export type Step =
  | { kind: 'intro'; conceptId: string }
  /** Show the word in `from`, pick its translation in `to`. */
  | { kind: 'choice'; conceptId: string; from: Lang; to: Lang; options: string[]; graded: boolean }
  /** Hear the target word, pick how it is written. */
  | { kind: 'listen'; conceptId: string; options: string[]; graded: boolean }
  /** See the native word, type it in the target language. */
  | { kind: 'typing'; conceptId: string; graded: boolean };

export interface SessionConfig {
  native: Lang;
  target: Lang;
  level: Level;
  newPerDay: number;
  maxReviews: number;
}

export const DEFAULT_NEW_PER_DAY = 7;
export const DEFAULT_MAX_REVIEWS = 20;

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Four options: the right word plus three distinct distractors, same part of speech when possible. */
export function optionsFor(concept: Concept, lang: Lang, rng: Rng): string[] {
  const answer = concept.terms[lang].word;
  const others = shuffle(
    CONCEPTS.filter((c) => c.id !== concept.id && c.terms[lang].word !== answer),
    rng,
  ).sort((a, b) => Number(b.pos === concept.pos) - Number(a.pos === concept.pos));

  const picked: string[] = [];
  for (const c of others) {
    const w = c.terms[lang].word;
    if (!picked.includes(w)) picked.push(w);
    if (picked.length === 3) break;
  }
  return shuffle([answer, ...picked], rng);
}

function reviewStep(concept: Concept, card: CardState, cfg: SessionConfig, rng: Rng): Step {
  const id = concept.id;
  if (card.reps < 2) {
    return rng() < 0.5
      ? { kind: 'choice', conceptId: id, from: cfg.target, to: cfg.native, options: optionsFor(concept, cfg.native, rng), graded: true }
      : { kind: 'listen', conceptId: id, options: optionsFor(concept, cfg.target, rng), graded: true };
  }
  return rng() < 0.5
    ? { kind: 'choice', conceptId: id, from: cfg.native, to: cfg.target, options: optionsFor(concept, cfg.target, rng), graded: true }
    : { kind: 'typing', conceptId: id, graded: true };
}

/**
 * Today's session: due reviews (oldest first, capped) mixed with a few new
 * words. New words get an intro card followed by an easy recognition question.
 */
export function buildSession(
  cards: Record<string, CardState>,
  cfg: SessionConfig,
  day: Day,
  rng: Rng = Math.random,
): Step[] {
  const due = Object.entries(cards)
    .filter(([, card]) => isDue(card, day))
    .sort(([, a], [, b]) => a.due.localeCompare(b.due))
    .slice(0, cfg.maxReviews)
    .flatMap(([id, card]) => {
      const concept = getConcept(id);
      return concept ? [reviewStep(concept, card, cfg, rng)] : [];
    });

  const fresh = conceptsFromLevel(cfg.level)
    .filter((c) => !cards[c.id])
    .slice(0, cfg.newPerDay);

  const newBlocks: Step[][] = fresh.map((c) => [
    { kind: 'intro', conceptId: c.id },
    { kind: 'choice', conceptId: c.id, from: cfg.target, to: cfg.native, options: optionsFor(c, cfg.native, rng), graded: true },
  ]);

  // Interleave so a session never starts with a long run of reviews.
  const reviews = shuffle(due, rng);
  const steps: Step[] = [];
  while (reviews.length || newBlocks.length) {
    steps.push(...reviews.splice(0, 3));
    const block = newBlocks.shift();
    if (block) steps.push(...block);
  }
  return steps;
}

/** A missed word comes back once near the end of the session, ungraded. */
export function retryStep(step: Step, cfg: SessionConfig, rng: Rng): Step | null {
  if (step.kind === 'intro' || !step.graded) return null;
  const concept = getConcept(step.conceptId);
  if (!concept) return null;
  return {
    kind: 'choice',
    conceptId: concept.id,
    from: cfg.native,
    to: cfg.target,
    options: optionsFor(concept, cfg.target, rng),
    graded: false,
  };
}

export function gradeFor(verdict: Verdict): Grade {
  return verdict === 'correct' ? 'good' : verdict === 'accent' ? 'hard' : 'again';
}
