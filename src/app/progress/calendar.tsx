import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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

import {
  MASCOT_IMAGES,
  PrimaryButton,
  ScreenHeader,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitCalendarScreen() {
  const router = useRouter();
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const [selectedDay, setSelectedDay] = useState<number>(16);

  const activeTotal = habits.filter((h) => !h.archived).length || 4;

  // October 2026 starts on Thursday (3 leading empty slots for Mon, Tue, Wed)
  const leadingEmpty = [null, null, null];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const cells = [...leadingEmpty, ...days];

  const getDateKey = (day: number) =>
    `2026-10-${day.toString().padStart(2, '0')}`;

  const getDayStatus = (
    day: number
  ): 'complete' | 'partial' | 'none' => {
    const key = getDateKey(day);
    const done = (completedByDate[key] ?? []).length;
    if (done === 0) return 'none';
    if (done >= activeTotal) return 'complete';
    return 'partial';
  };

  const selectedKey = getDateKey(selectedDay);
  const selectedDoneCount = (completedByDate[selectedKey] ?? []).length;
  const selectedPct = Math.min(
    100,
    Math.round((selectedDoneCount / activeTotal) * 100)
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Habit calendar" />

        {/* Month Selector */}
        <View style={styles.monthRow}>
          <Pressable style={styles.monthArrow}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={PenguColors.navyHeading}
            />
          </Pressable>
          <Text style={styles.monthTitle}>October 2026</Text>
          <Pressable style={styles.monthArrow}>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={PenguColors.navyHeading}
            />
          </Pressable>
        </View>

        {/* Calendar Grid Card */}
        <View style={styles.calendarCard}>
          <View style={styles.weekdaysHeader}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={styles.weekdayLabel}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} style={styles.dayCell} />;
              }
              const status = getDayStatus(day);
              const isSelected = day === selectedDay;

              const dotColor =
                 isSelected
                  ? '#FFFFFF'
                  : status === 'complete'
                  ? PenguColors.primaryGreen
                  : status === 'partial'
                  ? PenguColors.partialOrange
                  : PenguColors.inactiveDot;

              return (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayBubble,
                      isSelected && styles.dayBubbleSelected,
                    ]}>
                    <Text
                      style={[
                        styles.dayNumber,
                        isSelected && styles.dayNumberSelected,
                      ]}>
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: dotColor },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: PenguColors.primaryGreen },
              ]}
            />
            <Text style={styles.legendText}>Complete</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: PenguColors.partialOrange },
              ]}
            />
            <Text style={styles.legendText}>Partial</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: PenguColors.inactiveDot },
              ]}
            />
            <Text style={styles.legendText}>No activity</Text>
          </View>
        </View>

        {/* Selected Day Summary Card */}
        <View style={styles.daySummaryCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.summaryBg}
            contentFit="cover"
          />
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryDateTitle}>
              {selectedDay === 16
                ? 'Friday, 16 October'
                : `${selectedDay} October 2026`}
            </Text>
            <Text style={styles.summarySubtitle}>
              {selectedDoneCount} of {activeTotal} habits completed
            </Text>
            <View style={styles.summaryProgressTrack}>
              <View
                style={[
                  styles.summaryProgressFill,
                  { width: `${selectedPct}%` },
                ]}
              />
            </View>
            <PrimaryButton
              label="View day"
              trailingArrow
              onPress={() => router.push('/(tabs)' as any)}
              style={styles.viewDayBtn}
            />
          </View>
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.summaryPenguin}
            contentFit="contain"
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
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PenguColors.surfaceMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 23,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 12,
  },
  weekdaysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayBubble: {
    width: 44,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dayBubbleSelected: {
    backgroundColor: PenguColors.primaryGreen,
  },
  dayNumber: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.navyHeading,
  },
  daySummaryCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  summaryBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  summaryLeft: {
    flex: 1,
    gap: 8,
    zIndex: 2,
  },
  summaryDateTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  summarySubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.navyHeading,
  },
  summaryProgressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D3F1DF',
    overflow: 'hidden',
    marginVertical: 4,
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: PenguColors.primaryGreen,
  },
  viewDayBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  summaryPenguin: {
    width: 120,
    height: 120,
    marginRight: -8,
  },
});
