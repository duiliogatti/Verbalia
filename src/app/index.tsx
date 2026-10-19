import { Redirect, router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, Screen, text } from '../components/ui';
import { CONCEPTS, conceptsFromLevel } from '../content';
import { today } from '../lib/dates';
import { isDue, isMastered } from '../srs/scheduler';
import { visibleStreak } from '../srs/streak';
import { useStore } from '../state/store';

export default function Home() {
  const { state, t } = useStore();
  const profile = state.profile;
  const day = today();

  const stats = useMemo(() => {
    if (!profile) return null;
    const cards = state.cards[profile.target] ?? {};
    const all = Object.values(cards);
    const unseen = conceptsFromLevel(profile.level).filter((c) => !cards[c.id]).length;
    return {
      learned: all.length,
      mastered: all.filter(isMastered).length,
      due: all.filter((c) => isDue(c, day)).length,
      fresh: Math.min(profile.newPerDay, unseen),
    };
  }, [state.cards, profile, day]);

  if (!profile || !stats) return <Redirect href="/onboarding" />;

  const streak = visibleStreak(state.streak, day);
  const doneToday = state.streak.lastActive === day;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <View style={styles.header}>
          <Text style={text.title}>Vocabo</Text>
          <Text style={styles.lang}>{t.langNames[profile.target]}</Text>
        </View>

        <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={styles.flame}>{'\u{1F525}'}</Text>
          <Text style={text.h2}>{t.streakDays(streak)}</Text>
          {state.streak.freezes > 0 && <Text style={text.muted}>{t.freezes(state.streak.freezes)}</Text>}
        </Card>

        <Card>
          {doneToday ? (
            <Text style={[text.body, { color: colors.good, fontWeight: '600' }]}>{t.doneToday}</Text>
          ) : (
            <View style={styles.row}>
              <Text style={text.body}>{t.dueToday(stats.due)}</Text>
              <Text style={text.body}>{t.newToday(stats.fresh)}</Text>
            </View>
          )}
          <Button
            label={doneToday ? t.practiceMore : t.startSession}
            variant={doneToday ? 'secondary' : 'primary'}
            onPress={() => router.push('/session')}
          />
        </Card>

        <View style={styles.row}>
          <Card style={styles.stat}>
            <Text style={text.big}>{stats.learned}</Text>
            <Text style={[text.muted, { textAlign: 'center' }]}>{t.learned}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text style={text.big}>{stats.mastered}</Text>
            <Text style={[text.muted, { textAlign: 'center' }]}>
              {t.mastered} / {CONCEPTS.length}
            </Text>
          </Card>
        </View>

        <Button label={t.levels} variant="secondary" onPress={() => router.push('/levels')} />
        <Button label={t.settings} variant="ghost" onPress={() => router.push('/settings')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  lang: { fontSize: 16, fontWeight: '600', color: colors.primary },
  flame: { fontSize: 44 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  stat: { flex: 1, alignItems: 'center' },
});
