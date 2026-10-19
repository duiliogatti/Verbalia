// Content model: a concept exists once; each language only adds its own word
// for it. Adding a language means adding a column to the concept table, not
// changing app code.

export const LANGUAGES = ['en', 'es', 'fr'] as const;
export type Lang = (typeof LANGUAGES)[number];

export const LEVELS = ['A1', 'A2', 'B1'] as const;
export type Level = (typeof LEVELS)[number];

export const TOPICS = [
  'basics',
  'people',
  'food',
  'home',
  'travel',
  'work',
  'nature',
  'time',
  'feelings',
  'actions',
] as const;
export type Topic = (typeof TOPICS)[number];

export type PartOfSpeech = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase';

export interface Term {
  /** The word as taught, including its article for nouns ("le chien"). */
  word: string;
  /** One example sentence using the word. */
  example: string;
}

export interface Concept {
  id: string;
  level: Level;
  topic: Topic;
  pos: PartOfSpeech;
  terms: Record<Lang, Term>;
}
