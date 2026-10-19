import { CONCEPTS } from './concepts';
import { LEVELS, type Concept, type Lang, type Level, type Topic } from './types';

export * from './types';
export { CONCEPTS };

const byId = new Map(CONCEPTS.map((c) => [c.id, c]));

export function getConcept(id: string): Concept | undefined {
  return byId.get(id);
}

/** Concepts from `level` upward, easiest first, in curriculum order. */
export function conceptsFromLevel(level: Level): Concept[] {
  const start = LEVELS.indexOf(level);
  return CONCEPTS.filter((c) => LEVELS.indexOf(c.level) >= start).sort(
    (a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level),
  );
}

export function conceptsIn(level: Level, topic?: Topic): Concept[] {
  return CONCEPTS.filter((c) => c.level === level && (!topic || c.topic === topic));
}

export function wordIn(concept: Concept, lang: Lang): string {
  return concept.terms[lang].word;
}
