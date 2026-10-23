import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { getTodayKey, usePenguStore } from '@/store/usePenguStore';

export function CelebrationModal() {
  const router = useRouter();
  const celebrationHabitId = usePenguStore((s) => s.celebrationHabitId);
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const dismissCelebration = usePenguStore((s) => s.dismissCelebration);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);

  const habit = habits.find((h) => h.id === celebrationHabitId);
  if (!habit) return null;

  const today = getTodayKey();
  const completedToday = completedByDate[today] ?? [];
  const activeHabits = habits.filter((h) => !h.archived);
  const allCompleted =
    activeHabits.length > 0 &&
    activeHabits.every((h) => completedToday.includes(h.id));

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
            <Image
              source={MASCOT_IMAGES.celebrating}
              style={styles.mascotImg}
              contentFit="contain"
            />
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={26} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Small step, completed!</Text>

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
          </View>

          <Text style={styles.caption}>
            Reward added once per scheduled check-in.
          </Text>

          <PrimaryButton
            label={allCompleted ? 'Celebrate perfect day' : 'Keep going'}
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
    backgroundColor: 'rgba(9, 30, 66, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
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
    height: 170,
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
  mascotImg: {
    width: 155,
    height: 155,
  },
  checkBadge: {
    position: 'absolute',
    right: 68,
    top: 28,
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
    fontSize: 25,
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
    gap: 10,
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
    paddingVertical: 12,
    gap: 8,
  },
  rewardEmoji: {
    fontSize: 20,
  },
  rewardText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
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
