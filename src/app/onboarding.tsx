import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, colors, Screen, text } from '../components/ui';
import { LANGUAGES, LEVELS, type Lang, type Level } from '../content/types';
import { STRINGS } from '../i18n/strings';
import { deviceLang, useStore } from '../state/store';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Choice<T extends string>({
  values,
  selected,
  label,
  onSelect,
  disabled = [],
}: {
  values: readonly T[];
  selected: T;
  label: (v: T) => string;
  onSelect: (v: T) => void;
  disabled?: T[];
}) {
  return (
    <View style={styles.row}>
      {values.map((v) => {
        const off = disabled.includes(v);
        return (
          <Pressable
            key={v}
            accessibilityRole="button"
            accessibilityState={{ selected: v === selected, disabled: off }}
            disabled={off}
            onPress={() => onSelect(v)}
            style={[styles.chip, v === selected && styles.chipOn, off && { opacity: 0.35 }]}
          >
            <Text style={[styles.chipText, v === selected && { color: colors.primary }]}>{label(v)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Onboarding() {
  const { state, dispatch } = useStore();
  const [native, setNative] = useState<Lang>(state.profile?.native ?? deviceLang());
  const [target, setTarget] = useState<Lang>(state.profile?.target ?? (native === 'en' ? 'es' : 'en'));
  const [level, setLevel] = useState<Level>(state.profile?.level ?? 'A1');

  // The interface switches language as soon as the learner picks theirs.
  const t = STRINGS[native];

  const pickNative = (lang: Lang) => {
    setNative(lang);
    if (lang === target) setTarget(LANGUAGES.find((l) => l !== lang)!);
  };

  const save = () => {
    dispatch({ type: 'setProfile', profile: { native, target, level } });
    router.replace('/');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 24, paddingBottom: 24 }}>
        <View style={{ gap: 6, marginTop: 24 }}>
          <Text style={text.title}>Verbalia</Text>
          <Text style={text.muted}>{t.tagline}</Text>
        </View>

        <View style={styles.section}>
          <Text style={text.h2}>{t.iSpeak}</Text>
          <Choice values={LANGUAGES} selected={native} label={(l) => capitalize(STRINGS[l].langNames[l])} onSelect={pickNative} />
        </View>

        <View style={styles.section}>
          <Text style={text.h2}>{t.iWantToLearn}</Text>
          <Choice values={LANGUAGES} selected={target} label={(l) => t.langNames[l]} onSelect={setTarget} disabled={[native]} />
        </View>

        <View style={styles.section}>
          <Text style={text.h2}>{t.myLevel}</Text>
          <Choice values={LEVELS} selected={level} label={(l) => t.levelNames[l]} onSelect={setLevel} />
        </View>
      </ScrollView>
      <Button label={t.start} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipText: { fontSize: 16, fontWeight: '600', color: colors.ink },
});
