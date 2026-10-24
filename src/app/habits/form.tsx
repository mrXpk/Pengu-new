import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import {
  DayOfWeek,
  HabitIconType,
  usePenguStore,
} from '@/store/usePenguStore';

const ALL_ICONS: HabitIconType[] = [
  'books',
  'dumbbell',
  'moon',
  'heart',
  'bulb',
  'calendar',
];

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_OPTIONS = ['7:30 AM', '9:00 AM', '12:00 PM', '6:00 PM', '9:00 PM'];

export default function HabitFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const habits = usePenguStore((s) => s.habits);
  const addHabit = usePenguStore((s) => s.addHabit);
  const updateHabit = usePenguStore((s) => s.updateHabit);

  const existing = habits.find((h) => h.id === id);

  const [habitType, setHabitType] = useState<'build' | 'break'>(
    existing?.habitType ?? 'build'
  );
  const [name, setName] = useState(
    existing?.name ?? 'Review one page of notes'
  );
  const [icon, setIcon] = useState<HabitIconType>(existing?.icon ?? 'books');
  const [minimumAction, setMinimumAction] = useState(
    existing?.minimumAction ?? 'One page'
  );
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>(
    existing?.repeatDays ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  );
  const [cue, setCue] = useState(existing?.cue ?? 'After school or work');
  const [reminderEnabled, setReminderEnabled] = useState(
    existing?.reminderEnabled ?? true
  );
  const [reminderTime, setReminderTime] = useState(
    existing?.reminderTime ?? '6:00 PM'
  );
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const toggleDay = (day: DayOfWeek) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const cycleTime = () => {
    const idx = TIME_OPTIONS.indexOf(reminderTime);
    const next = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
    setReminderTime(next);
  };

  const handleSave = () => {
    const cleanName = name.trim() || 'Small daily habit';
    if (existing) {
      updateHabit(existing.id, {
        name: cleanName,
        habitType,
        icon,
        minimumAction: minimumAction.trim() || '5 minutes',
        repeatDays: repeatDays.length > 0 ? repeatDays : ['Mon'],
        cue: cue.trim() || 'Daily routine',
        reminderEnabled,
        reminderTime,
        notes,
      });
    } else {
      addHabit({
        name: cleanName,
        habitType,
        category: habitType === 'break' ? 'Break Habit' : 'Custom',
        icon,
        minimumAction: minimumAction.trim() || '5 minutes',
        repeatDays: repeatDays.length > 0 ? repeatDays : ['Mon'],
        cue: cue.trim() || 'Daily routine',
        reminderEnabled,
        reminderTime,
        notes,
      });
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Hero Banner with Mascot */}
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={PenguColors.navyHeading}
              />
            </Pressable>
            <Text style={styles.pageTitle}>
              {existing ? 'Edit habit' : 'Add habit'}
            </Text>
          </View>
          <Image
            source={MASCOT_IMAGES.writing}
            style={styles.heroMascot}
            contentFit="contain"
          />
        </View>

        {/* Quick Launch: Start a Focus Session from (+) Screen */}
        {!existing && (
          <Pressable
            onPress={() => router.push('/(tabs)/focus' as any)}
            style={({ pressed }) => [
              styles.focusQuickBanner,
              pressed && { opacity: 0.9 },
            ]}>
            <View style={styles.focusQuickIconCircle}>
              <Ionicons
                name="timer-outline"
                size={22}
                color={PenguColors.primaryGreenDark}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.focusQuickTitle}>Start a Focus Session</Text>
              <Text style={styles.focusQuickSub}>
                Study or work alongside Pingu with calm timer & ambient sounds
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.navyHeading}
            />
          </Pressable>
        )}

        {/* Build vs. Break Habit Type Selector */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Habit mode</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(
              [
                { id: 'build', label: '✨ Build Good Habit' },
                { id: 'break', label: '🛡️ Break Bad Habit' },
              ] as const
            ).map((mode) => {
              const active = habitType === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  onPress={() => {
                    setHabitType(mode.id);
                    if (!existing) {
                      setName(
                        mode.id === 'break'
                          ? 'No doomscrolling in bed'
                          : 'Review one page of notes'
                      );
                    }
                  }}
                  style={[
                    styles.dayBox,
                    { flex: 1, paddingVertical: 12 },
                    active && styles.dayBoxActive,
                  ]}>
                  <Text
                    style={[
                      styles.dayLabel,
                      { fontSize: 13 },
                      active && styles.dayLabelActive,
                    ]}>
                    {mode.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Habit Name */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Habit name</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Review one page of notes"
              placeholderTextColor={PenguColors.textMuted}
              style={styles.textInput}
            />
            {name.length > 0 && (
              <Pressable onPress={() => setName('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E1" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Choose an Icon */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Choose an icon</Text>
          <View style={styles.iconRow}>
            {ALL_ICONS.map((ic) => {
              const selected = icon === ic;
              return (
                <Pressable
                  key={ic}
                  onPress={() => setIcon(ic)}
                  style={[
                    styles.iconOption,
                    selected && styles.iconOptionSelected,
                  ]}>
                  <HabitIconBadge icon={ic} size={46} />
                  {selected && (
                    <View style={styles.iconCheck}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Minimum Action */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Minimum action</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={minimumAction}
              onChangeText={setMinimumAction}
              placeholder="e.g. One page"
              placeholderTextColor={PenguColors.textMuted}
              style={styles.textInput}
            />
            {minimumAction.length > 0 && (
              <Pressable onPress={() => setMinimumAction('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E1" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Repeat Days */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Repeat</Text>
          <View style={styles.daysRow}>
            {ALL_DAYS.map((day) => {
              const active = repeatDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[styles.dayBox, active && styles.dayBoxActive]}>
                  <View
                    style={[
                      styles.dayIndicator,
                      active && styles.dayIndicatorActive,
                    ]}>
                    {active && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                  <Text
                    style={[styles.dayLabel, active && styles.dayLabelActive]}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Habit Cue */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Habit cue</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={cue}
              onChangeText={setCue}
              placeholder="e.g. After school or work"
              placeholderTextColor={PenguColors.textMuted}
              style={styles.textInput}
            />
            {cue.length > 0 && (
              <Pressable onPress={() => setCue('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E1" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Reminder</Text>
          <View style={styles.reminderBar}>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{
                false: '#CBD5E1',
                true: PenguColors.primaryGreen,
              }}
              thumbColor="#FFFFFF"
            />
            <Pressable onPress={cycleTime} style={styles.timeDropdown}>
              <Text style={styles.timeDropdownText}>{reminderTime}</Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={PenguColors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Notes (optional) */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Notes (optional)</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a note..."
              placeholderTextColor={PenguColors.textMuted}
              style={styles.textInput}
            />
          </View>
        </View>

        <PrimaryButton
          label="Save habit"
          onPress={handleSave}
          style={{ marginTop: 8 }}
        />
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
    gap: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heroLeft: {
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  heroMascot: {
    width: 118,
    height: 118,
  },
  focusQuickBanner: {
    backgroundColor: '#EAF6FF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#D5ECF9',
  },
  focusQuickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D5ECF9',
  },
  focusQuickTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  focusQuickSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    gap: 10,
  },
  fieldLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: '600',
    color: PenguColors.navyHeading,
    padding: 0,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  iconOption: {
    padding: 3,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: PenguColors.primaryGreen,
    backgroundColor: PenguColors.surfaceMint,
  },
  iconCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  dayBoxActive: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  dayIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayIndicatorActive: {
    borderColor: 'transparent',
  },
  dayLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  dayLabelActive: {
    color: '#FFFFFF',
  },
  reminderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 16,
    padding: 8,
    gap: 12,
  },
  timeDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  timeDropdownText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
});
