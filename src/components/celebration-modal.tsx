import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { getTodayKey, usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export function CelebrationModal() {
  const router = useRouter();
  const celebrationHabitId = usePenguStore((s) => s.celebrationHabitId);
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const dismissCelebration = usePenguStore((s) => s.dismissCelebration);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);

  const habit = habits.find((h) => h.id === celebrationHabitId);

  const today = getTodayKey();
  const completedToday = completedByDate[today] ?? [];
  const activeBuildHabits = habits.filter(
    (h) => !h.archived && (h.habitType ?? 'build') === 'build'
  );
  const allCompleted =
    activeBuildHabits.length > 0 &&
    activeBuildHabits.every((h) => completedToday.includes(h.id));

  useEffect(() => {
    if (celebrationHabitId) {
      playSound(allCompleted ? 'celebration' : 'checkin');
    }
  }, [allCompleted, celebrationHabitId]);

  if (!habit) return null;

  const handleKeepGoing = () => {
    dismissCelebration();
    if (allCompleted) {
      router.push('/habits/celebration' as any);
    }
  };

  const handleUndo = () => {
    toggleHabitToday(habit.id);
    dismissCelebration();
  };

  return (
    <Modal
      visible={!!celebrationHabitId}
      transparent
      animationType="fade"
      onRequestClose={dismissCelebration}>
      <View style={styles.backdrop}>
        <ConfettiBlast visible={!!celebrationHabitId} />
        <View style={styles.card}>
          <Pressable onPress={dismissCelebration} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={PenguColors.textSecondary} />
          </Pressable>

          <View style={styles.mascotStage}>
            <Image
              source={MASCOT_IMAGES.arctic}
              style={styles.stageBg}
              contentFit="cover"
            />
            <AnimatedPingu
              pose="celebrating"
              mode="celebrating"
              size={148}
              showEquippedBadges
            />
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={26} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>
            {allCompleted ? '🎉 All Daily Goals Done!' : 'Small step, completed!'}
          </Text>

          <View style={styles.habitBanner}>
            <HabitIconBadge icon={habit.icon} size={44} />
            <Text style={styles.habitName} numberOfLines={2}>
              {habit.name}
            </Text>
            <View style={styles.habitCheck}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.rewardsRow}>
            <View style={styles.rewardBox}>
              <Text style={styles.rewardEmoji}>⭐</Text>
              <Text style={styles.rewardText}>+10 XP</Text>
            </View>
            <View style={styles.rewardBox}>
              <Text style={styles.rewardEmoji}>🪙</Text>
              <Text style={styles.rewardText}>+5 coins</Text>
            </View>
            <View style={styles.rewardBox}>
              <Text style={styles.rewardEmoji}>⚡</Text>
              <Text style={styles.rewardText}>+20%</Text>
            </View>
          </View>

          <Text style={styles.caption}>
            {allCompleted
              ? '100% Perfect Day! Tap below to blast confetti & open your Mystery Chest!'
              : 'Pingu’s energy grew! Keep your momentum rolling.'}
          </Text>

          <PrimaryButton
            label={allCompleted ? '🎉 Open Perfect Day Blast!' : 'Keep going'}
            trailingArrow
            onPress={handleKeepGoing}
            style={{ width: '100%', marginTop: 12 }}
          />

          <Pressable onPress={handleUndo} style={styles.undoBtn}>
            <Text style={styles.undoText}>Undo check-in</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 30, 66, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 385,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mascotStage: {
    width: '100%',
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
  },
  checkBadge: {
    position: 'absolute',
    right: 68,
    top: 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PenguColors.primaryGreen,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginBottom: 14,
  },
  habitBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    gap: 12,
    marginBottom: 12,
  },
  habitName: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  habitCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  rewardBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    borderRadius: 16,
    paddingVertical: 11,
    gap: 5,
  },
  rewardEmoji: {
    fontSize: 17,
  },
  rewardText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  caption: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
  },
  undoBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    width: '75%',
    alignItems: 'center',
  },
  undoText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '700',
    color: PenguColors.textSecondary,
  },
});
