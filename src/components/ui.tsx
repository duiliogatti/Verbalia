import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  bg: '#F7F7FB',
  card: '#FFFFFF',
  ink: '#1B1B2F',
  muted: '#6B6B80',
  line: '#E3E3EC',
  primary: '#5B4CF0',
  primarySoft: '#ECEAFE',
  good: '#1F9D55',
  goodSoft: '#E3F6EA',
  bad: '#D64545',
  badSoft: '#FCE8E8',
  warn: '#C27C0E',
  flame: '#F26B1D',
};

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.inner, style]}>{children}</View>
    </SafeAreaView>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.buttonText, variant !== 'primary' && { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Option({
  label,
  onPress,
  state = 'idle',
  disabled,
}: {
  label: string;
  onPress: () => void;
  state?: 'idle' | 'right' | 'wrong';
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.option,
        state === 'right' && { borderColor: colors.good, backgroundColor: colors.goodSoft },
        state === 'wrong' && { borderColor: colors.bad, backgroundColor: colors.badSoft },
      ]}
    >
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }]} />
    </View>
  );
}

export const text = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: colors.ink },
  h2: { fontSize: 20, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, color: colors.ink },
  muted: { fontSize: 14, color: colors.muted },
  big: { fontSize: 34, fontWeight: '700', color: colors.ink, textAlign: 'center' },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: 20, gap: 16 },
  button: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  buttonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  option: {
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionText: { fontSize: 18, color: colors.ink, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 18, gap: 8, borderWidth: 1, borderColor: colors.line },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 },
});
