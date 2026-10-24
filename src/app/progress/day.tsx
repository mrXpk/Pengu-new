import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CircularProgressRing,
  HabitIconBadge,
  MASCOT_IMAGES,
  ScreenHeader,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { getTodayKey, usePenguStore } from '@/store/usePenguStore';

const COMPLETION_TIMESTAMPS: Record<string, string> = {
  'habit-1': 'Completed at 9:10 AM',
  'habit-2': 'Completed at 12:30 PM',
  'habit-3': 'Completed at 6:05 PM',
  'habit-4': 'Completed at 9:15 PM',
};

export default function SpecificDayProgressScreen() {
  const router = useRouter();
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const moodCheckIns = usePenguStore((s) => s.moodCheckIns);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);

  const today = getTodayKey();
  const completedIds = completedByDate[today] ?? [];
  const activeHabits = habits.filter((h) => !h.archived);
  const completedCount = activeHabits.filter((h) =>
    completedIds.includes(h.id)
  ).length;
  const totalCount = activeHabits.length;
  const pct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const todayMood = moodCheckIns[today];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Friday, 16 October" />

        {/* Summary Progress Card */}
        <View style={styles.summaryCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.summaryBg}
            contentFit="cover"
          />
          <View style={styles.summaryLeft}>
            <View style={styles.ringRow}>
              <CircularProgressRing
                completed={completedCount}
                total={totalCount}
                size={96}
                strokeWidth={10}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.completedTitle}>
                  {completedCount} of {totalCount}{'\n'}completed
                </Text>
                <Text style={styles.completedSub}>
                  {completedCount === totalCount && totalCount > 0
                    ? 'Every scheduled habit done!'
                    : 'Steady progress today.'}
                </Text>
              </View>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
          </View>
          <Image
            source={MASCOT_IMAGES.waving}
            style={styles.summaryPenguin}
            contentFit="contain"
          />
        </View>

        {/* Habits Breakdown */}
        <Text style={styles.sectionTitle}>Habits</Text>
        <View style={styles.habitList}>
          {activeHabits.map((habit) => {
            const isDone = completedIds.includes(habit.id);
            const metaText = isDone
              ? COMPLETION_TIMESTAMPS[habit.id] ??
                `Completed • ${habit.reminderTime}`
              : `Not completed • ${habit.reminderTime}`;

            return (
              <Pressable
                key={habit.id}
                onPress={() => toggleHabitToday(habit.id)}
                style={[styles.habitCard, isDone && styles.habitCardDone]}>
                <HabitIconBadge icon={habit.icon} size={52} />
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitMeta}>{metaText}</Text>
                </View>
                <View
                  style={[
                    styles.statusCircle,
                    isDone && styles.statusCircleDone,
                  ]}>
                  {isDone && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Daily Check-in Reflection */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>
          Daily check-in
        </Text>
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionIconBox}>
            <Text style={{ fontSize: 28 }}>💬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reflectionTitle}>
              {todayMood
                ? `Feeling ${todayMood.mood}`
                : 'No reflection recorded'}
            </Text>
            <Text style={styles.reflectionSub} numberOfLines={2}>
              {todayMood?.reflection ||
                'Add a quick note about how today felt.'}
            </Text>
          </View>
          <SecondaryButton
            label={todayMood ? 'Edit' : 'Add check-in'}
            variant="mint"
            onPress={() => router.push('/checkin/mood' as any)}
            style={styles.addCheckInBtn}
          />
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 22,
  },
  summaryBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  summaryLeft: {
    flex: 1,
    gap: 12,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completedTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    lineHeight: 25,
  },
  completedSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 3,
  },
  barTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: PenguColors.primaryGreen,
  },
  summaryPenguin: {
    width: 104,
    height: 104,
    marginRight: -6,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 21,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 12,
  },
  habitList: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  habitCardDone: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  habitMeta: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 3,
  },
  statusCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleDone: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  reflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  reflectionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EAF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  reflectionSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  addCheckInBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
