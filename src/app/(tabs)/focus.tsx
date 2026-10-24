import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import {
  AmbientSoundscapeType,
  playSound,
  startAmbientSoundscape,
  stopAmbientSoundscape,
} from '@/utils/sound';

const DURATION_PRESETS = [
  { label: '5m Micro', minutes: 5, tag: 'Easy start' },
  { label: '15m Sprint', minutes: 15, tag: 'Flow builder' },
  { label: '25m Pomodoro', minutes: 25, tag: '2x Bonus XP' },
  { label: '45m Deep', minutes: 45, tag: 'Deep focus' },
];

const AMBIENT_SOUNDS: {
  id: AmbientSoundscapeType;
  label: string;
  emoji: string;
}[] = [
  { id: 'none', label: 'Silent', emoji: '🔇' },
  { id: 'rain', label: 'Cozy Rain', emoji: '🌧️' },
  { id: 'wind', label: 'Arctic Wind', emoji: '❄️' },
  { id: 'brown', label: 'Brown Noise', emoji: '🎧' },
  { id: 'binaural', label: 'Alpha Wave', emoji: '🌊' },
];

export default function FocusTimerScreen() {
  const router = useRouter();
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
  }, [completeFocusSession, isRunning, linkedHabitId, selectedMinutes]);

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

  const ringSize = 256;
  const strokeWidth = 10;
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
        {/* Top Minimalist Header with Back Button */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => {
              playSound('tap');
              router.replace('/(tabs)' as any);
            }}
            style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={PenguColors.navyHeading}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Focus Session</Text>
            <Text style={styles.pageSub}>
              Calm companion timer • +25 XP & +20 Coins
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

        {/* Soft Light Circular Timer + Pingu Companion Stage */}
        <View style={styles.timerStageCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />

          <View style={styles.ringWrapper}>
            <Svg width={ringSize} height={ringSize}>
              <Circle
                stroke="rgba(9, 30, 66, 0.08)"
                fill="rgba(255, 255, 255, 0.85)"
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke={PenguColors.primaryGreen}
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
                size={112}
                showEquippedBadges
              />
              <Text style={styles.timerDigits}>
                {minsPart}:{secsPart}
              </Text>
              <Text style={styles.timerStateText}>
                {isRunning
                  ? 'Pingu is focusing quietly beside you...'
                  : showCelebrationBlast
                  ? 'Session complete! +25 XP & +20 Coins'
                  : 'Tap Start to begin a calm session'}
              </Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <PrimaryButton
              label={isRunning ? 'Pause Session' : 'Start Focus Session'}
              icon={isRunning ? 'pause' : 'play'}
              onPress={handleToggleStart}
              style={{ flex: 1 }}
            />
            {isRunning && (
              <Pressable
                onPress={handleQuickFinishDemo}
                style={styles.instantCompleteBtn}>
                <Ionicons
                  name="checkmark-done"
                  size={20}
                  color={PenguColors.primaryGreenDark}
                />
                <Text style={styles.instantCompleteText}>Done</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Ambient Soundscapes */}
        <Text style={styles.sectionTitle}>Ambient soundscapes</Text>
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
                <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
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
        <Text style={styles.sectionTitle}>Link a habit</Text>
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
                  size={20}
                  color={
                    selected ? PenguColors.primaryGreen : '#94A3B8'
                  }
                />
                <Text style={styles.habitLinkName}>{h.name}</Text>
                <View style={styles.bonusPill}>
                  <Text style={styles.bonusPillText}>+20 🪙</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Focus Stats Footer */}
        <View style={styles.statsFooter}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{focusSessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalFocusMinutes}m</Text>
            <Text style={styles.statLabel}>Total focus time</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PenguColors.background,
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
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  pageSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 1,
  },
  presetsScroll: {
    gap: 10,
    paddingBottom: 14,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  presetChipActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  presetLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  presetLabelActive: {
    color: PenguColors.primaryGreenDark,
  },
  presetTag: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  presetTagActive: {
    color: PenguColors.primaryGreenDark,
  },
  timerStageCard: {
    backgroundColor: '#EAF6FF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5ECF9',
    overflow: 'hidden',
    marginBottom: 20,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
  },
  ringWrapper: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ringInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  timerDigits: {
    fontFamily: Fonts?.rounded,
    fontSize: 40,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginTop: -4,
  },
  timerStateText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderRadius: 999,
  },
  instantCompleteText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  ambientRow: {
    gap: 10,
    paddingBottom: 18,
  },
  ambientCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#EAECEF',
    minWidth: 92,
  },
  ambientCardActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  ambientLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  ambientLabelActive: {
    color: PenguColors.primaryGreenDark,
  },
  habitSelectCol: {
    gap: 8,
    marginBottom: 18,
  },
  habitLinkRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  habitLinkRowSelected: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  habitLinkName: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  bonusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bonusPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  statsFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  statNumber: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  statLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
});
