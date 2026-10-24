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
  CoinBadge,
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import {
  getTodayKey,
  HabitIconType,
  usePenguStore,
} from '@/store/usePenguStore';

const QUICK_START_IDEAS: {
  name: string;
  subtitle: string;
  icon: HabitIconType;
  category: string;
  time: string;
}[] = [
  {
    name: 'Read one page',
    subtitle: 'About 2 minutes',
    icon: 'book',
    category: 'Reading',
    time: '9:00 PM',
  },
  {
    name: 'Drink water',
    subtitle: '1 glass',
    icon: 'water',
    category: 'Water',
    time: '12:00 PM',
  },
  {
    name: 'Move for 2 minutes',
    subtitle: 'Stretch or walk',
    icon: 'shoe',
    category: 'Movement',
    time: '6:00 PM',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const moodCheckIns = usePenguStore((s) => s.moodCheckIns);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);
  const addHabit = usePenguStore((s) => s.addHabit);

  const today = getTodayKey();
  const completedIds = completedByDate[today] ?? [];
  const activeHabits = habits.filter((h) => !h.archived);
  const completedCount = activeHabits.filter((h) =>
    completedIds.includes(h.id)
  ).length;
  const totalCount = activeHabits.length;
  const remaining = Math.max(0, totalCount - completedCount);

  const firstName = userName.split(' ')[0] || 'Friend';
  const todayMood = moodCheckIns[today];

  const getEncouragement = () => {
    if (totalCount === 0) return 'Add your first small habit!';
    if (remaining === 0) return 'All steps completed today!';
    if (remaining === 1) return 'Just one small step to go!';
    if (remaining === 2) return 'Two small steps to go.';
    return `${remaining} small steps to go.`;
  };

  // Empty State Dashboard (Matches "Pingu's first habit starts here (1).png")
  if (activeHabits.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyTopBar}>
            <CoinBadge />
            <Pressable
              onPress={() => router.push('/settings/notifications' as any)}
              style={styles.bellBtn}>
              <Ionicons
                name="notifications"
                size={22}
                color="#F59E0B"
              />
            </Pressable>
          </View>

          <Text style={styles.emptyHeroTitle}>
            Your first small step{'\n'}starts here
          </Text>
          <Text style={styles.emptyHeroSub}>
            Choose one easy habit to begin with Pingu.
          </Text>

          <View style={styles.emptyMascotStage}>
            <Image
              source={MASCOT_IMAGES.arctic}
              style={styles.heroBg}
              contentFit="cover"
            />
            <Image
              source={MASCOT_IMAGES.writing}
              style={{ width: 225, height: 225 }}
              contentFit="contain"
            />
          </View>

          <PrimaryButton
            label="+ Create your first habit"
            onPress={() => router.push('/habits/form' as any)}
            style={{ width: '100%', marginBottom: 22 }}
          />

          <Text style={styles.quickStartHeader}>
            Or start with a quick idea
          </Text>
          <View style={styles.habitList}>
            {QUICK_START_IDEAS.map((idea) => (
              <Pressable
                key={idea.name}
                onPress={() =>
                  addHabit({
                    name: idea.name,
                    category: idea.category,
                    icon: idea.icon,
                    minimumAction: idea.subtitle,
                    repeatDays: [
                      'Mon',
                      'Tue',
                      'Wed',
                      'Thu',
                      'Fri',
                      'Sat',
                      'Sun',
                    ],
                    cue: 'Daily routine',
                    reminderTime: idea.time,
                    reminderEnabled: true,
                    notes: '',
                  })
                }
                style={styles.habitCard}>
                <HabitIconBadge icon={idea.icon} size={52} />
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{idea.name}</Text>
                  <Text style={styles.habitTimeText}>{idea.subtitle}</Text>
                </View>
                <View style={styles.quickAddPlus}>
                  <Ionicons
                    name="add"
                    size={22}
                    color={PenguColors.primaryGreen}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Greeting Bar */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.push('/settings/profile' as any)}
            style={styles.avatarWrap}>
            <Image
              source={MASCOT_IMAGES.waving}
              style={styles.avatarImg}
              contentFit="contain"
            />
          </Pressable>
          <View style={styles.greetingTextWrap}>
            <Text style={styles.greetingTitle} numberOfLines={1}>
              Good evening, {firstName}
            </Text>
            <Text style={styles.greetingDate}>Friday, 16 October</Text>
          </View>
          <CoinBadge />
        </View>

        {/* Today Hero Card */}
        <Pressable
          onPress={() =>
            remaining === 0 && totalCount > 0
              ? router.push('/habits/celebration' as any)
              : undefined
          }
          style={styles.todayHeroCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.heroBg}
            contentFit="cover"
          />
          <View style={styles.todayLeft}>
            <Text style={styles.todayCardTitle}>Today</Text>
            <View style={styles.ringAndCopy}>
              <CircularProgressRing
                completed={completedCount}
                total={totalCount}
                size={108}
                strokeWidth={11}
              />
              <Text style={styles.todayStepCopy}>{getEncouragement()}</Text>
            </View>
          </View>
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.heroPenguin}
            contentFit="contain"
          />
        </Pressable>

        {/* Section Header: Today's habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today’s habits</Text>
          <Pressable
            onPress={() => router.push('/habits/all' as any)}
            style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View all habits</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={PenguColors.primaryGreen}
            />
          </Pressable>
        </View>

        {/* Habit Cards List */}
        <View style={styles.habitList}>
          {activeHabits.map((habit) => {
            const isDone = completedIds.includes(habit.id);
            return (
              <Pressable
                key={habit.id}
                onPress={() => router.push(`/habits/${habit.id}` as any)}
                style={[
                  styles.habitCard,
                  isDone && styles.habitCardDone,
                ]}>
                <HabitIconBadge icon={habit.icon} size={56} />
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.habitMetaRow}>
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color={PenguColors.textSecondary}
                    />
                    <Text style={styles.habitTimeText}>{habit.reminderTime}</Text>
                  </View>
                </View>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleHabitToday(habit.id);
                  }}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.checkCircle,
                    isDone && styles.checkCircleDone,
                    pressed && { transform: [{ scale: 0.9 }] },
                  ]}>
                  {isDone && (
                    <Ionicons name="checkmark" size={22} color="#FFFFFF" />
                  )}
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        {/* Daily Check-in Banner */}
        <Pressable
          onPress={() => router.push('/checkin/mood' as any)}
          style={({ pressed }) => [
            styles.checkInBanner,
            pressed && { opacity: 0.92 },
          ]}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.checkInBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.encouraging}
            style={styles.checkInMascot}
            contentFit="contain"
          />
          <View style={styles.checkInTextCol}>
            <Text style={styles.checkInTitle}>Daily check-in</Text>
            <Text style={styles.checkInSubtitle}>
              {todayMood
                ? `Feeling ${todayMood.mood.toLowerCase()} today • Tap to update`
                : 'How are you feeling today?'}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={PenguColors.navyHeading}
          />
        </Pressable>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DDF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  avatarImg: {
    width: 48,
    height: 48,
    marginTop: 4,
  },
  greetingTextWrap: {
    flex: 1,
  },
  greetingTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  greetingDate: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  todayHeroCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginBottom: 22,
  },
  heroBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.22,
  },
  todayLeft: {
    flex: 1,
    zIndex: 2,
  },
  todayCardTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  ringAndCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  todayStepCopy: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '700',
    color: PenguColors.navyHeading,
    lineHeight: 23,
  },
  heroPenguin: {
    width: 124,
    height: 124,
    marginRight: -6,
    marginBottom: -8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 23,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  habitList: {
    gap: 12,
    marginBottom: 20,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    gap: 14,
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  habitCardDone: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  habitInfo: {
    flex: 1,
    gap: 5,
  },
  habitName: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  habitTimeText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '500',
    color: PenguColors.textSecondary,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  checkInBanner: {
    backgroundColor: PenguColors.surfaceIce,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: PenguColors.iceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 12,
  },
  checkInBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  checkInMascot: {
    width: 74,
    height: 74,
    marginBottom: -10,
  },
  checkInTextCol: {
    flex: 1,
    gap: 3,
  },
  checkInTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  checkInSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  emptyTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHeroTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 31,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 37,
  },
  emptyHeroSub: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  emptyMascotStage: {
    width: '100%',
    height: 235,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  quickStartHeader: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 12,
  },
  quickAddPlus: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PenguColors.surfaceMint,
    borderWidth: 1.5,
    borderColor: PenguColors.mintBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
