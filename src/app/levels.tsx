import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, ProgressBar, Screen, text } from '../components/ui';
import { conceptsIn, LEVELS, TOPICS } from '../content';
import { isMastered } from '../srs/scheduler';
import { useStore } from '../state/store';

export default function Levels() {
  const { state, t } = useStore();
  const profile = state.profile;
  if (!profile) return null;
  const cards = state.cards[profile.target] ?? {};

  return (
    <Screen>
      <Text style={text.title}>{t.levels}</Text>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        {LEVELS.map((level) => {
          const words = conceptsIn(level);
          const learned = words.filter((c) => cards[c.id]).length;
          const mastered = words.filter((c) => cards[c.id] && isMastered(cards[c.id])).length;
          return (
            <Card key={level} style={{ gap: 12 }}>
              <View style={styles.row}>
                <Text style={text.h2}>{t.levelNames[level]}</Text>
                <Text style={text.muted}>
                  {learned}/{words.length}
                </Text>
              </View>
              <ProgressBar value={words.length ? learned / words.length : 0} />
              <Text style={text.muted}>
                {t.mastered}: {mastered}
              </Text>
              {TOPICS.map((topic) => {
                const inTopic = conceptsIn(level, topic);
                if (!inTopic.length) return null;
                const seen = inTopic.filter((c) => cards[c.id]).length;
                return (
                  <View key={topic} style={styles.row}>
                    <Text style={text.body}>{t.topicNames[topic]}</Text>
                    <Text style={text.muted}>
                      {seen}/{inTopic.length}
                    </Text>
                  </View>
                );
              })}
            </Card>
          );
        })}
      </ScrollView>
      <Button label={t.backHome} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
