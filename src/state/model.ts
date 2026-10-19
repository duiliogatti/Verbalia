import type { Lang, Level } from '../content/types';
import type { Day } from '../lib/dates';
import { newCard, review, type CardState, type Grade } from '../srs/scheduler';
import { completeDay, emptyStreak, type Streak } from '../srs/streak';
import { DEFAULT_MAX_REVIEWS, DEFAULT_NEW_PER_DAY } from '../exercises/session';

export interface Profile {
  native: Lang;
  target: Lang;
  level: Level;
  newPerDay: number;
}

export interface AppState {
  version: 1;
  profile: Profile | null;
  /** Cards per target language, keyed by concept id. */
  cards: Partial<Record<Lang, Record<string, CardState>>>;
  streak: Streak;
  /** Answers given per day, for stats. */
  history: Record<Day, number>;
  isPro: boolean;
}

export const initialState: AppState = {
  version: 1,
  profile: null,
  cards: {},
  streak: emptyStreak,
  history: {},
  isPro: false,
};

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'setProfile'; profile: Omit<Profile, 'newPerDay'> & { newPerDay?: number } }
  | { type: 'answer'; conceptId: string; grade: Grade; day: Day }
  | { type: 'completeSession'; day: Day }
  | { type: 'setPro'; isPro: boolean }
  | { type: 'resetTarget' };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'setProfile':
      return {
        ...state,
        profile: {
          newPerDay: state.profile?.newPerDay ?? DEFAULT_NEW_PER_DAY,
          ...action.profile,
        } as Profile,
      };

    case 'answer': {
      const target = state.profile?.target;
      if (!target) return state;
      const deck = state.cards[target] ?? {};
      const card = deck[action.conceptId] ?? newCard(action.day);
      return {
        ...state,
        cards: { ...state.cards, [target]: { ...deck, [action.conceptId]: review(card, action.grade, action.day) } },
        history: { ...state.history, [action.day]: (state.history[action.day] ?? 0) + 1 },
      };
    }

    case 'completeSession':
      return { ...state, streak: completeDay(state.streak, action.day) };

    case 'setPro':
      return { ...state, isPro: action.isPro };

    case 'resetTarget': {
      const target = state.profile?.target;
      if (!target) return state;
      return { ...state, cards: { ...state.cards, [target]: {} } };
    }
  }
}

export function sessionConfig(profile: Profile) {
  return { ...profile, maxReviews: DEFAULT_MAX_REVIEWS };
}
