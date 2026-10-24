import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { getTodayKey, usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export default function PerfectDayCelebrationScreen() {
  const router = useRouter();
  const habits = usePenguStore((s) => s.habits);
  const dailyChestOpenedByDate = usePenguStore((s) => s.dailyChestOpenedByDate);
  const openDailyMysteryChest = usePenguStore((s) => s.openDailyMysteryChest);

  const today = getTodayKey();
  const alreadyOpened = !!dailyChestOpenedByDate[today];

  const [blastKey, setBlastKey] = useState(1);
  const [chestTaps, setChestTaps] = useState(alreadyOpened ? 3 : 0);
  const [chestOpened, setChestOpened] = useState(alreadyOpened);

  const chestShake = useSharedValue(0);
  const chestScale = useSharedValue(1);

  const activeCount =
    habits.filter((h) => !h.archived && (h.habitType ?? 'build') === 'build')
      .length || 4;

  useEffect(() => {
    playSound('celebration');
  }, []);

  const handleChestTap = () => {
    if (chestOpened) {
      playSound('celebration');
      setBlastKey((k) => k + 1);
      return;
    }

    const nextTaps = chestTaps + 1;
    setChestTaps(nextTaps);

    if (nextTaps < 3) {
      playSound('iceCrack', 1 + nextTaps * 0.15);
      chestShake.value = withSequence(
        withTiming(-12, { duration: 45 }),
        withTiming(12, { duration: 45 }),
        withTiming(-8, { duration: 45 }),
        withTiming(0, { duration: 45 })
      );
      chestScale.value = withSequence(
        withSpring(1.16, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    } else {
      playSound('chestOpen');
      openDailyMysteryChest();
      setChestOpened(true);
      setBlastKey((k) => k + 1);
      chestScale.value = withSequence(
        withSpring(1.28, { damping: 5 }),
        withSpring(1, { damping: 8 })
      );
    }
  };

  const chestAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: chestShake.value },
      { scale: chestScale.value },
    ],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ConfettiBlast visible triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.perfectPill}>
          <Text style={styles.perfectPillText}>🔥 100% PERFECT DAY BLAST</Text>
        </View>

        <Text style={styles.title}>You showed up{'\n'}today!</Text>
        <Text style={styles.subtitle}>
          All {activeCount} scheduled habits completed.
        </Text>

        {/* Hero Mascot Stage with Celebrating Pingu */}
        <Pressable
          onPress={() => {
            playSound('celebration');
            setBlastKey((k) => k + 1);
          }}
          style={styles.heroStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <AnimatedPingu
            pose="celebrating"
            mode="celebrating"
            size={185}
            showEquippedBadges
            speechBubble="Tap me to blast more confetti! 🎉"
          />
        </Pressable>

        {/* Interactive 3-Tap Daily Mystery Ice Chest */}
        <Pressable onPress={handleChestTap} style={styles.chestCard}>
          <Animated.View style={[styles.chestIconWrap, chestAnimStyle]}>
            <Text style={{ fontSize: 48 }}>
              {chestOpened ? '🎁' : chestTaps === 0 ? '🧊' : chestTaps === 1 ? '❄️' : '💎'}
            </Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={styles.chestTitle}>
              {chestOpened
                ? 'Mystery Ice Chest Unlocked!'
                : `Tap ${3 - chestTaps}x to crack your Ice Chest!`}
            </Text>
            <Text style={styles.chestSub}>
              {chestOpened
                ? '+50 Coins 🪙 • +30 XP ⭐ • +1 Streak Shield 🧊 claimed!'
                : 'Earned for completing your daily goal streak.'}
            </Text>
          </View>
        </Pressable>

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
            <Text style={{ fontSize: 52 }}>🔥</Text>
            <Text style={styles.statBigValue}>100%</Text>
            <Text style={styles.statCaption}>daily score</Text>
          </View>
        </View>

        {/* Today's Earned Rewards */}
        <View style={styles.rewardsBanner}>
          <Text style={{ fontSize: 38 }}>🪙</Text>
          <View style={styles.rewardsInfo}>
            <Text style={styles.rewardsLabel}>Today’s total haul</Text>
            <Text style={styles.rewardsAmount}>
              {activeCount * 10 + (chestOpened ? 30 : 0)} XP{' '}
              <Text style={{ color: '#091E42' }}>•</Text>{' '}
              {activeCount * 5 + (chestOpened ? 50 : 0)} coins
            </Text>
          </View>
        </View>

        <PrimaryButton
          label="🎉 Blast Confetti & Continue"
          trailingArrow
          onPress={() => {
            playSound('celebration');
            router.replace('/(tabs)' as any);
          }}
          style={{ marginTop: 6 }}
        />

        <SecondaryButton
          label="Share Streak with Friends"
          icon="share-social-outline"
          onPress={() => router.replace('/referrals' as any)}
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
    paddingTop: 14,
    paddingBottom: 28,
    gap: 12,
  },
  perfectPill: {
    alignSelf: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  perfectPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 35,
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
  },
  heroStage: {
    height: 225,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  chestCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  chestIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chestTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: '#92400E',
  },
  chestSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: '#B45309',
    marginTop: 3,
  },
  statsCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 24,
    paddingVertical: 16,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  verticalDivider: {
    width: 1,
    height: 85,
    backgroundColor: PenguColors.mintBorder,
  },
  statBigValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  statCaption: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  rewardsBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
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
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  rewardsAmount: {
    fontFamily: Fonts?.rounded,
    fontSize: 21,
    fontWeight: '900',
    color: PenguColors.primaryGreen,
  },
});
