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
import { Fonts, PenguColors, PenguinObsidianTheme } from '@/constants/theme';
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

const JOURNEY_WEEK = [
  { day: 'Mon', date: 12, key: '2026-10-12' },
  { day: 'Tue', date: 13, key: '2026-10-13' },
  { day: 'Wed', date: 14, key: '2026-10-14' },
  { day: 'Thu', date: 15, key: '2026-10-15' },
  { day: 'Fri', date: 16, key: '2026-10-16', isToday: true },
  { day: 'Sat', date: 17, key: '2026-10-17' },
  { day: 'Sun', date: 18, key: '2026-10-18' },
];

export default function HomeScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const habits = usePenguStore((s) => s.habits);
  const completedByDate = usePenguStore((s) => s.completedByDate);
  const moodCheckIns = usePenguStore((s) => s.moodCheckIns);
  const themeMode = usePenguStore((s) => s.themeMode);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);
  const updateAppearance = usePenguStore((s) => s.updateAppearance);
  const toggleHabitToday = usePenguStore((s) => s.toggleHabitToday);
  const resistBadHabit = usePenguStore((s) => s.resistBadHabit);
  const addHabit = usePenguStore((s) => s.addHabit);

  const [habitTab, setHabitTab] = useState<'build' | 'break'>('build');
  const [blastVisible, setBlastVisible] = useState(false);
  const [blastKey, setBlastKey] = useState(1);

  const isObsidian =
    themeMode === 'dark' || equippedSceneryId === 'penguin-obsidian';

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

  const handleToggleObsidian = () => {
    playSound('tap', 1.1);
    updateAppearance({
      themeMode: isObsidian ? 'light' : 'dark',
      equippedSceneryId: isObsidian ? 'arctic-blue' : 'penguin-obsidian',
    });
  };

  // Empty State Dashboard
  if (activeHabits.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          isObsidian && { backgroundColor: PenguinObsidianTheme.background },
        ]}
        edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyTopBar}>
            <CoinBadge />
            <Pressable
              onPress={() => router.push('/(tabs)/settings' as any)}
              style={styles.iconCircleBtn}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={PenguColors.navyHeading}
              />
            </Pressable>
          </View>

          <Text
            style={[
              styles.emptyHeroTitle,
              isObsidian && { color: PenguinObsidianTheme.textPrimary },
            ]}>
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

          <Text
            style={[
              styles.quickStartHeader,
              isObsidian && { color: PenguinObsidianTheme.textPrimary },
            ]}>
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
                style={[
                  styles.habitCard,
                  isObsidian && {
                    backgroundColor: PenguinObsidianTheme.card,
                    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                  },
                ]}>
                <HabitIconBadge icon={idea.icon} size={52} />
                <View style={styles.habitInfo}>
                  <Text
                    style={[
                      styles.habitName,
                      isObsidian && { color: PenguinObsidianTheme.textPrimary },
                    ]}>
                    {idea.name}
                  </Text>
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
    <SafeAreaView
      style={[
        styles.safeArea,
        isObsidian && { backgroundColor: PenguinObsidianTheme.background },
      ]}
      edges={['top']}>
      <ConfettiBlast visible={blastVisible} triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Greeting & Action Bar */}
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
            <Text
              style={[
                styles.greetingTitle,
                isObsidian && { color: PenguinObsidianTheme.textPrimary },
              ]}
              numberOfLines={1}>
              Hi, {firstName} 👋
            </Text>
            <Text style={styles.greetingDate}>Friday, 16 October</Text>
          </View>

          {/* Obsidian Penguin Skin Theme Toggle */}
          <Pressable
            onPress={handleToggleObsidian}
            style={[
              styles.iconCircleBtn,
              isObsidian && {
                backgroundColor: PenguinObsidianTheme.card,
                borderColor: PenguinObsidianTheme.bellyHighlightBorder,
              },
            ]}>
            <Text style={{ fontSize: 17 }}>{isObsidian ? '☀️' : '🐧'}</Text>
          </Pressable>

          {/* Settings Shortcut */}
          <Pressable
            onPress={() => {
              playSound('tap');
              router.push('/(tabs)/settings' as any);
            }}
            style={[
              styles.iconCircleBtn,
              isObsidian && {
                backgroundColor: PenguinObsidianTheme.card,
                borderColor: PenguinObsidianTheme.bellyHighlightBorder,
              },
            ]}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={
                isObsidian
                  ? PenguinObsidianTheme.textPrimary
                  : PenguColors.navyHeading
              }
            />
          </Pressable>

          <CoinBadge />
        </View>

        {/* Interactive 7-Day User Journey Calendar Strip */}
        <View
          style={[
            styles.journeyStripCard,
            isObsidian && {
              backgroundColor: PenguinObsidianTheme.card,
              borderColor: PenguinObsidianTheme.bellyHighlightBorder,
            },
          ]}>
          <View style={styles.journeyHeaderRow}>
            <Text
              style={[
                styles.journeyStripTitle,
                isObsidian && { color: PenguinObsidianTheme.textPrimary },
              ]}>
              🔥 Your Habit Journey
            </Text>
            <Pressable
              onPress={() => {
                playSound('tap');
                router.push('/progress/calendar' as any);
              }}
              style={styles.journeyMapBtn}>
              <Text style={styles.journeyMapBtnText}>Full Calendar</Text>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={PenguColors.primaryGreen}
              />
            </Pressable>
          </View>

          <View style={styles.journeyDaysRow}>
            {JOURNEY_WEEK.map((d) => {
              const doneCount = (completedByDate[d.key] ?? []).length;
              const isAllDone = doneCount >= Math.max(1, totalCount);
              const isPartial = doneCount > 0 && !isAllDone;
              return (
                <Pressable
                  key={d.key}
                  onPress={() => {
                    playSound('tap');
                    router.push('/progress/day' as any);
                  }}
                  style={[
                    styles.journeyDayCol,
                    d.isToday && styles.journeyDayColToday,
                    isObsidian &&
                      d.isToday && {
                        backgroundColor: PenguinObsidianTheme.cardSelected,
                      },
                  ]}>
                  <Text
                    style={[
                      styles.journeyDayName,
                      isObsidian && {
                        color: PenguinObsidianTheme.textSecondary,
                      },
                      d.isToday && { color: PenguColors.primaryGreen },
                    ]}>
                    {d.day}
                  </Text>
                  <View
                    style={[
                      styles.journeyFlameCircle,
                      isAllDone && styles.journeyFlameCircleComplete,
                      isPartial && styles.journeyFlameCirclePartial,
                    ]}>
                    <Text style={{ fontSize: 13 }}>
                      {isAllDone ? '🔥' : isPartial ? '⚡' : d.date}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Living Arctic Ecosystem Hero Card with Waddling Pingu & Score HUD */}
        <LivingEcosystemPanel
          completedCount={completedCount}
          totalCount={totalCount}
          onPressFocus={() => router.push('/(tabs)/focus' as any)}
          onPressCelebrate={() => router.push('/habits/celebration' as any)}
        />

        {/* Build Habits vs. Break Bad Habits Mode Switcher */}
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.habitTypeTabs,
              isObsidian && {
                backgroundColor: PenguinObsidianTheme.card,
                borderColor: PenguinObsidianTheme.bellyHighlightBorder,
              },
            ]}>
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
                ✨ Build ({buildHabits.length})
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
                🛡️ Break Bad ({breakHabits.length})
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push('/habits/all' as any)}
            style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>All</Text>
            <Ionicons
              name="arrow-forward"
              size={15}
              color={PenguColors.primaryGreen}
            />
          </Pressable>
        </View>

        {/* BUILD HABITS LIST */}
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
                    isObsidian && {
                      backgroundColor: PenguinObsidianTheme.card,
                      borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                    },
                    isDone && styles.habitCardDone,
                    isDone &&
                      isObsidian && {
                        backgroundColor: PenguinObsidianTheme.cardSelected,
                        borderColor: PenguinObsidianTheme.auroraEmerald,
                      },
                  ]}>
                  <HabitIconBadge icon={habit.icon} size={54} />
                  <View style={styles.habitInfo}>
                    <Text
                      style={[
                        styles.habitName,
                        isObsidian && {
                          color: PenguinObsidianTheme.textPrimary,
                        },
                      ]}>
                      {habit.name}
                    </Text>
                    <View style={styles.habitMetaRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={PenguColors.textSecondary}
                      />
                      <Text style={styles.habitTimeText}>
                        {habit.reminderTime} • 🔥 {habit.streak}d
                      </Text>
                    </View>
                  </View>

                  {/* Quick Focus Timer Launch Button */}
                  {!isDone && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        playSound('tap');
                        router.push('/(tabs)/focus' as any);
                      }}
                      style={styles.focusMiniPill}>
                      <Ionicons name="timer-outline" size={15} color="#0284C7" />
                    </Pressable>
                  )}

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
              <View
                key={habit.id}
                style={[
                  styles.habitCard,
                  isObsidian && {
                    backgroundColor: PenguinObsidianTheme.card,
                    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                  },
                ]}>
                <HabitIconBadge icon={habit.icon} size={52} />
                <View style={styles.habitInfo}>
                  <Text
                    style={[
                      styles.habitName,
                      isObsidian && { color: PenguinObsidianTheme.textPrimary },
                    ]}>
                    {habit.name}
                  </Text>
                  <Text style={styles.cleanStreakBadge}>
                    🛡️ {habit.cleanHours ?? 24}h Temptation-Free • 🔥{' '}
                    {habit.streak}d
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
                  <Text style={styles.resistBtnSub}>+10 XP</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Daily Check-in & Invite Friends Quick Row */}
        <View style={styles.bottomBannersCol}>
          <Pressable
            onPress={() => {
              playSound('tap');
              router.push('/checkin/mood' as any);
            }}
            style={({ pressed }) => [
              styles.checkInBanner,
              isObsidian && {
                backgroundColor: PenguinObsidianTheme.card,
                borderColor: PenguinObsidianTheme.bellyHighlightBorder,
              },
              pressed && { opacity: 0.92 },
            ]}>
            <Image
              source={MASCOT_IMAGES.encouraging}
              style={styles.checkInMascot}
              contentFit="contain"
            />
            <View style={styles.checkInTextCol}>
              <Text
                style={[
                  styles.checkInTitle,
                  isObsidian && { color: PenguinObsidianTheme.textPrimary },
                ]}>
                Daily mood & gratitude check-in
              </Text>
              <Text style={styles.checkInSubtitle}>
                {todayMood
                  ? `Feeling ${todayMood.mood.toLowerCase()} today • Tap to update`
                  : 'How are you feeling today? (+15 XP)'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                isObsidian
                  ? PenguinObsidianTheme.textPrimary
                  : PenguColors.navyHeading
              }
            />
          </Pressable>
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
    paddingTop: 10,
    paddingBottom: 36,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#BAE6FD',
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
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  greetingDate: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    marginTop: 1,
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyStripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    marginBottom: 14,
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  journeyStripTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  journeyMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  journeyMapBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  journeyDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journeyDayCol: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 7,
    borderRadius: 14,
    gap: 4,
  },
  journeyDayColToday: {
    backgroundColor: PenguColors.surfaceMint,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  journeyDayName: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  journeyFlameCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyFlameCircleComplete: {
    backgroundColor: '#DCFCE7',
  },
  journeyFlameCirclePartial: {
    backgroundColor: '#FEF3C7',
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
  habitTypeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  habitTypePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  habitTypePillActive: {
    backgroundColor: PenguColors.primaryGreen,
  },
  habitTypePillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  habitTypePillTextActive: {
    color: '#FFFFFF',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  habitList: {
    gap: 12,
    marginBottom: 18,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: PenguColors.cardBorder,
    borderBottomColor: '#CBD5E1',
    gap: 12,
  },
  habitCardDone: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
    borderBottomColor: '#86EFAC',
  },
  habitInfo: {
    flex: 1,
    gap: 4,
  },
  habitName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
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
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  focusMiniPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  cleanStreakBadge: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  resistBtn: {
    backgroundColor: PenguColors.primaryGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: PenguColors.primaryGreenDark,
    alignItems: 'center',
  },
  resistBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resistBtnSub: {
    fontFamily: Fonts?.rounded,
    fontSize: 10,
    fontWeight: '800',
    color: '#DCFCE7',
  },
  bottomBannersCol: {
    gap: 12,
  },
  checkInBanner: {
    backgroundColor: PenguColors.surfaceIce,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.iceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 12,
  },
  checkInMascot: {
    width: 68,
    height: 68,
    marginBottom: -8,
  },
  checkInTextCol: {
    flex: 1,
    gap: 3,
  },
  checkInTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  checkInSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  emptyTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
