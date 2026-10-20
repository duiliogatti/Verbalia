import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react';

import { LANGUAGES, type Lang } from '../content/types';
import { STRINGS, type Strings } from '../i18n/strings';
import { initialState, reducer, type Action, type AppState } from './model';

const STORAGE_KEY = 'verbalia/state/v1';

interface Store {
  state: AppState;
  dispatch: Dispatch<Action>;
  /** Interface text in the learner's language. */
  t: Strings;
}

const StoreContext = createContext<Store | null>(null);

export function deviceLang(): Lang {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return (LANGUAGES as readonly string[]).includes(code) ? (code as Lang) : 'en';
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) dispatch({ type: 'hydrate', state: { ...initialState, ...JSON.parse(raw) } });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  if (!loaded) return null;

  const t = STRINGS[state.profile?.native ?? deviceLang()];
  return <StoreContext.Provider value={{ state, dispatch, t }}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
