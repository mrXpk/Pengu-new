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
  AnimatedPingu,
  LivingEcosystemPanel,
} from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
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
import { playSound } from '@/utils/sound';

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
  const resistBadHabit = usePenguStore((s) => s.resistBadHabit);
  const addHabit = usePenguStore((s) => s.addHabit);

  const [habitTab, setHabitTab] = useState<'build' | 'break'>('build');
  const [blastVisible, setBlastVisible] = useState(false);
  const [blastKey, setBlastKey] = useState(1);

  const today = getTodayKey();
  const completedIds = completedByDate[today] ?? [];
  const activeHabits = habits.filter((h) => !h.archived);
  const buildHabits = activeHabits.filter(
    (h) => (h.habitType ?? 'build') === 'build'
  );
  const breakHabits = activeHabits.filter((h) => h.habitType === 'break');

  const completedCount = buildHabits.filter((h) =>
    completedIds.includes(h.id)
  ).length;
  const totalCount = buildHabits.length;

  const firstName = userName.split(' ')[0] || 'Friend';
  const todayMood = moodCheckIns[today];

  // Empty State Dashboard
  if (activeHabits.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyTopBar}>
            <CoinBadge />
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
            <AnimatedPingu pose="writing" mode="breathing" size={205} />
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
                onPress={() => {
                  playSound('checkin');
                  addHabit({
                    name: idea.name,
                    category: idea.category,
                    icon: idea.icon,
                    habitType: 'build',
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
                  });
                }}
                style={styles.habitCard}>
                <HabitIconBadge icon={idea.icon} size={50} />
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
      <ConfettiBlast visible={blastVisible} triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Minimalist Top Greeting & Coin Row (No Theme Toggle, No Clutter) */}
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
              Hi, {firstName}
            </Text>
            <Text style={styles.greetingDate}>Friday, 16 October</Text>
          </View>

          <CoinBadge />
        </View>

        {/* Minimalist Fluidly Animated Today Score Card */}
        <LivingEcosystemPanel
          completedCount={completedCount}
          totalCount={totalCount}
          onPressFocus={() => router.push('/(tabs)/focus' as any)}
          onPressCelebrate={() => router.push('/habits/celebration' as any)}
          onPressPinguHome={() => router.push('/(tabs)/pingu' as any)}
        />

        {/* Minimalist Section Header + Build/Break Switcher */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your habits</Text>

          <View style={styles.headerRightControls}>
            <View style={styles.habitTypeTabs}>
              <Pressable
                onPress={() => {
                  playSound('tap');
                  setHabitTab('build');
                }}
                style={[
                  styles.habitTypePill,
                  habitTab === 'build' && styles.habitTypePillActive,
                ]}>
                <Text
                  style={[
                    styles.habitTypePillText,
                    habitTab === 'build' && styles.habitTypePillTextActive,
                  ]}>
                  Daily ({buildHabits.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  playSound('tap');
                  setHabitTab('break');
                }}
                style={[
                  styles.habitTypePill,
                  habitTab === 'break' && styles.habitTypePillActive,
                ]}>
                <Text
                  style={[
                    styles.habitTypePillText,
                    habitTab === 'break' && styles.habitTypePillTextActive,
                  ]}>
                  Quit ({breakHabits.length})
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push('/habits/all' as any)}
              style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={PenguColors.primaryGreen}
              />
            </Pressable>
          </View>
        </View>

        {/* DAILY BUILD HABITS LIST */}
        {habitTab === 'build' ? (
          <View style={styles.habitList}>
            {buildHabits.map((habit) => {
              const isDone = completedIds.includes(habit.id);
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => router.push(`/habits/${habit.id}` as any)}
                  style={[
                    styles.habitCard,
                    isDone && styles.habitCardDone,
                  ]}>
                  <HabitIconBadge icon={habit.icon} size={52} />
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <View style={styles.habitMetaRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={PenguColors.textSecondary}
                      />
                      <Text style={styles.habitTimeText}>
                        {habit.reminderTime}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      const res = toggleHabitToday(habit.id);
                      if (res.completed) {
                        playSound(res.allDone ? 'celebration' : 'checkin');
                        if (res.allDone) {
                          setBlastVisible(true);
                          setBlastKey((k) => k + 1);
                        }
                      } else {
                        playSound('tap', 0.8);
                      }
                    }}
                    hitSlop={12}
                    style={({ pressed }) => [
                      styles.checkCircle,
                      isDone && styles.checkCircleDone,
                      pressed && { transform: [{ scale: 0.88 }] },
                    ]}>
                    {isDone && (
                      <Ionicons name="checkmark" size={22} color="#FFFFFF" />
                    )}
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* BREAK BAD HABITS LIST */
          <View style={styles.habitList}>
            {breakHabits.map((habit) => (
              <View key={habit.id} style={styles.habitCard}>
                <HabitIconBadge icon={habit.icon} size={50} />
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.cleanStreakBadge}>
                    {habit.cleanHours ?? 24}h clean • {habit.streak}d streak
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    playSound('checkin');
                    resistBadHabit(habit.id);
                    setBlastVisible(true);
                    setBlastKey((k) => k + 1);
                  }}
                  style={styles.resistBtn}>
                  <Text style={styles.resistBtnText}>+Resisted</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Minimalist Daily Mood & Gratitude Check-In Banner */}
        <Pressable
          onPress={() => {
            playSound('tap');
            router.push('/checkin/mood' as any);
          }}
          style={({ pressed }) => [
            styles.checkInBanner,
            pressed && { opacity: 0.92 },
          ]}>
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
            size={20}
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
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D5ECF9',
  },
  avatarImg: {
    width: 44,
    height: 44,
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
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 1,
  },
  heroBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  habitTypeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    padding: 3,
  },
  habitTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  habitTypePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  habitTypePillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '700',
    color: PenguColors.textSecondary,
  },
  habitTypePillTextActive: {
    color: PenguColors.navyHeading,
    fontWeight: '800',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  habitList: {
    gap: 10,
    marginBottom: 18,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  habitCardDone: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  habitInfo: {
    flex: 1,
    gap: 4,
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
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  cleanStreakBadge: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
  },
  resistBtn: {
    backgroundColor: PenguColors.surfaceMint,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
  },
  resistBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  checkInMascot: {
    width: 56,
    height: 56,
  },
  checkInTextCol: {
    flex: 1,
    gap: 2,
  },
  checkInTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  checkInSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  emptyTopBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  emptyHeroTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 32,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 40,
  },
  emptyHeroSub: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyMascotStage: {
    height: 220,
    borderRadius: 28,
    backgroundColor: '#EAF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#D5ECF9',
  },
  quickStartHeader: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    marginBottom: 12,
  },
  quickAddPlus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PenguColors.surfaceMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
