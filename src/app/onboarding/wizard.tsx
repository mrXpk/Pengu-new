import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
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

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
  ArcticFooter,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { DayOfWeek, usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

const TOTAL_STEPS = 22;

const HABIT_MODE_OPTIONS = [
  {
    id: 'both',
    title: 'Build Good + Break Bad Habits',
    sub: 'Complete daily steps & quit distractions (Recommended)',
    emoji: '🔥',
  },
  {
    id: 'build',
    title: 'Build Positive Daily Habits',
    sub: 'Start small routines for study, focus & health',
    emoji: '🌱',
  },
  {
    id: 'break',
    title: 'Break Bad Habits & Triggers',
    sub: 'Stop doomscrolling, procrastinating & late nights',
    emoji: '🛡️',
  },
];

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

const ADHD_DRAIN_OPTIONS = [
  {
    id: 'Doomscrolling social media in bed',
    sub: 'Losing 1–3 hours of focus daily',
    emoji: '📱',
  },
  {
    id: 'Task paralysis & overwhelmed starts',
    sub: 'Knowing what to do, but struggling to start',
    emoji: '🧊',
  },
  {
    id: 'Jumping between 5 tabs at once',
    sub: 'Starting tasks without finishing them',
    emoji: '⚡',
  },
  {
    id: 'Losing motivation after day 3',
    sub: 'Initial excitement fades without rewards',
    emoji: '📉',
  },
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

const BAD_HABIT_OPTIONS = [
  { id: 'No doomscrolling in bed', sub: 'Put phone away 30m before sleep', emoji: '📵' },
  { id: 'No procrastinating study blocks', sub: 'Start with a 5m Pingu Sprint', emoji: '⏱️' },
  { id: 'No sugary soda or junk snacks', sub: 'Swap with water or fruit', emoji: '🥤' },
  { id: 'No hitting snooze 3 times', sub: 'Feet on floor when alarm rings', emoji: '⏰' },
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

  // Answers state across 22 steps
  const [userName, setUserName] = useState('Pratap');
  const [habitMode, setHabitMode] = useState<'build' | 'break' | 'both'>('both');
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
  const [adhdDrain, setAdhdDrain] = useState(
    'Doomscrolling social media in bed'
  );
  const [dailyMinutes, setDailyMinutes] = useState('5 minutes');
  const [timeOfDay, setTimeOfDay] = useState('Evening');
  const [reminderCue, setReminderCue] = useState('After school or work');
  const [firstHabitName, setFirstHabitName] = useState(
    'Review one page of notes'
  );
  const [customHabitText, setCustomHabitText] = useState('');
  const [badHabitToBreak, setBadHabitToBreak] = useState(
    'No doomscrolling in bed'
  );
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
  const [buddyName, setBuddyName] = useState('Cozy Pingu');
  const [themePreference, setThemePreference] = useState<'light' | 'dark'>(
    'dark'
  );
  const [pledgeProgress, setPledgeProgress] = useState(0);
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [sampleChecked, setSampleChecked] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleBack = () => {
    playSound('tap', 0.9);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    playSound('tap', 1.1);
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
        badHabitToBreak,
        habitMode,
        repeatDays,
        supportPrefs,
        buddyName,
        themePreference,
      });
      playSound('celebration');
      router.push('/onboarding/paywall' as any);
    }
  };

  const startHoldPledge = () => {
    if (pledgeSigned) return;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      setPledgeProgress((prev) => {
        const next = prev + 10;
        playSound('pledgeTick', 1 + next / 120);
        if (next >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setPledgeSigned(true);
          playSound('celebration');
          return 100;
        }
        return next;
      });
    }, 110);
  };

  const stopHoldPledge = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (!pledgeSigned) {
      setPledgeProgress(0);
    }
  };

  const toggleGoal = (id: string) => {
    playSound('tap');
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
    playSound('tap');
    setSupportPrefs((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const toggleDay = (d: DayOfWeek) => {
    playSound('tap');
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
    if (step === 6 || step === 13) return 'Got it, let’s continue';
    if (step === 21)
      return pledgeSigned
        ? 'Pledge Signed! View My Plan'
        : 'Sign Pledge & Continue';
    if (step === 22) return 'Unlock My Custom Plan';
    return 'Continue';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ConfettiBlast visible={step === 22 || pledgeSigned} />
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
              <AnimatedPingu
                pose="checklist"
                mode="breathing"
                size={195}
                speechBubble="Hi! Let’s personalize your routine!"
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

        {/* STEP 2: Build vs Break Mode */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              How can Pingu help{'\n'}you most right now?
            </Text>
            <Text style={styles.subtitle}>
              We support both building positive habits & breaking bad ones.
            </Text>

            <View style={styles.verticalList}>
              {HABIT_MODE_OPTIONS.map((item) => {
                const selected = habitMode === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      playSound('tap');
                      setHabitMode(item.id as 'build' | 'break' | 'both');
                    }}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{item.title}</Text>
                      <Text style={styles.rowSubtitle}>{item.sub}</Text>
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

            <ArcticFooter mascot="waving" height={140} />
          </View>
        )}

        {/* STEP 3: Goals Selection (Up to 3) */}
        {step === 3 && (
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

            <ArcticFooter mascot="waving" height={130} />
          </View>
        )}

        {/* STEP 4: Top Priority Goal */}
        {step === 4 && (
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
                    onPress={() => {
                      playSound('tap');
                      setPriorityGoal(item.id);
                    }}
                    style={[
                      styles.gridCard,
                      { minHeight: 160 },
                      selected && styles.gridCardSelected,
                    ]}>
                    {selected && (
                      <View style={styles.cornerCheck}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={[styles.gridEmoji, { fontSize: 52 }]}>
                      {item.emoji}
                    </Text>
                    <Text style={styles.gridTitle}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ArcticFooter mascot="writing" height={170} />
          </View>
        )}

        {/* STEP 5: Progress Vision */}
        {step === 5 && (
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
                    onPress={() => {
                      playSound('tap');
                      setProgressVision(item.id);
                    }}
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

            <ArcticFooter mascot="waving" height={140} />
          </View>
        )}

        {/* STEP 6: INTERACTIVE VALUE CAROUSEL #1 (Why Willpower Fails vs Pingu Loop) */}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>
                🧠 HABIT SCIENCE INSIGHT
              </Text>
            </View>
            <Text style={styles.title}>
              Why 82% of habits fail{'\n'}without a buddy
            </Text>
            <Text style={styles.subtitle}>
              Willpower runs out on tired days. Pingu uses tiny dopamine loops
              so showing up feels effortless.
            </Text>

            {/* Comparison Graph Card */}
            <View style={styles.graphCard}>
              <View style={styles.graphBarGroup}>
                <View style={styles.graphLabelRow}>
                  <Text style={styles.graphLabel}>
                    🐧 With PenguTask Buddy Loop
                  </Text>
                  <Text style={styles.graphPctGreen}>3.4x Higher</Text>
                </View>
                <View style={styles.graphTrack}>
                  <View
                    style={[
                      styles.graphFill,
                      { width: '88%', backgroundColor: '#10B981' },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.graphBarGroup}>
                <View style={styles.graphLabelRow}>
                  <Text style={styles.graphLabel}>
                    😓 Going Alone on Willpower
                  </Text>
                  <Text style={styles.graphPctGray}>18% Stick</Text>
                </View>
                <View style={styles.graphTrack}>
                  <View
                    style={[
                      styles.graphFill,
                      { width: '24%', backgroundColor: '#94A3B8' },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.mascotCenterWrap}>
              <AnimatedPingu
                pose="celebrating"
                mode="celebrating"
                size={155}
                speechBubble="Small steps + daily rewards = unstoppable!"
              />
            </View>
          </View>
        )}

        {/* STEP 7: Current Routine Check-in */}
        {step === 7 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>How is your routine{'\n'}today?</Text>
            <Text style={styles.subtitle}>There’s no wrong place to start.</Text>

            <View style={styles.verticalList}>
              {ROUTINE_OPTIONS.map((item) => {
                const selected = routineStatus === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      playSound('tap');
                      setRoutineStatus(item.id);
                    }}
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

            <ArcticFooter mascot="waving" height={150} />
          </View>
        )}

        {/* STEP 8: Biggest Challenge */}
        {step === 8 && (
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
                    onPress={() => {
                      playSound('tap');
                      setBiggestChallenge(item.id);
                    }}
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

            <ArcticFooter mascot="encouraging" height={130} />
          </View>
        )}

        {/* STEP 9: Slipping Moments */}
        {step === 9 && (
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
                    onPress={() => {
                      playSound('tap');
                      setSlippingMoment(item.id);
                    }}
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

            <ArcticFooter mascot="waving" height={145} />
          </View>
        )}

        {/* STEP 10: ADHD Focus & Energy Drain */}
        {step === 10 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Which focus trap{'\n'}sounds most familiar?
            </Text>
            <Text style={styles.subtitle}>
              Pingu’s ADHD Body-Doubling studio is built to counter this.
            </Text>

            <View style={styles.verticalList}>
              {ADHD_DRAIN_OPTIONS.map((item) => {
                const selected = adhdDrain === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      playSound('tap');
                      setAdhdDrain(item.id);
                    }}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{item.id}</Text>
                      <Text style={styles.rowSubtitle}>{item.sub}</Text>
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
          </View>
        )}

        {/* STEP 11: Daily Time Choices */}
        {step === 11 && (
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
                    onPress={() => {
                      playSound('tap');
                      setDailyMinutes(item.id);
                    }}
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

            <ArcticFooter mascot="waving" height={135} />
          </View>
        )}

        {/* STEP 12: Time of Day */}
        {step === 12 && (
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
                    onPress={() => {
                      playSound('tap');
                      setTimeOfDay(item.id);
                    }}
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

            <ArcticFooter mascot="sleeping" height={140} />
          </View>
        )}

        {/* STEP 13: INTERACTIVE VALUE CAROUSEL #2 (Your Toolkit: Focus Studio + Co-Op Streaks) */}
        {step === 13 && (
          <View style={styles.stepContainer}>
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>
                ✨ YOUR PENGUTASK SUPERPOWERS
              </Text>
            </View>
            <Text style={styles.title}>
              3 tools that make{'\n'}consistency automatic
            </Text>
            <Text style={styles.subtitle}>
              Tap through the cards below to preview how Pingu keeps you going.
            </Text>

            <View style={styles.carouselTabs}>
              {[
                { idx: 0, label: '⏱️ ADHD Focus' },
                { idx: 1, label: '🤝 Buddy Streaks' },
                { idx: 2, label: '🧊 Ice Shields' },
              ].map((c) => (
                <Pressable
                  key={c.idx}
                  onPress={() => {
                    playSound('tap');
                    setCarouselIndex(c.idx);
                  }}
                  style={[
                    styles.carouselTabPill,
                    carouselIndex === c.idx && styles.carouselTabPillActive,
                  ]}>
                  <Text
                    style={[
                      styles.carouselTabText,
                      carouselIndex === c.idx && styles.carouselTabTextActive,
                    ]}>
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.carouselFeatureCard}>
              {carouselIndex === 0 && (
                <>
                  <AnimatedPingu pose="writing" mode="focus" size={130} />
                  <Text style={styles.carouselFeatureTitle}>
                    ADHD Body-Doubling Focus Timer
                  </Text>
                  <Text style={styles.carouselFeatureSub}>
                    Start a 5m or 25m sprint with Cozy Rain or Brown Noise while
                    Pingu studies right beside you for 2x XP!
                  </Text>
                </>
              )}
              {carouselIndex === 1 && (
                <>
                  <AnimatedPingu
                    pose="celebrating"
                    mode="celebrating"
                    size={130}
                  />
                  <Text style={styles.carouselFeatureTitle}>
                    Shared Co-Op Buddy Streaks
                  </Text>
                  <Text style={styles.carouselFeatureSub}>
                    Pair up with friends on shared habits, cheer on the live
                    community feed, and nudge your partner so neither of you
                    slips!
                  </Text>
                </>
              )}
              {carouselIndex === 2 && (
                <>
                  <AnimatedPingu pose="encouraging" mode="walking" size={130} />
                  <Text style={styles.carouselFeatureTitle}>
                    Streak Ice Shields & Mystery Chests
                  </Text>
                  <Text style={styles.carouselFeatureSub}>
                    Crack open daily Mystery Ice Chests for coins, outfits &
                    Ice Shields that protect your streak if life gets busy.
                  </Text>
                </>
              )}
            </View>
          </View>
        )}

        {/* STEP 14: Habit Reminder Cue */}
        {step === 14 && (
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
                    onPress={() => {
                      playSound('tap');
                      setReminderCue(item.id);
                    }}
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

            <ArcticFooter mascot="waving" height={130} />
          </View>
        )}

        {/* STEP 15: Choose Your First Small Good Habit */}
        {step === 15 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Choose your first{'\n'}habit to build
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
                    onPress={() => {
                      playSound('tap');
                      setFirstHabitName(item.id);
                    }}
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
          </View>
        )}

        {/* STEP 16: Choose a Bad Habit to Break */}
        {step === 16 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Which bad habit{'\n'}shall we break?
            </Text>
            <Text style={styles.subtitle}>
              We’ll track your clean-streak hours & reward you for resisting!
            </Text>

            <View style={styles.verticalList}>
              {BAD_HABIT_OPTIONS.map((item) => {
                const selected = badHabitToBreak === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      playSound('tap');
                      setBadHabitToBreak(item.id);
                    }}
                    style={[
                      styles.rowCard,
                      selected && styles.gridCardSelected,
                    ]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{item.id}</Text>
                      <Text style={styles.rowSubtitle}>{item.sub}</Text>
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
          </View>
        )}

        {/* STEP 17: Schedule & Reminder Setup */}
        {step === 17 && (
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
                    onPress={() => {
                      playSound('tap');
                      setRepeatDays(p.days);
                    }}
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

            <ArcticFooter mascot="checklist" height={150} />
          </View>
        )}

        {/* STEP 18: Support Preferences */}
        {step === 18 && (
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

            <ArcticFooter mascot="encouraging" height={145} />
          </View>
        )}

        {/* STEP 19: Meet Your Habit Buddy */}
        {step === 19 && (
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
                    onPress={() => {
                      playSound('tap');
                      setBuddyName(item.id);
                    }}
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
                      style={{ width: 92, height: 92 }}
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
          </View>
        )}

        {/* STEP 20: Choose Your Aesthetic (Arctic Iceberg vs. Penguin Obsidian Dark) */}
        {step === 20 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Choose your{'\n'}app aesthetic
            </Text>
            <Text style={styles.subtitle}>
              Try our signature Penguin Obsidian plumage dark theme or crisp
              Arctic Day.
            </Text>

            <View style={styles.verticalList}>
              <Pressable
                onPress={() => {
                  playSound('tap');
                  setThemePreference('dark');
                }}
                style={[
                  styles.themePreviewCard,
                  { backgroundColor: '#09111E', borderColor: '#38BDF8' },
                  themePreference === 'dark' && {
                    borderWidth: 3,
                    borderColor: '#10B981',
                  },
                ]}>
                <Text style={{ fontSize: 38 }}>🐧🌌</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: '#FFFFFF' }]}>
                    Penguin Obsidian (Dark Plumage)
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: '#94A3B8' }]}>
                    Velvet midnight feather coat + tuxedo belly borders & beak
                    gold
                  </Text>
                </View>
                {themePreference === 'dark' && (
                  <View style={styles.radioRightSelected}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  playSound('tap');
                  setThemePreference('light');
                }}
                style={[
                  styles.themePreviewCard,
                  { backgroundColor: '#FFFFFF', borderColor: '#BAE6FD' },
                  themePreference === 'light' && styles.gridCardSelected,
                ]}>
                <Text style={{ fontSize: 38 }}>🏔️☀️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>Arctic Iceberg (Light)</Text>
                  <Text style={styles.rowSubtitle}>
                    Warm sunlit snow, pastel sky blues & fresh mint cards
                  </Text>
                </View>
                {themePreference === 'light' && (
                  <View style={styles.radioRightSelected}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 21: Interactive Flipper Commitment Pledge */}
        {step === 21 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>
              Seal your pact{'\n'}with {buddyName}
            </Text>
            <Text style={styles.subtitle}>
              Press & hold the button below for 1 second to sign your daily
              small-step pledge.
            </Text>

            <View style={styles.pledgeCard}>
              <AnimatedPingu
                pose={pledgeSigned ? 'celebrating' : 'waving'}
                mode={pledgeSigned ? 'celebrating' : 'breathing'}
                size={150}
                speechBubble={
                  pledgeSigned
                    ? '🎉 Pact sealed! We’re official partners!'
                    : '“I promise to show up for 1 small step each day!”'
                }
              />

              <Text style={styles.pledgeQuote}>
                “I, {userName.trim() || 'Pratap'}, commit to taking one small
                step every day and forgiving myself quickly if I miss a day.”
              </Text>

              <Pressable
                onPressIn={startHoldPledge}
                onPressOut={stopHoldPledge}
                onPress={() => {
                  if (!pledgeSigned) {
                    setPledgeProgress(100);
                    setPledgeSigned(true);
                    playSound('celebration');
                  }
                }}
                style={[
                  styles.holdFlipperBtn,
                  pledgeSigned && styles.holdFlipperBtnDone,
                ]}>
                <View
                  style={[
                    styles.holdFillBar,
                    { width: `${pledgeProgress}%` },
                  ]}
                />
                <Text style={styles.holdFlipperText}>
                  {pledgeSigned
                    ? '✅ Flipper Pact Signed!'
                    : `🐧 Hold or Tap to Sign (${pledgeProgress}%)`}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 22: Personal Plan Preview & Sample Check-in Celebration */}
        {step === 22 && (
          <View style={styles.stepContainer}>
            <View style={styles.sampleBadge}>
              <Text style={styles.sampleBadgeText}>
                🎉 100% CUSTOM PLAN READY
              </Text>
            </View>
            <Text style={styles.title}>
              Your small-step plan,{'\n'}
              {userName.trim() || 'Pratap'}
            </Text>
            <Text style={styles.subtitle}>
              Built around your 21 answers. Tap your first habit below to test a
              check-in!
            </Text>

            <Pressable
              onPress={() => {
                playSound('checkin');
                setSampleChecked(!sampleChecked);
              }}
              style={[
                styles.sampleHabitCard,
                sampleChecked && styles.gridCardSelected,
              ]}>
              <Text style={{ fontSize: 32 }}>📘</Text>
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

            <View style={styles.planSummaryCard}>
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>🛡️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>Habit to Break</Text>
                  <Text style={styles.planValue}>{badHabitToBreak}</Text>
                </View>
              </View>
              <View style={styles.planDivider} />
              <View style={styles.planRow}>
                <Text style={styles.planEmoji}>🐧</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planLabel}>Companion & Theme</Text>
                  <Text style={styles.planValue}>
                    {buddyName} •{' '}
                    {themePreference === 'dark'
                      ? 'Penguin Obsidian'
                      : 'Arctic Day'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.celebrationStage}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={styles.stageBg}
                contentFit="cover"
              />
              <AnimatedPingu
                pose="celebrating"
                mode="celebrating"
                size={175}
                speechBubble="Let’s unlock your routine!"
              />
            </View>
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
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    minWidth: 46,
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
    fontSize: 30,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  mascotCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
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
    padding: 15,
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PenguColors.cardBorder,
    borderBottomColor: '#CBD5E1',
    position: 'relative',
    gap: 5,
  },
  dashedCard: {
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  gridCardSelected: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
    borderBottomColor: PenguColors.primaryGreenDark,
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
    fontSize: 38,
  },
  gridTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  gridSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    textAlign: 'center',
  },
  verticalList: {
    gap: 12,
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PenguColors.cardBorder,
    borderBottomColor: '#CBD5E1',
  },
  rowEmoji: {
    fontSize: 30,
  },
  rowTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
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
  insightBadge: {
    alignSelf: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  insightBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  graphCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 16,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  graphBarGroup: {
    gap: 6,
  },
  graphLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  graphLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  graphPctGreen: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '900',
    color: '#10B981',
  },
  graphPctGray: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  graphTrack: {
    width: '100%',
    height: 14,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  graphFill: {
    height: '100%',
    borderRadius: 999,
  },
  carouselTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  carouselTabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    alignItems: 'center',
  },
  carouselTabPillActive: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  carouselTabText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  carouselTabTextActive: {
    color: '#FFFFFF',
  },
  carouselFeatureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PenguColors.mintBorder,
    gap: 10,
  },
  carouselFeatureTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  carouselFeatureSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
  themePreviewCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
  },
  pledgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PenguColors.mintBorder,
    gap: 16,
  },
  pledgeQuote: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 23,
    fontStyle: 'italic',
  },
  holdFlipperBtn: {
    width: '100%',
    height: 58,
    borderRadius: 999,
    backgroundColor: '#091E42',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  holdFlipperBtnDone: {
    backgroundColor: PenguColors.primaryGreen,
  },
  holdFillBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#10B981',
  },
  holdFlipperText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    zIndex: 5,
  },
  planSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    marginBottom: 14,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  planEmoji: {
    fontSize: 26,
  },
  planLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
  },
  planValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  planDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  sampleBadge: {
    alignSelf: 'center',
    backgroundColor: '#D5F3E0',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  sampleBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '900',
    color: PenguColors.primaryGreenDark,
  },
  sampleHabitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: PenguColors.cardBorder,
    marginBottom: 12,
  },
  celebrationStage: {
    width: '100%',
    height: 185,
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
});
