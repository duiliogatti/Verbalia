import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card, colors, Option, ProgressBar, Screen, text } from '../components/ui';
import { getConcept, type Lang } from '../content';
import { checkTyped, type Verdict } from '../exercises/answers';
import { buildSession, gradeFor, retryStep, type Step } from '../exercises/session';
import { today } from '../lib/dates';
import { showSessionEndAd } from '../monetization';
import { sessionConfig } from '../state/model';
import { useStore } from '../state/store';

const VOICES: Record<Lang, string> = { en: 'en-US', es: 'es-ES', fr: 'fr-FR' };

function say(word: string, lang: Lang) {
  Speech.stop();
  Speech.speak(word, { language: VOICES[lang], rate: 0.9 });
}

interface Feedback {
  verdict: Verdict;
  chosen?: string;
}

export default function Session() {
  const { state, dispatch, t } = useStore();
  const profile = state.profile!;
  const cfg = sessionConfig(profile);
  const day = today();

  const [steps, setSteps] = useState<Step[]>(() => buildSession(state.cards[profile.target] ?? {}, cfg, day));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState({ right: 0, total: 0 });
  const graded = useRef(new Set<string>());
  const finished = useRef(false);

  const step = steps[index];
  const concept = step ? getConcept(step.conceptId) : undefined;
  const done = index >= steps.length;

  useEffect(() => {
    if (!step || !concept) return;
    if (step.kind === 'intro' || step.kind === 'listen') say(concept.terms[profile.target].word, profile.target);
  }, [index]);

  useEffect(() => {
    if (done && steps.length > 0 && !finished.current) {
      finished.current = true;
      dispatch({ type: 'completeSession', day });
      showSessionEndAd(state.isPro);
    }
  }, [done]);

  if (done) {
    const pct = score.total ? Math.round((score.right / score.total) * 100) : 0;
    return (
      <Screen style={{ justifyContent: 'center' }}>
        {steps.length === 0 ? (
          <Text style={[text.body, { textAlign: 'center' }]}>{t.nothingToDo}</Text>
        ) : (
          <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Text style={{ fontSize: 56 }}>{'\u{1F389}'}</Text>
            <Text style={text.title}>{t.sessionDone}</Text>
            <Text style={text.body}>{t.reviewed(graded.current.size)}</Text>
            <Text style={text.muted}>{t.accuracy(pct)}</Text>
          </Card>
        )}
        <Button label={t.backHome} onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!step || !concept) return null;

  const target = concept.terms[profile.target];
  const native = concept.terms[profile.native];

  const answer = (verdict: Verdict, chosen?: string) => {
    setFeedback({ verdict, chosen });
    if (step.kind === 'intro' || !step.graded) return;
    if (!graded.current.has(concept.id)) {
      graded.current.add(concept.id);
      dispatch({ type: 'answer', conceptId: concept.id, grade: gradeFor(verdict), day });
      setScore((s) => ({ right: s.right + (verdict === 'wrong' ? 0 : 1), total: s.total + 1 }));
    }
    if (verdict === 'wrong') {
      const retry = retryStep(step, cfg, Math.random);
      if (retry) setSteps((s) => [...s, retry]);
    }
  };

  const next = () => {
    setFeedback(null);
    setTyped('');
    setIndex((i) => i + 1);
  };

  const correctText = step.kind === 'choice' ? concept.terms[step.to].word : target.word;

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.quit}>{'✕'}</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar value={index / steps.length} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ gap: 16, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {step.kind === 'intro' && (
            <Card style={{ gap: 14, paddingVertical: 28 }}>
              <Text style={styles.badge}>{t.newWord}</Text>
              <Pressable onPress={() => say(target.word, profile.target)} accessibilityLabel={t.playAudio}>
                <Text style={text.big}>{target.word} {'\u{1F50A}'}</Text>
              </Pressable>
              <Text style={[text.h2, { textAlign: 'center', color: colors.muted }]}>{native.word}</Text>
              <View style={styles.example}>
                <Text style={text.body}>{target.example}</Text>
                <Text style={text.muted}>{native.example}</Text>
              </View>
            </Card>
          )}

          {step.kind === 'choice' && (
            <>
              <Text style={text.muted}>{step.from === profile.target ? t.whatDoesItMean : t.howDoYouSay}</Text>
              <Text style={text.big}>{concept.terms[step.from].word}</Text>
              <View style={{ gap: 10 }}>
                {step.options.map((o) => (
                  <Option
                    key={o}
                    label={o}
                    disabled={!!feedback}
                    state={!feedback ? 'idle' : o === correctText ? 'right' : o === feedback.chosen ? 'wrong' : 'idle'}
                    onPress={() => answer(o === correctText ? 'correct' : 'wrong', o)}
                  />
                ))}
              </View>
            </>
          )}

          {step.kind === 'listen' && (
            <>
              <Text style={text.muted}>{t.listenAndPick}</Text>
              <Button label={`\u{1F50A}  ${t.playAudio}`} variant="secondary" onPress={() => say(target.word, profile.target)} />
              <View style={{ gap: 10 }}>
                {step.options.map((o) => (
                  <Option
                    key={o}
                    label={o}
                    disabled={!!feedback}
                    state={!feedback ? 'idle' : o === target.word ? 'right' : o === feedback.chosen ? 'wrong' : 'idle'}
                    onPress={() => answer(o === target.word ? 'correct' : 'wrong', o)}
                  />
                ))}
              </View>
            </>
          )}

          {step.kind === 'typing' && (
            <>
              <Text style={text.muted}>{t.typeIn(t.langNames[profile.target])}</Text>
              <Text style={text.big}>{native.word}</Text>
              <TextInput
                style={styles.input}
                value={typed}
                onChangeText={setTyped}
                placeholder={t.typeHere}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!feedback}
                onSubmitEditing={() => typed && !feedback && answer(checkTyped(typed, target.word, profile.target))}
              />
            </>
          )}
        </ScrollView>

        {feedback && step.kind !== 'intro' && (
          <View style={[styles.feedback, { backgroundColor: feedback.verdict === 'wrong' ? colors.badSoft : colors.goodSoft }]}>
            <Text style={[styles.feedbackTitle, { color: feedback.verdict === 'wrong' ? colors.bad : colors.good }]}>
              {feedback.verdict === 'correct' ? t.correct : feedback.verdict === 'accent' ? t.almost : t.wrong}
            </Text>
            {feedback.verdict !== 'correct' && <Text style={text.h2}>{correctText}</Text>}
            <Text style={text.muted}>{target.example}</Text>
          </View>
        )}

        <View style={{ paddingTop: 12 }}>
          {step.kind === 'intro' || feedback ? (
            <Button label={t.continue} onPress={next} />
          ) : step.kind === 'typing' ? (
            <Button label={t.check} disabled={!typed.trim()} onPress={() => answer(checkTyped(typed, target.word, profile.target))} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  quit: { fontSize: 22, color: colors.muted },
  badge: { alignSelf: 'center', color: colors.primary, fontWeight: '700', textTransform: 'uppercase', fontSize: 13 },
  example: { backgroundColor: colors.bg, borderRadius: 12, padding: 14, gap: 4 },
  input: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: colors.card,
    padding: 16,
    fontSize: 20,
    color: colors.ink,
  },
  feedback: { borderRadius: 16, padding: 16, gap: 6, marginTop: 12 },
  feedbackTitle: { fontSize: 17, fontWeight: '700' },
});
