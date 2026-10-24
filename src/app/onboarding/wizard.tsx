import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ArcticFooter,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { DayOfWeek, usePenguStore } from '@/store/usePenguStore';

const TOTAL_STEPS = 16;

const GOAL_OPTIONS = [
  { id: 'Study', label: 'Study', emoji: '📚' },
  { id: 'Fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'Sleep', label: 'Sleep', emoji: '🌙' },
  { id: 'Focus', label: 'Focus', emoji: '💡' },
  { id: 'Wellbeing', label: 'Wellbeing', emoji: '❤️' },
  { id: 'Daily routine', label: 'Daily routine', emoji: '📅' },
];

const PROGRESS_OPTIONS = [
  { id: 'Study more consistently', emoji: '📅' },
  { id: 'Feel prepared for exams', emoji: '🎓' },
  { id: 'Finish what I start', emoji: '✅' },
  { id: 'Build confidence', emoji: '⭐' },
];

const ROUTINE_OPTIONS = [
  {
    id: 'I’m starting fresh',
    subtitle: 'Building a new daily habit',
    emoji: '🌱',
  },
  {
    id: 'I’m consistent sometimes',
    subtitle: 'Some good days, some missed days',
    emoji: '📅',
  },
  {
    id: 'I’m improving an existing routine',
    subtitle: 'Making my habits steadier',
    emoji: '📊',
  },
];

const CHALLENGE_OPTIONS = [
  { id: 'I forget', emoji: '🧠' },
  { id: 'I get distracted', emoji: '📱' },
  { id: 'I feel low on energy', emoji: '🪫' },
  { id: 'My goals feel too big', emoji: '🏔️' },
  { id: 'My schedule changes', emoji: '🗓️' },
];

const SLIPPING_OPTIONS = [
  { id: 'On busy days', emoji: '⏰' },
  { id: 'On weekends', emoji: '☀️' },
  { id: 'After I miss one day', emoji: '📅' },
  { id: 'When progress feels slow', emoji: '🐢' },
];

const TIME_CHOICES = [
  { id: '2 minutes', subtitle: 'Quickest start', suggested: false },
  { id: '5 minutes', subtitle: 'Easy daily win', suggested: true },
  { id: '10 minutes', subtitle: 'Steady focus', suggested: false },
  { id: '15 minutes', subtitle: 'Deeper session', suggested: false },
];

const TIME_OF_DAY_OPTIONS = [
  { id: 'Morning', subtitle: 'Start the day clear', emoji: '☀️' },
  { id: 'Afternoon', subtitle: 'Midday reset', emoji: '⛅' },
  { id: 'Evening', subtitle: 'Wind down with focus', emoji: '🌙' },
  { id: 'Keep it flexible', subtitle: 'Anytime today', emoji: '🔄' },
];

const REMINDER_CUE_OPTIONS = [
  { id: 'After brushing my teeth', emoji: '🪥' },
  { id: 'After breakfast', emoji: '☕' },
  { id: 'After school or work', emoji: '🎒' },
  { id: 'Before bed', emoji: '🌙' },
];

const STARTER_HABIT_IDEAS = [
  { id: 'Review one page of notes', subtitle: 'About 5 minutes', emoji: '📘' },
  { id: 'Practice one question', subtitle: 'A focused first step', emoji: '✏️' },
  { id: 'Read one page', subtitle: 'Start small', emoji: '📖' },
  { id: 'Create my own', subtitle: 'Write a custom habit', emoji: '➕', custom: true },
];

const SUPPORT_OPTIONS = [
  { id: 'Gentle reminders', emoji: '🔔' },
  { id: 'Clear progress', emoji: '📈' },
  { id: 'Penguin rewards', emoji: '🎁' },
  { id: 'Focused sessions', emoji: '⏱️' },
];

const BUDDY_OPTIONS = [
  { id: 'Classic Pingu', img: MASCOT_IMAGES.waving },
  { id: 'Cozy Pingu', img: MASCOT_IMAGES.encouraging },
  { id: 'Explorer Pingu', img: MASCOT_IMAGES.checklist },
  { id: 'Sleepy Pingu', img: MASCOT_IMAGES.sleeping },
];

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function OnboardingWizardScreen() {
  const router = useRouter();
  const completeOnboarding = usePenguStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);

  // Answers state matching the 16 screens
  const [userName, setUserName] = useState('Pratap');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Study',
    'Focus',
  ]);
  const [priorityGoal, setPriorityGoal] = useState('Study');
  const [progressVision, setProgressVision] = useState(
    'Study more consistently'
  );
  const [routineStatus, setRoutineStatus] = useState(
    'I’m consistent sometimes'
  );
  const [biggestChallenge, setBiggestChallenge] = useState('I get distracted');
  const [slippingMoment, setSlippingMoment] = useState('On busy days');
  const [dailyMinutes, setDailyMinutes] = useState('5 minutes');
  const [timeOfDay, setTimeOfDay] = useState('Evening');
  const [reminderCue, setReminderCue] = useState('After school or work');
  const [firstHabitName, setFirstHabitName] = useState(
    'Review one page of notes'
  );
  const [customHabitText, setCustomHabitText] = useState('');
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [supportPrefs, setSupportPrefs] = useState<string[]>([
    'Gentle reminders',
    'Clear progress',
    'Penguin rewards',
  ]);
  const [buddyName, setBuddyName] = useState('Classic Pingu');
  const [sampleChecked, setSampleChecked] = useState(true);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      const resolvedHabit =
        firstHabitName === 'Create my own' && customHabitText.trim()
          ? customHabitText.trim()
          : firstHabitName === 'Create my own'
          ? 'Review one page of notes'
          : firstHabitName;

      completeOnboarding({
        userName: userName.trim() || 'Pratap',
        goals: selectedGoals,
        priorityGoal,
        progressVision,
        routineStatus,
        biggestChallenge,
        slippingMoment,
        dailyMinutes,
        timeOfDay,
        reminderCue,
        firstHabitName: resolvedHabit,
        repeatDays,
        supportPrefs,
        buddyName,
      });
      router.push('/onboarding/paywall' as any);
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        const next = prev.filter((g) => g !== id);
        if (priorityGoal === id && next.length > 0) {
          setPriorityGoal(next[0]);
        }
        return next;
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleSupport = (id: string) => {
    setSupportPrefs((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const toggleDay = (d: DayOfWeek) => {
    setRepeatDays((prev) =>
      prev.includes(d)
        ? prev.length > 1
          ? prev.filter((item) => item !== d)
          : prev
        : [...prev, d]
    );
  };

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  const getCtaLabel = () => {
    if (step === 15) return 'Preview my first day';
    if (step === 16) return 'See my membership options';
    return 'Continue';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Progress Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={10}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={PenguColors.navyHeading}
          />
        </Pressable>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPct}%` }]}
          />
        </View>
        <Text style={styles.stepCounter}>
          {step}/{TOTAL_STEPS}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* STEP 1: Name Setup */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { textAlign: 'left' }]}>
              What should we{'\n'}call you?
            </Text>
            <Text style={[styles.subtitle, { textAlign: 'left' }]}>
              It’s nice to meet you!
            </Text>

            <View style={styles.mascotCenterWrap}>
              <Image
                source={MASCOT_IMAGES.checklist}
                style={{ width: 220, height: 220 }}
                contentFit="contain"
              />
            </View>

            <Text style={styles.inputLabel}>Your name</Text>
            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholder="e.g. Pratap"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />
          </View>
        )}

        {/* STEP 2: Goals Selection (Up to 3) */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What would you like{'\n'}to improve?</Text>
            <Text style={styles.subtitle}>
              Choose up to 3. We’ll shape your starter plan.
            </Text>

            <View style={styles.grid2Col}>
              {GOAL_OPTIONS.map((item) => {
                const selected = selectedGoals.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleGoal(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="waving" height={135} />
          </View>
        )}

        {/* STEP 3: Top Priority Goal */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Which goal matters{'\n'}most right now?
            </Text>
            <Text style={styles.subtitle}>
              We’ll start with one small habit.
            </Text>

            <View style={styles.grid2Col}>
              {(selectedGoals.length > 0
                ? GOAL_OPTIONS.filter((g) => selectedGoals.includes(g.id))
                : GOAL_OPTIONS.slice(0, 2)
              ).map((item) => {
                const selected = priorityGoal === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setPriorityGoal(item.id)}
                    style={[
                      styles.gridCard,
                      { minHeight: 165 },
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={[styles.gridEmoji, { fontSize: 54 }]}>
                      {item.emoji}
                    </Text>
                    <Text style={styles.gridTitle}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="writing" height={185} />
          </View>
        )}

        {/* STEP 4: Progress Vision */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              What would progress{'\n'}look like?
            </Text>
            <Text style={styles.subtitle}>
              Choose what matters most for your {priorityGoal.toLowerCase()} goal.
            </Text>

            <View style={styles.verticalList}>
              {PROGRESS_OPTIONS.map((item) => {
                const selected = progressVision === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setProgressVision(item.id)}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <Text style={styles.rowTitle}>{item.id}</Text>
                    <View
                      style={[
                        styles.radioRight,
                        selected && styles.radioRightSelected,
                      ]}>
                      {selected && (
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="waving" height={150} />
          </View>
        )}

        {/* STEP 5: Current Routine Check-in */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>How is your routine{'\n'}today?</Text>
            <Text style={styles.subtitle}>There’s no wrong place to start.</Text>

            <View style={styles.verticalList}>
              {ROUTINE_OPTIONS.map((item) => {
                const selected = routineStatus === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setRoutineStatus(item.id)}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{item.id}</Text>
                      <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioRight,
                        selected && styles.radioRightSelected,
                      ]}>
                      {selected && (
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="waving" height={160} />
          </View>
        )}

        {/* STEP 6: Biggest Challenge */}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              What usually gets{'\n'}in the way?
            </Text>
            <Text style={styles.subtitle}>Choose your biggest challenge.</Text>

            <View style={styles.verticalList}>
              {CHALLENGE_OPTIONS.map((item) => {
                const selected = biggestChallenge === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setBiggestChallenge(item.id)}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <View
                      style={[
                        styles.radioLeft,
                        selected && styles.radioLeftSelected,
                      ]}>
                      {selected && <View style={styles.radioInnerDot} />}
                    </View>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <Text style={styles.rowTitle}>{item.id}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="encouraging" height={135} />
          </View>
        )}

        {/* STEP 7: Slipping Moments */}
        {step === 7 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>When do your{'\n'}habits slip?</Text>
            <Text style={styles.subtitle}>
              We’ll help you plan for tough days.
            </Text>

            <View style={styles.grid2Col}>
              {SLIPPING_OPTIONS.map((item) => {
                const selected = slippingMoment === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSlippingMoment(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="waving" height={155} />
          </View>
        )}

        {/* STEP 8: Daily Time Choices */}
        {step === 8 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              How much time{'\n'}feels realistic?
            </Text>
            <Text style={styles.subtitle}>
              Small habits are easier to keep on busy days.
            </Text>

            <View style={styles.grid2Col}>
              {TIME_CHOICES.map((item) => {
                const selected = dailyMinutes === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setDailyMinutes(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {item.suggested && (
                      <View style={styles.suggestedPill}>
                        <Text style={styles.suggestedPillText}>Suggested</Text>
                      </View>
                    )}
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>⏱️</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                    <Text style={styles.gridSub}>{item.subtitle}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.infoNoteRow}>
              <Ionicons
                name="information-circle"
                size={18}
                color={PenguColors.primaryGreen}
              />
              <Text style={styles.infoNoteText}>
                You can adjust this anytime.
              </Text>
            </View>

            <ArcticFooter mascot="waving" height={140} />
          </View>
        )}

        {/* STEP 9: Time of Day */}
        {step === 9 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>When could your{'\n'}habit fit?</Text>
            <Text style={styles.subtitle}>
              Pick a time of day that feels easiest.
            </Text>

            <View style={styles.grid2Col}>
              {TIME_OF_DAY_OPTIONS.map((item) => {
                const selected = timeOfDay === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setTimeOfDay(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                    <Text style={styles.gridSub}>{item.subtitle}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="sleeping" height={150} />
          </View>
        )}

        {/* STEP 10: Habit Reminder Cue */}
        {step === 10 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              What could remind{'\n'}you to start?
            </Text>
            <Text style={styles.subtitle}>
              Connect your habit to something you already do.
            </Text>

            <View style={styles.grid2Col}>
              {REMINDER_CUE_OPTIONS.map((item) => {
                const selected = reminderCue === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setReminderCue(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.speechMini}>
              <Text style={styles.speechMiniText}>
                “After this, I’ll do my habit.”
              </Text>
            </View>

            <ArcticFooter mascot="waving" height={140} />
          </View>
        )}

        {/* STEP 11: Choose Your First Small Habit */}
        {step === 11 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Choose your first{'\n'}small habit
            </Text>
            <Text style={styles.subtitle}>
              A few ideas for your {priorityGoal.toLowerCase()} goal.
            </Text>

            <View style={styles.grid2Col}>
              {STARTER_HABIT_IDEAS.map((item) => {
                const selected = firstHabitName === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setFirstHabitName(item.id)}
                    style={[
                      styles.gridCard,
                      item.custom && styles.dashedCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                    <Text style={styles.gridSub}>{item.subtitle}</Text>
                  </Pressable>
                );
              })}
            </View>

            {firstHabitName === 'Create my own' && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.inputLabel}>Custom habit name</Text>
                <TextInput
                  value={customHabitText}
                  onChangeText={setCustomHabitText}
                  placeholder="e.g. Summarize 3 flashcards"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
              </View>
            )}

            <ArcticFooter mascot="writing" height={140} />
          </View>
        )}

        {/* STEP 12: Schedule & Reminder Setup */}
        {step === 12 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Which days work{'\n'}best?</Text>
            <Text style={styles.subtitle}>
              Pick the days you want to practice.
            </Text>

            <View style={styles.presetRow}>
              {[
                {
                  label: 'Weekdays',
                  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as DayOfWeek[],
                },
                { label: 'Every day', days: ALL_DAYS },
              ].map((p) => {
                const isMatch =
                  repeatDays.length === p.days.length &&
                  p.days.every((d) => repeatDays.includes(d));
                return (
                  <Pressable
                    key={p.label}
                    onPress={() => setRepeatDays(p.days)}
                    style={[
                      styles.presetPill,
                      isMatch && styles.presetPillActive,
                    ]}>
                    <Text
                      style={[
                        styles.presetPillText,
                        isMatch && styles.presetPillTextActive,
                      ]}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.daysBubbleRow}>
              {ALL_DAYS.map((day) => {
                const active = repeatDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={[
                      styles.dayCircle,
                      active && styles.dayCircleActive,
                    ]}>
                    <Text
                      style={[
                        styles.dayCircleText,
                        active && styles.dayCircleTextActive,
                      ]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.reminderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Gentle reminder</Text>
                <Text style={styles.rowSubtitle}>
                  {timeOfDay} • {reminderCue}
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{
                  false: '#CBD5E1',
                  true: PenguColors.primaryGreen,
                }}
              />
            </View>

            <ArcticFooter mascot="checklist" height={160} />
          </View>
        )}

        {/* STEP 13: Support Preferences */}
        {step === 13 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              What support would{'\n'}help most?
            </Text>
            <Text style={styles.subtitle}>Choose as many as you like.</Text>

            <View style={styles.grid2Col}>
              {SUPPORT_OPTIONS.map((item) => {
                const selected = supportPrefs.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleSupport(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.gridEmoji}>{item.emoji}</Text>
                    <Text style={styles.gridTitle}>{item.id}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="encouraging" height={155} />
          </View>
        )}

        {/* STEP 14: Meet Your Habit Buddy */}
        {step === 14 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Meet your habit buddy</Text>
            <Text style={styles.subtitle}>
              Choose a penguin to cheer you on.
            </Text>

            <View style={styles.grid2Col}>
              {BUDDY_OPTIONS.map((item) => {
                const selected = buddyName === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setBuddyName(item.id)}
                    style={[
                      styles.gridCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Image
                      source={item.img}
                      style={{ width: 96, height: 96 }}
                      contentFit="contain"
                    />
                    <Text style={styles.gridTitle}>{item.id}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.centerCaption}>
              Earn companion rewards by completing habits.
            </Text>

            <ArcticFooter mascot="waving" height={135} />
          </View>
        )}

        {/* STEP 15: Personal Plan Preview */}
        {step === 15 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Your small-step plan,{'\n'}
              {userName.trim() || 'Pratap'}
            </Text>
            <Text style={styles.subtitle}>Built around your answers.</Text>

            <ArcticFooter mascot="writing" height={155} />

            <View style={styles.planSummaryCard}>
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>📘</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>Habit</Text>
                  <Text style={styles.planValue}>
                    {firstHabitName === 'Create my own' && customHabitText
                      ? customHabitText
                      : firstHabitName}
                  </Text>
                </View>
              </View>
              <View style={styles.planDivider} />
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>⏰</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>When</Text>
                  <Text style={styles.planValue}>{reminderCue}</Text>
                </View>
              </View>
              <View style={styles.planDivider} />
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>📅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>Schedule</Text>
                  <Text style={styles.planValue}>
                    {repeatDays.length === 7
                      ? 'Every day'
                      : repeatDays.length === 5
                      ? 'Weekdays'
                      : `${repeatDays.length} days/wk`}{' '}
                    • About {dailyMinutes}
                  </Text>
                </View>
              </View>
              <View style={styles.planDivider} />
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>🎁</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>Support</Text>
                  <Text style={styles.planValue}>
                    {supportPrefs.join(', ')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.missDayCard}>
              <Text style={{ fontSize: 24 }}>🌱</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.missDayTitle}>If you miss a day</Text>
                <Text style={styles.missDaySub}>
                  Start again at your next planned session.
                </Text>
              </View>
            </View>

            <Pressable onPress={() => setStep(11)} style={styles.editPlanBtn}>
              <Text style={styles.editPlanText}>Edit my plan</Text>
            </Pressable>
          </View>
        )}

        {/* STEP 16: First Check-in Celebration Preview */}
        {step === 16 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              One small step{'\n'}feels good
            </Text>
            <Text style={styles.subtitle}>
              Here’s a preview of your first check-in.
            </Text>

            <View style={styles.sampleBadge}>
              <Text style={styles.sampleBadgeText}>Sample check-in</Text>
            </View>

            <Pressable
              onPress={() => setSampleChecked(!sampleChecked)}
              style={[
                styles.sampleHabitCard,
                sampleChecked && styles.gridCardSelected,
              ]}>
              <Text style={{ fontSize: 34 }}>📘</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {firstHabitName === 'Create my own' && customHabitText
                    ? customHabitText
                    : firstHabitName}
                </Text>
                <Text style={styles.rowSubtitle}>
                  {reminderCue} • About {dailyMinutes}
                </Text>
              </View>
              <View
                style={[
                  styles.radioRight,
                  sampleChecked && styles.radioRightSelected,
                ]}>
                {sampleChecked && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </View>
            </Pressable>

            <View style={styles.celebrationStage}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={styles.stageBg}
                contentFit="cover"
              />
              <Image
                source={MASCOT_IMAGES.celebrating}
                style={{ width: 225, height: 225 }}
                contentFit="contain"
              />
            </View>

            <Text style={styles.centerCaption}>
              Check off your habit each day to build momentum.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View style={styles.footerBar}>
        <PrimaryButton
          label={getCtaLabel()}
          trailingArrow
          onPress={handleNext}
          style={{ width: '100%' }}
        />
        {step === 1 && (
          <Pressable onPress={handleNext} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: PenguColors.primaryGreen,
  },
  stepCounter: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    minWidth: 42,
    textAlign: 'right',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 24,
  },
  stepContainer: {
    width: '100%',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 31,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 37,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  mascotCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  inputLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: PenguColors.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    minHeight: 138,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PenguColors.cardBorder,
    position: 'relative',
    gap: 6,
  },
  dashedCard: {
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  gridCardSelected: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  cornerCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedPill: {
    backgroundColor: '#D5F3E0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  suggestedPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  gridEmoji: {
    fontSize: 40,
  },
  gridTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  gridSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
  },
  verticalList: {
    gap: 12,
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: PenguColors.cardBorder,
  },
  rowEmoji: {
    fontSize: 32,
  },
  rowTitle: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  rowSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  radioRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioRightSelected: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  radioLeft: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLeftSelected: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  infoNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  infoNoteText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  speechMini: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginTop: 14,
  },
  speechMiniText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  presetPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  presetPillActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  presetPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  presetPillTextActive: {
    color: PenguColors.primaryGreenDark,
  },
  daysBubbleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  dayCircleText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  dayCircleTextActive: {
    color: '#FFFFFF',
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  centerCaption: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
  planSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    marginTop: 6,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  planEmoji: {
    fontSize: 28,
  },
  planLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  planValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    marginTop: 2,
  },
  planDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  missDayCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginTop: 12,
  },
  missDayTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  missDaySub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  editPlanBtn: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 6,
  },
  editPlanText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  sampleBadge: {
    alignSelf: 'center',
    backgroundColor: '#D5F3E0',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  sampleBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  sampleHabitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  celebrationStage: {
    width: '100%',
    height: 235,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FAF9F5',
  },
  skipBtn: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 4,
  },
  skipText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: PenguColors.textSecondary,
  },
});
