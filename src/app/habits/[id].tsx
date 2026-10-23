import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  ArcticFooter,
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { getTodayKey, usePenguStore } from '@/store/usePenguStore';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);
  const toggleArchiveHabit = usePenguStore((s) => s.toggleArchiveHabit);

  const habit = habits.find((h) => h.id === id) ?? habits[0];
  if (!habit) return null;

  const today = getTodayKey();
  const isCompletedToday = (completedByDate[today] ?? []).includes(habit.id);

  const scheduleText =
    habit.repeatDays.length === 7
      ? 'Daily'
      : habit.repeatDays.length === 5 &&
        !habit.repeatDays.includes('Sat') &&
        !habit.repeatDays.includes('Sun')
      ? 'Weekdays'
      : habit.repeatDays.join(', ');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={PenguColors.navyHeading}
          />
        </Pressable>

        {/* Header Row */}
        <View style={styles.topHeader}>
          <HabitIconBadge icon={habit.icon} size={86} />
          <View style={styles.titleCol}>
            <View style={styles.titleRow}>
              <Text style={styles.habitTitle}>{habit.category} habit</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/habits/form',
                    params: { id: habit.id },
                  } as any)
                }>
                <Ionicons
                  name="pencil"
                  size={20}
                  color={PenguColors.textSecondary}
                />
              </Pressable>
            </View>
            <Text style={styles.habitSubtitle}>{habit.name}.</Text>
          </View>
        </View>

        {/* Completed Today Status Banner */}
        <View
          style={[
            styles.statusBanner,
            !isCompletedToday && styles.statusBannerPending,
          ]}>
          <Pressable
            onPress={() => toggleHabitToday(habit.id)}
            style={[
              styles.bigCheckCircle,
              !isCompletedToday && styles.bigCheckCirclePending,
            ]}>
            <Ionicons
              name="checkmark"
              size={28}
              color={isCompletedToday ? '#FFFFFF' : PenguColors.primaryGreen}
            />
          </Pressable>
          <View style={styles.statusTextCol}>
            <Text style={styles.statusTitle}>
              {isCompletedToday ? 'Completed today' : 'Ready for today'}
            </Text>
            <Pressable onPress={() => toggleHabitToday(habit.id)}>
              <Text style={styles.undoLink}>
                {isCompletedToday ? 'Undo check-in' : 'Mark as completed'}
              </Text>
            </Pressable>
          </View>
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.statusPenguin}
            contentFit="contain"
          />
        </View>

        {/* 3 Metrics Card */}
        <View style={styles.metricsCard}>
          <View style={styles.metricCol}>
            <Text style={styles.metricValue}>{habit.streak}</Text>
            <Text style={styles.metricLabel}>scheduled{'\n'}days</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={styles.metricValue}>{habit.bestStreak}</Text>
            <Text style={styles.metricLabel}>best streak</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={styles.metricValue}>{habit.totalCompletions}</Text>
            <Text style={styles.metricLabel}>completions</Text>
          </View>
        </View>

        {/* Recent 7 Days */}
        <View style={styles.recentCard}>
          <Text style={styles.cardSectionTitle}>Recent 7 days</Text>
          <View style={styles.weekCirclesRow}>
            {WEEK_LABELS.map((day, idx) => {
              const done = habit.recent7Days[idx];
              return (
                <View key={day} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayCircle,
                      done ? styles.dayCircleDone : styles.dayCircleSkipped,
                    ]}>
                    {done ? (
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    ) : (
                      <View style={styles.dashBar} />
                    )}
                  </View>
                  <Text style={styles.dayName}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Schedule, Cue, Reminder Info List */}
        <View style={styles.detailsListCard}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/habits/form',
                params: { id: habit.id },
              } as any)
            }
            style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: '#EAF8EF' }]}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={PenguColors.primaryGreen}
              />
            </View>
            <Text style={styles.detailLabel}>Schedule</Text>
            <Text style={styles.detailValue}>{scheduleText}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <View style={styles.rowDivider} />

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/habits/form',
                params: { id: habit.id },
              } as any)
            }
            style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: '#FFF6DF' }]}>
              <Ionicons name="notifications" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.detailLabel}>Cue</Text>
            <Text style={styles.detailValue}>{habit.cue}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <View style={styles.rowDivider} />

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/habits/form',
                params: { id: habit.id },
              } as any)
            }
            style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: '#EAF6FF' }]}>
              <Ionicons name="time" size={20} color="#2563EB" />
            </View>
            <Text style={styles.detailLabel}>Reminder</Text>
            <Text style={styles.detailValue}>{habit.reminderTime}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={PenguColors.textSecondary}
            />
          </Pressable>
        </View>

        <PrimaryButton
          label="Edit habit"
          onPress={() =>
            router.push({
              pathname: '/habits/form',
              params: { id: habit.id },
            } as any)
          }
          style={{ marginTop: 6 }}
        />

        <Pressable
          onPress={() => {
            toggleArchiveHabit(habit.id);
            router.back();
          }}
          style={styles.archiveBtn}>
          <Text style={styles.archiveText}>
            {habit.archived ? 'Unarchive habit' : 'Archive habit'}
          </Text>
        </Pressable>

        <ArcticFooter mascot="waving" height={90} />
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
    paddingBottom: 28,
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  titleCol: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  habitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 30,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  habitSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 17,
    color: PenguColors.navyHeading,
  },
  statusBanner: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    gap: 14,
  },
  statusBannerPending: {
    backgroundColor: '#FFFFFF',
    borderColor: PenguColors.cardBorder,
  },
  bigCheckCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCheckCirclePending: {
    backgroundColor: PenguColors.surfaceMint,
    borderWidth: 2,
    borderColor: PenguColors.primaryGreen,
  },
  statusTextCol: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  undoLink: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: PenguColors.primaryGreen,
    textDecorationLine: 'underline',
  },
  statusPenguin: {
    width: 84,
    height: 84,
    marginRight: -6,
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#E2E8F0',
  },
  metricValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  metricLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    gap: 12,
  },
  cardSectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  weekCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: PenguColors.primaryGreen,
  },
  dayCircleSkipped: {
    backgroundColor: '#E2E8F0',
  },
  dashBar: {
    width: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#64748B',
  },
  dayName: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  detailsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  detailIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  detailValue: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: '500',
    color: PenguColors.textSecondary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  archiveBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  archiveText: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.textSecondary,
    textDecorationLine: 'underline',
  },
});
