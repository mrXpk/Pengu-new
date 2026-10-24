import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  HabitIconBadge,
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function WelcomeBackScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const habits = usePenguStore((s) => s.habits);

  const firstName = userName.split(' ')[0] || 'Pratap';
  const nextHabit = habits.find((h) => !h.archived) ?? {
    id: 'habit-1',
    name: 'Review one page of notes',
    icon: 'books' as const,
    minimumAction: 'About 5 minutes',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Good to see you{'\n'}again, {firstName}
        </Text>
        <Text style={styles.subtitle}>
          A missed day doesn’t erase your progress.{'\n'}Start with one small step.
        </Text>

        {/* Snowy Mascot Stage */}
        <View style={styles.mascotStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.waving}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* Next Habit Card */}
        <View style={styles.nextHabitCard}>
          <HabitIconBadge icon={nextHabit.icon} size={62} />
          <View style={styles.nextHabitInfo}>
            <Text style={styles.nextHabitLabel}>Your next habit</Text>
            <Text style={styles.nextHabitTitle}>{nextHabit.name}</Text>
            <Text style={styles.nextHabitSub}>About 5 minutes</Text>
          </View>
        </View>

        <PrimaryButton
          label="View today’s habits"
          trailingArrow
          onPress={() => router.replace('/(tabs)' as any)}
          style={{ width: '100%', marginTop: 18 }}
        />

        <SecondaryButton
          label="Adjust my routine"
          onPress={() => router.push('/habits/all' as any)}
          style={{ width: '100%', marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 33,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 18,
  },
  mascotStage: {
    width: '100%',
    height: 245,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.55,
  },
  mascotImg: {
    width: 230,
    height: 230,
  },
  nextHabitCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  nextHabitInfo: {
    flex: 1,
  },
  nextHabitLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  nextHabitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginTop: 2,
  },
  nextHabitSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    marginTop: 3,
  },
});
