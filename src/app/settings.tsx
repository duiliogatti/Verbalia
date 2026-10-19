import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, Screen, text } from '../components/ui';
import { purchasePro, restorePro } from '../monetization';
import { useStore } from '../state/store';

const NEW_PER_DAY_OPTIONS = [3, 5, 7, 10, 15];

export default function Settings() {
  const { state, dispatch, t } = useStore();
  const profile = state.profile;
  if (!profile) return null;

  const buy = async () => {
    const result = await purchasePro();
    if (result === 'purchased') dispatch({ type: 'setPro', isPro: true });
    else if (result === 'unavailable') Alert.alert(t.pro, t.storeUnavailable);
  };

  const restore = async () => {
    if (await restorePro()) dispatch({ type: 'setPro', isPro: true });
    else Alert.alert(t.pro, t.storeUnavailable);
  };

  const reset = () =>
    Alert.alert(t.resetProgress, t.resetConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.resetProgress, style: 'destructive', onPress: () => dispatch({ type: 'resetTarget' }) },
    ]);

  return (
    <Screen>
      <Text style={text.title}>{t.settings}</Text>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <Card>
          <Text style={text.h2}>{t.language}</Text>
          <Text style={text.muted}>
            {t.langNames[profile.native]} → {t.langNames[profile.target]} · {t.levelNames[profile.level]}
          </Text>
          <Button label={t.change} variant="secondary" onPress={() => router.push('/onboarding')} />
        </Card>

        <Card>
          <Text style={text.h2}>{t.newPerDay}</Text>
          <View style={styles.row}>
            {NEW_PER_DAY_OPTIONS.map((n) => (
              <View key={n} style={{ flex: 1 }}>
                <Button
                  label={String(n)}
                  variant={profile.newPerDay === n ? 'primary' : 'secondary'}
                  onPress={() => dispatch({ type: 'setProfile', profile: { ...profile, newPerDay: n } })}
                />
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={text.h2}>{t.pro}</Text>
          {state.isPro ? (
            <Text style={[text.body, { color: colors.good }]}>{t.youArePro}</Text>
          ) : (
            <>
              <Text style={text.muted}>{t.proPitch}</Text>
              <Button label={t.buyPro} onPress={buy} />
              <Button label={t.restore} variant="ghost" onPress={restore} />
            </>
          )}
        </Card>

        <Button label={t.resetProgress} variant="ghost" onPress={reset} />
      </ScrollView>
      <Button label={t.backHome} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
});
