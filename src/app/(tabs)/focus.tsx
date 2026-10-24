import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
  CoinBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors, PenguinObsidianTheme } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import {
  AmbientSoundscapeType,
  playSound,
  startAmbientSoundscape,
  stopAmbientSoundscape,
} from '@/utils/sound';

const DURATION_PRESETS = [
  { label: '5m Micro', minutes: 5, tag: 'ADHD Easy Start' },
  { label: '15m Sprint', minutes: 15, tag: 'Flow Builder' },
  { label: '25m Pomodoro', minutes: 25, tag: '2x Bonus XP' },
  { label: '45m Deep', minutes: 45, tag: 'Master Focus' },
];

const AMBIENT_SOUNDS: {
  id: AmbientSoundscapeType;
  label: string;
  emoji: string;
}[] = [
  { id: 'none', label: 'Silent', emoji: '🔇' },
  { id: 'rain', label: 'Cozy Rain', emoji: '🌧️' },
  { id: 'wind', label: 'Arctic Wind', emoji: '❄️' },
  { id: 'brown', label: 'ADHD Brown', emoji: '🎧' },
  { id: 'binaural', label: 'Alpha Wave', emoji: '🌊' },
];

export default function FocusTimerScreen() {
  const habits = usePenguStore((s) => s.habits);
  const focusSessionsCompleted = usePenguStore((s) => s.focusSessionsCompleted);
  const totalFocusMinutes = usePenguStore((s) => s.totalFocusMinutes);
  const completeFocusSession = usePenguStore((s) => s.completeFocusSession);

  const activeBuildHabits = habits.filter(
    (h) => !h.archived && (h.habitType ?? 'build') === 'build'
  );

  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [linkedHabitId, setLinkedHabitId] = useState<string | null>(
    activeBuildHabits[0]?.id ?? null
  );
  const [ambientMode, setAmbientMode] = useState<AmbientSoundscapeType>('none');
  const [showCelebrationBlast, setShowCelebrationBlast] = useState(false);
  const [blastKey, setBlastKey] = useState(1);

  useEffect(() => {
    return () => {
      stopAmbientSoundscape();
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          stopAmbientSoundscape();
          playSound('timerDone');
          playSound('celebration');
          completeFocusSession(selectedMinutes, linkedHabitId);
          setShowCelebrationBlast(true);
          setBlastKey((k) => k + 1);
          return selectedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    completeFocusSession,
    isRunning,
    linkedHabitId,
    selectedMinutes,
  ]);

  const handleSelectDuration = (mins: number) => {
    playSound('tap');
    setIsRunning(false);
    stopAmbientSoundscape();
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleToggleStart = () => {
    if (!isRunning) {
      playSound('timerStart');
      setShowCelebrationBlast(false);
      setIsRunning(true);
      if (ambientMode !== 'none') {
        startAmbientSoundscape(ambientMode);
      }
    } else {
      playSound('tap');
      setIsRunning(false);
      stopAmbientSoundscape();
    }
  };

  const handleQuickFinishDemo = () => {
    setIsRunning(false);
    stopAmbientSoundscape();
    playSound('timerDone');
    playSound('celebration');
    completeFocusSession(selectedMinutes, linkedHabitId);
    setShowCelebrationBlast(true);
    setBlastKey((k) => k + 1);
    setSecondsLeft(selectedMinutes * 60);
  };

  const handleSelectAmbient = (mode: AmbientSoundscapeType) => {
    playSound('tap');
    setAmbientMode(mode);
    if (isRunning) {
      startAmbientSoundscape(mode);
    }
  };

  const totalSecs = selectedMinutes * 60;
  const progressRatio =
    totalSecs > 0 ? (totalSecs - secondsLeft) / totalSecs : 0;
  const minsPart = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const secsPart = (secondsLeft % 60).toString().padStart(2, '0');

  const ringSize = 265;
  const strokeWidth = 12;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ConfettiBlast visible={showCelebrationBlast} triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Focus with Pingu</Text>
            <Text style={styles.pageSub}>
              ADHD Body-Doubling • 2x XP & Coins
            </Text>
          </View>
          <CoinBadge />
        </View>

        {/* Duration Presets */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}>
          {DURATION_PRESETS.map((p) => {
            const active = selectedMinutes === p.minutes;
            return (
              <Pressable
                key={p.minutes}
                onPress={() => handleSelectDuration(p.minutes)}
                style={[styles.presetChip, active && styles.presetChipActive]}>
                <Text
                  style={[
                    styles.presetLabel,
                    active && styles.presetLabelActive,
                  ]}>
                  {p.label}
                </Text>
                <Text
                  style={[styles.presetTag, active && styles.presetTagActive]}>
                  {p.tag}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Central Circular Timer + Pingu Body-Doubling Stage */}
        <View style={styles.timerStageCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <View style={styles.auroraOverlay} />

          <View style={styles.ringWrapper}>
            <Svg width={ringSize} height={ringSize}>
              <Circle
                stroke="rgba(148, 163, 184, 0.25)"
                fill="none"
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke={PenguinObsidianTheme.auroraEmerald}
                fill="none"
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
              />
            </Svg>

            <View style={styles.ringInner}>
              <AnimatedPingu
                pose={isRunning ? 'writing' : 'encouraging'}
                mode={isRunning ? 'focus' : 'breathing'}
                size={118}
                showEquippedBadges
              />
              <Text style={styles.timerDigits}>
                {minsPart}:{secsPart}
              </Text>
              <Text style={styles.timerStateText}>
                {isRunning
                  ? '📖 Pingu is studying right beside you...'
                  : showCelebrationBlast
                  ? '🎉 Session Complete! +25 XP & +20 Coins!'
                  : 'Tap Start to enter deep focus flow'}
              </Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <PrimaryButton
              label={isRunning ? 'Pause Focus' : 'Start Focus Session'}
              icon={isRunning ? 'pause' : 'play'}
              onPress={handleToggleStart}
              style={{ flex: 1 }}
            />
            {isRunning && (
              <Pressable
                onPress={handleQuickFinishDemo}
                style={styles.instantCompleteBtn}>
                <Ionicons name="checkmark-done" size={22} color="#10B981" />
                <Text style={styles.instantCompleteText}>Done</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ADHD Ambient Soundscapes */}
        <Text style={styles.sectionTitle}>ADHD Ambient Soundscapes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ambientRow}>
          {AMBIENT_SOUNDS.map((s) => {
            const active = ambientMode === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => handleSelectAmbient(s.id)}
                style={[
                  styles.ambientCard,
                  active && styles.ambientCardActive,
                ]}>
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                <Text
                  style={[
                    styles.ambientLabel,
                    active && styles.ambientLabelActive,
                  ]}>
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Link to Active Habit */}
        <Text style={styles.sectionTitle}>Link a Habit (Auto-Completes)</Text>
        <View style={styles.habitSelectCol}>
          {activeBuildHabits.map((h) => {
            const selected = linkedHabitId === h.id;
            return (
              <Pressable
                key={h.id}
                onPress={() => {
                  playSound('tap');
                  setLinkedHabitId(h.id);
                }}
                style={[
                  styles.habitLinkRow,
                  selected && styles.habitLinkRowSelected,
                ]}>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={
                    selected
                      ? PenguinObsidianTheme.auroraEmerald
                      : PenguinObsidianTheme.textSecondary
                  }
                />
                <Text style={styles.habitLinkName}>{h.name}</Text>
                <View style={styles.bonusPill}>
                  <Text style={styles.bonusPillText}>+25 XP • +20 🪙</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Focus Stats Footer */}
        <View style={styles.statsFooter}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{focusSessionsCompleted}</Text>
            <Text style={styles.statLabel}>Focus Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalFocusMinutes}m</Text>
            <Text style={styles.statLabel}>Total Deep Focus</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PenguinObsidianTheme.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguinObsidianTheme.textPrimary,
  },
  pageSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguinObsidianTheme.glacierCyan,
    marginTop: 2,
  },
  presetsScroll: {
    gap: 10,
    paddingBottom: 14,
  },
  presetChip: {
    backgroundColor: PenguinObsidianTheme.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  presetChipActive: {
    backgroundColor: PenguinObsidianTheme.cardSelected,
    borderColor: PenguinObsidianTheme.auroraEmerald,
  },
  presetLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguinObsidianTheme.textPrimary,
  },
  presetLabelActive: {
    color: '#FFFFFF',
  },
  presetTag: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    color: PenguinObsidianTheme.textSecondary,
    marginTop: 2,
  },
  presetTagActive: {
    color: '#A7F3D0',
  },
  timerStageCard: {
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.16,
  },
  auroraOverlay: {
    position: 'absolute',
    top: -40,
    width: '80%',
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  ringWrapper: {
    width: 265,
    height: 265,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ringInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  timerDigits: {
    fontFamily: Fonts?.rounded,
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -4,
  },
  timerStateText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  controlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  instantCompleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1.5,
    borderColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderRadius: 999,
  },
  instantCompleteText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguinObsidianTheme.textPrimary,
    marginBottom: 10,
  },
  ambientRow: {
    gap: 10,
    paddingBottom: 18,
  },
  ambientCard: {
    backgroundColor: PenguinObsidianTheme.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    minWidth: 96,
  },
  ambientCardActive: {
    backgroundColor: PenguinObsidianTheme.cardSelected,
    borderColor: PenguinObsidianTheme.glacierCyan,
  },
  ambientLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguinObsidianTheme.textSecondary,
  },
  ambientLabelActive: {
    color: '#FFFFFF',
  },
  habitSelectCol: {
    gap: 10,
    marginBottom: 18,
  },
  habitLinkRow: {
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  habitLinkRowSelected: {
    backgroundColor: PenguinObsidianTheme.cardSelected,
    borderColor: PenguinObsidianTheme.auroraEmerald,
  },
  habitLinkName: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguinObsidianTheme.textPrimary,
  },
  bonusPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bonusPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguinObsidianTheme.beakGold,
  },
  statsFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  statNumber: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguinObsidianTheme.glacierCyan,
  },
  statLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguinObsidianTheme.textSecondary,
    marginTop: 2,
  },
});
