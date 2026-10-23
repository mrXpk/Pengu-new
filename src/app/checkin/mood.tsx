import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import {
  getTodayKey,
  MoodType,
  usePenguStore,
} from '@/store/usePenguStore';

const MOODS: { type: MoodType; emoji: string; color: string }[] = [
  { type: 'Great', emoji: '🤩', color: '#FEF08A' },
  { type: 'Good', emoji: '😊', color: '#BBF7D0' },
  { type: 'Okay', emoji: '😐', color: '#FDE68A' },
  { type: 'Tired', emoji: '😴', color: '#BAE6FD' },
  { type: 'Sad', emoji: '😢', color: '#DDD6FE' },
];

export default function MoodCheckInScreen() {
  const router = useRouter();
  const today = getTodayKey();
  const moodCheckIns = usePenguStore((s) => s.moodCheckIns);
  const saveMoodCheckIn = usePenguStore((s) => s.saveMoodCheckIn);

  const existing = moodCheckIns[today];
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    existing?.mood ?? 'Good'
  );
  const [reflection, setReflection] = useState(existing?.reflection ?? '');

  const handleSave = () => {
    saveMoodCheckIn(selectedMood, reflection.trim());
    router.back();
  };

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

        <Text style={styles.title}>Daily check-in</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>

        {/* Hero Mascot Stage */}
        <View style={styles.heroStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* 5 Mood Cards */}
        <View style={styles.moodsRow}>
          {MOODS.map((m) => {
            const active = selectedMood === m.type;
            return (
              <Pressable
                key={m.type}
                onPress={() => setSelectedMood(m.type)}
                style={[styles.moodCard, active && styles.moodCardActive]}>
                {active && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View
                  style={[styles.emojiBubble, { backgroundColor: m.color }]}>
                  <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
                </View>
                <Text style={styles.moodLabel}>{m.type}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Reflection Input */}
        <Text style={styles.sectionLabel}>One thing on my mind</Text>
        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="Write a little, if you like..."
          placeholderTextColor={PenguColors.textMuted}
          multiline
          style={styles.textArea}
        />

        <View style={styles.privacyRow}>
          <Text style={styles.privacyText}>Optional reflection</Text>
          <View style={styles.lockRow}>
            <Ionicons
              name="lock-closed"
              size={14}
              color={PenguColors.textSecondary}
            />
            <Text style={styles.privacyText}>Visible only to you</Text>
          </View>
        </View>

        <PrimaryButton
          label="Save check-in"
          trailingArrow
          onPress={handleSave}
          style={{ marginTop: 12 }}
        />

        <SecondaryButton
          label="Skip today"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '700',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  heroStage: {
    height: 175,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  mascotImg: {
    width: 155,
    height: 155,
  },
  moodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  moodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    gap: 10,
  },
  moodCardActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  sectionLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 16,
    minHeight: 118,
    textAlignVertical: 'top',
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.navyHeading,
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  privacyText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
});
