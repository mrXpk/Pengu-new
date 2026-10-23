import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArcticFooter, HabitIconBadge } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

type PeriodTab = 'Week' | 'Month' | 'All time';

export default function ProgressScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodTab>('Week');
  const habits = usePenguStore((s) => s.habits);

  const activeHabits = habits.filter((h) => !h.archived);
  const totalCompletions = habits.reduce((acc, h) => acc + h.totalCompletions, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 12);

  const weekBars = [
    { day: 'Mon', ratio: 0.85 },
    { day: 'Tue', ratio: 0.72 },
    { day: 'Wed', ratio: 0.45 },
    { day: 'Thu', ratio: 0.85 },
    { day: 'Fri', ratio: 0.7 },
    { day: 'Sat', ratio: 0 },
    { day: 'Sun', ratio: 0 },
  ];

  const habitBreakdown = [
    { label: 'Study', icon: 'books' as const, done: 4, target: 5 },
    { label: 'Water', icon: 'water' as const, done: 5, target: 7 },
    { label: 'Movement', icon: 'dumbbell' as const, done: 4, target: 7 },
    { label: 'Reading', icon: 'book' as const, done: 5, target: 5 },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Your progress</Text>

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          {(['Week', 'Month', 'All time'] as PeriodTab[]).map((tab) => {
            const active = period === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setPeriod(tab)}
                style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
                <Text
                  style={[
                    styles.segmentText,
                    active && styles.segmentTextActive,
                  ]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Date Range Navigator */}
        <View style={styles.dateSelectorRow}>
          <Pressable style={styles.circleNavBtn}>
            <Ionicons
              name="chevron-back"
              size={18}
              color={PenguColors.navyHeading}
            />
          </Pressable>
          <Text style={styles.dateRangeText}>
            {period === 'Week'
              ? '12 – 18 October'
              : period === 'Month'
              ? 'October 2026'
              : 'All time summary'}
          </Text>
          <Pressable style={styles.circleNavBtn}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={PenguColors.navyHeading}
            />
          </Pressable>
        </View>

        {/* Weekly Bar Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {period === 'Week'
              ? '18 of 24 scheduled sessions'
              : period === 'Month'
              ? '68 of 84 scheduled sessions'
              : `${totalCompletions} total sessions completed`}
          </Text>
          <Text style={styles.chartSubtitle}>
            {period === 'Week'
              ? '75% completed'
              : period === 'Month'
              ? '81% completed'
              : 'Consistent daily progress'}
          </Text>

          <View style={styles.barsRow}>
            {weekBars.map((item) => (
              <View key={item.day} style={styles.barColumn}>
                <View
                  style={[
                    styles.barTrack,
                    item.ratio === 0 && styles.barTrackEmpty,
                  ]}>
                  {item.ratio > 0 && (
                    <View
                      style={[
                        styles.barFill,
                        { height: `${Math.round(item.ratio * 100)}%` },
                      ]}
                    />
                  )}
                </View>
                <Text style={styles.barDayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Two Summary Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statCheckCircle}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>total completions</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={{ fontSize: 34 }}>🔥</Text>
            <View>
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>best streak</Text>
            </View>
          </View>
        </View>

        {/* Habit Overview Bars */}
        <Text style={styles.sectionTitle}>Habit overview</Text>
        <View style={styles.overviewList}>
          {habitBreakdown.map((item) => {
            const pct = Math.min(100, Math.round((item.done / item.target) * 100));
            return (
              <View key={item.label} style={styles.overviewRow}>
                <HabitIconBadge icon={item.icon} size={38} />
                <Text style={styles.overviewLabel}>{item.label}</Text>
                <View style={styles.overviewTrack}>
                  <View
                    style={[styles.overviewFill, { width: `${pct}%` }]}
                  />
                </View>
                <Text style={styles.overviewFraction}>
                  {item.done}/{item.target}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quick Links: Open Calendar & Achievements */}
        <View style={styles.linksRow}>
          <Pressable
            onPress={() => router.push('/progress/calendar' as any)}
            style={({ pressed }) => [
              styles.linkCard,
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={{ fontSize: 28 }}>🗓️</Text>
            <Text style={styles.linkCardText}>Open calendar</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={PenguColors.navyHeading}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/progress/achievements' as any)}
            style={({ pressed }) => [
              styles.linkCard,
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={{ fontSize: 28 }}>🏆</Text>
            <Text style={styles.linkCardText}>Achievements</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={PenguColors.navyHeading}
            />
          </Pressable>
        </View>

        <ArcticFooter mascot="celebrating" height={125} />
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
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 14,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 999,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: PenguColors.primaryGreen,
  },
  segmentText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 14,
  },
  circleNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRangeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  chartCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginBottom: 14,
  },
  chartTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  chartSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    width: 36,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#D3F1DF',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barTrackEmpty: {
    backgroundColor: '#E2E8F0',
  },
  barFill: {
    width: '100%',
    backgroundColor: PenguColors.primaryGreen,
    borderRadius: 10,
  },
  barDayLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  statCheckCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  statLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 21,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  overviewList: {
    gap: 8,
    marginBottom: 16,
  },
  overviewRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  overviewLabel: {
    width: 82,
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  overviewTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  overviewFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: PenguColors.primaryGreen,
  },
  overviewFraction: {
    width: 34,
    textAlign: 'right',
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  linkCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  linkCardText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
});
