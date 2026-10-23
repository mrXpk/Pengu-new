import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function PerfectDayCelebrationScreen() {
  const router = useRouter();
  const habits = usePenguStore((s) => s.habits);
  const activeCount = habits.filter((h) => !h.archived).length || 4;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>You showed up{'\n'}today!</Text>
        <Text style={styles.subtitle}>
          All {activeCount} scheduled habits completed.
        </Text>

        {/* Hero Mascot Stage */}
        <View style={styles.heroStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.checklist}
            style={styles.heroMascot}
            contentFit="contain"
          />
        </View>

        {/* 100% Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statSide}>
            <View style={styles.greenRing}>
              <Ionicons
                name="checkmark"
                size={30}
                color={PenguColors.primaryGreen}
              />
            </View>
            <Text style={styles.statBigValue}>
              {activeCount}/{activeCount}
            </Text>
            <Text style={styles.statCaption}>habits completed</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.statSide}>
            <Text style={{ fontSize: 54 }}>⭐</Text>
            <Text style={styles.statBigValue}>100%</Text>
            <Text style={styles.statCaption}>completion rate</Text>
          </View>
        </View>

        {/* Today's Earned Rewards */}
        <View style={styles.rewardsBanner}>
          <Text style={{ fontSize: 38 }}>🪙</Text>
          <View style={styles.rewardsInfo}>
            <Text style={styles.rewardsLabel}>Today’s earned rewards</Text>
            <Text style={styles.rewardsAmount}>
              {activeCount * 10} XP <Text style={{ color: '#091E42' }}>•</Text>{' '}
              {activeCount * 5} coins
            </Text>
          </View>
        </View>

        <PrimaryButton
          label="Back to today"
          trailingArrow
          onPress={() => router.replace('/(tabs)' as any)}
          style={{ marginTop: 6 }}
        />

        <SecondaryButton
          label="Write a reflection"
          icon="document-text-outline"
          onPress={() => router.replace('/checkin/mood' as any)}
        />

        {/* Rest Banner */}
        <View style={styles.restBanner}>
          <Image
            source={MASCOT_IMAGES.sleeping}
            style={styles.sleepingPenguin}
            contentFit="contain"
          />
          <Text style={styles.restText}>Rest is part of progress, too.</Text>
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
    paddingTop: 18,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 36,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 17,
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  heroStage: {
    height: 210,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  heroMascot: {
    width: 195,
    height: 195,
  },
  statsCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  statSide: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  greenRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  verticalDivider: {
    width: 1,
    height: 90,
    backgroundColor: PenguColors.mintBorder,
  },
  statBigValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  statCaption: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  rewardsBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  rewardsInfo: {
    gap: 2,
  },
  rewardsLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  rewardsAmount: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.primaryGreen,
  },
  restBanner: {
    backgroundColor: PenguColors.surfaceIce,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.iceBorder,
    marginTop: 4,
  },
  sleepingPenguin: {
    width: 58,
    height: 44,
  },
  restText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
});
