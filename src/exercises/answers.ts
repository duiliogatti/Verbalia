import type { Lang } from '../content/types';

export type Verdict = 'correct' | 'accent' | 'wrong';

// Leading words a learner may leave out when typing an answer.
const OPTIONAL_PREFIXES: Record<Lang, string[]> = {
  en: ['the ', 'a ', 'an ', 'to '],
  es: ['el ', 'la ', 'los ', 'las ', 'un ', 'una '],
  fr: ['le ', 'la ', 'les ', "l'", 'un ', 'une '],
};

function clean(text: string, lang: Lang): string {
  let s = text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[¿?¡!.,;:"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const prefix of OPTIONAL_PREFIXES[lang]) {
    if (s.startsWith(prefix)) {
      s = s.slice(prefix.length).trim();
      break;
    }
  }
  return s;
}

function stripAccents(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe');
}

/** Checks a typed answer. Missing accents still count, but are pointed out. */
export function checkTyped(typed: string, expected: string, lang: Lang): Verdict {
  const a = clean(typed, lang);
  const b = clean(expected, lang);
  if (!a) return 'wrong';
  if (a === b) return 'correct';
  if (stripAccents(a) === stripAccents(b)) return 'accent';
  return 'wrong';
}
