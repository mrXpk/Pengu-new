import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors, PenguinObsidianTheme } from '@/constants/theme';
import { SHOP_CATALOG, usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export type MascotPoseKey = keyof typeof MASCOT_IMAGES;
export type MascotAnimMode = 'breathing' | 'walking' | 'celebrating' | 'focus';

interface AnimatedPinguProps {
  pose?: MascotPoseKey;
  mode?: MascotAnimMode;
  size?: number;
  showEquippedBadges?: boolean;
  speechBubble?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AnimatedPingu({
  pose = 'waving',
  mode = 'breathing',
  size = 150,
  showEquippedBadges = false,
  speechBubble,
  onPress,
  style,
}: AnimatedPinguProps) {
  const reduceMotion = usePenguStore((s) => s.reduceMotion);
  const equippedOutfitId = usePenguStore((s) => s.equippedOutfitId);
  const equippedAccessoryId = usePenguStore((s) => s.equippedAccessoryId);

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const tapBounce = useSharedValue(1);

  const [heartPop, setHeartPop] = useState(false);

  const outfitItem = SHOP_CATALOG.find((i) => i.id === equippedOutfitId);
  const accessoryItem = SHOP_CATALOG.find((i) => i.id === equippedAccessoryId);

  useEffect(() => {
    if (reduceMotion) {
      translateY.value = 0;
      translateX.value = 0;
      scaleX.value = 1;
      scaleY.value = 1;
      rotateZ.value = 0;
      return;
    }

    if (mode === 'walking') {
      // Waddle horizontally across the ice floe
      translateX.value = withRepeat(
        withSequence(
          withTiming(38, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
          withTiming(-38, { duration: 2400, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      // Bouncy footsteps
      translateY.value = withRepeat(
        withSequence(
          withTiming(-9, { duration: 260, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
      // Waddle side-to-side tilt
      rotateZ.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 260 }),
          withTiming(-6, { duration: 260 })
        ),
        -1,
        true
      );
      // Subtle squash & stretch
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 260 }),
          withTiming(0.96, { duration: 260 })
        ),
        -1,
        true
      );
    } else if (mode === 'celebrating') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-18, { duration: 340, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 300, easing: Easing.bounce })
        ),
        -1,
        false
      );
      rotateZ.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 320 }),
          withTiming(8, { duration: 320 })
        ),
        -1,
        true
      );
      scaleX.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 320 }),
          withTiming(0.96, { duration: 320 })
        ),
        -1,
        true
      );
    } else if (mode === 'focus') {
      // Deep calm ADHD body-doubling breathing
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.97, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(2, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      rotateZ.value = withRepeat(
        withSequence(
          withTiming(2.5, { duration: 2600 }),
          withTiming(-2.5, { duration: 2600 })
        ),
        -1,
        true
      );
    } else {
      // Default breathing + gentle idle bob
      translateY.value = withRepeat(
        withSequence(
          withTiming(-7, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.035, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.975, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      rotateZ.value = withRepeat(
        withSequence(
          withTiming(3, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(-3, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [mode, reduceMotion, rotateZ, scaleX, scaleY, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value * tapBounce.value },
      { scaleY: scaleY.value * tapBounce.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const handleTap = () => {
    playSound('tap', 1.25);
    tapBounce.value = withSequence(
      withSpring(1.18, { damping: 6, stiffness: 260 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 900);
    onPress?.();
  };

  return (
    <Pressable onPress={handleTap} style={[styles.wrap, style]}>
      {speechBubble ? (
        <View style={styles.speechPill}>
          <Text style={styles.speechText} numberOfLines={2}>
            {speechBubble}
          </Text>
        </View>
      ) : null}

      {heartPop && (
        <View style={styles.heartFloat}>
          <Text style={{ fontSize: 22 }}>💛 +1 Joy!</Text>
        </View>
      )}

      <Animated.View
        style={[
          { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
          animatedStyle,
        ]}>
        <Image
          source={MASCOT_IMAGES[pose]}
          style={{ width: size, height: size }}
          contentFit="contain"
        />

        {showEquippedBadges && outfitItem && (
          <View style={styles.outfitBadge}>
            <Text style={{ fontSize: 18 }}>{outfitItem.emoji}</Text>
          </View>
        )}
        {showEquippedBadges && accessoryItem && (
          <View style={styles.accessoryBadge}>
            <Text style={{ fontSize: 18 }}>{accessoryItem.emoji}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

interface LivingEcosystemPanelProps {
  completedCount: number;
  totalCount: number;
  onPressFocus: () => void;
  onPressCelebrate: () => void;
}

export function LivingEcosystemPanel({
  completedCount,
  totalCount,
  onPressFocus,
  onPressCelebrate,
}: LivingEcosystemPanelProps) {
  const themeMode = usePenguStore((s) => s.themeMode);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);
  const pinguEnergy = usePenguStore((s) => s.pinguEnergy);
  const streakShields = usePenguStore((s) => s.streakShields);
  const habits = usePenguStore((s) => s.habits);

  const isObsidian =
    themeMode === 'dark' || equippedSceneryId === 'penguin-obsidian';

  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 8);
  const dailyScore =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remaining = Math.max(0, totalCount - completedCount);

  const getTemptationPrompt = () => {
    if (remaining === 0 && totalCount > 0) {
      return '🎉 Campfire lit! 100% score today — tap to blast confetti!';
    }
    if (remaining === 1) {
      return '🔥 1 habit left to light Pingu’s cozy arctic campfire!';
    }
    return `🐧 Waddling on the ice... Complete ${remaining} steps to power up Pingu!`;
  };

  return (
    <View
      style={[
        styles.ecoContainer,
        isObsidian && styles.ecoContainerObsidian,
      ]}>
      {/* Background Arctic Illustration */}
      <Image
        source={MASCOT_IMAGES.arctic}
        style={[styles.ecoBg, isObsidian && { opacity: 0.22 }]}
        contentFit="cover"
      />

      {/* Ambient Aurora / Feather Glow in Obsidian Mode */}
      {isObsidian && <View style={styles.auroraGlow} />}

      {/* Top HUD Bar inside Ecosystem */}
      <View style={styles.hudRow}>
        <View style={[styles.hudPill, isObsidian && styles.hudPillDark]}>
          <Text style={styles.hudEmoji}>🎯</Text>
          <View>
            <Text style={[styles.hudLabel, isObsidian && styles.hudLabelDark]}>
              DAILY SCORE
            </Text>
            <Text style={[styles.hudValue, isObsidian && styles.hudValueDark]}>
              {dailyScore} pts
            </Text>
          </View>
        </View>

        <View style={[styles.hudPill, isObsidian && styles.hudPillDark]}>
          <Text style={styles.hudEmoji}>⚡</Text>
          <View>
            <Text style={[styles.hudLabel, isObsidian && styles.hudLabelDark]}>
              ENERGY
            </Text>
            <Text style={[styles.hudValue, isObsidian && styles.hudValueDark]}>
              {pinguEnergy}%
            </Text>
          </View>
        </View>

        <View style={[styles.hudPill, isObsidian && styles.hudPillDark]}>
          <Text style={styles.hudEmoji}>🔥</Text>
          <Text style={[styles.hudValue, isObsidian && styles.hudValueDark]}>
            {maxStreak}d
          </Text>
        </View>

        <View style={[styles.hudPill, isObsidian && styles.hudPillDark]}>
          <Text style={styles.hudEmoji}>🧊</Text>
          <Text style={[styles.hudValue, isObsidian && styles.hudValueDark]}>
            {streakShields}
          </Text>
        </View>
      </View>

      {/* Interactive Ecosystem Stage with Walking Pingu & Props */}
      <View style={styles.stageArea}>
        {/* Left Prop: Cozy Igloo / Study Lantern */}
        <Pressable onPress={onPressFocus} style={styles.propLeft}>
          <Text style={{ fontSize: 32 }}>🏮</Text>
          <View style={styles.propTag}>
            <Text style={styles.propTagText}>Focus Timer</Text>
          </View>
        </Pressable>

        {/* Center Waddling / Celebrating Pingu */}
        <AnimatedPingu
          pose={remaining === 0 && totalCount > 0 ? 'celebrating' : 'waving'}
          mode={remaining === 0 && totalCount > 0 ? 'celebrating' : 'walking'}
          size={132}
          showEquippedBadges
          onPress={
            remaining === 0 && totalCount > 0 ? onPressCelebrate : undefined
          }
        />

        {/* Right Prop: Campfire / Fish Bucket */}
        <Pressable
          onPress={onPressCelebrate}
          style={styles.propRight}>
          <Text style={{ fontSize: 32 }}>
            {remaining === 0 && totalCount > 0 ? '🔥' : '🪵'}
          </Text>
          <View style={styles.propTag}>
            <Text style={styles.propTagText}>
              {completedCount}/{totalCount} Done
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Bottom Temptation Banner + Energy Bar */}
      <Pressable
        onPress={
          remaining === 0 && totalCount > 0 ? onPressCelebrate : onPressFocus
        }
        style={[
          styles.temptationBar,
          isObsidian && styles.temptationBarDark,
        ]}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.temptationText,
              isObsidian && { color: PenguinObsidianTheme.textPrimary },
            ]}>
            {getTemptationPrompt()}
          </Text>
          <View style={styles.energyTrack}>
            <View
              style={[styles.energyFill, { width: `${dailyScore}%` }]}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 6,
    maxWidth: 240,
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  speechText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  heartFloat: {
    position: 'absolute',
    top: -18,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE68A',
    zIndex: 20,
  },
  outfitBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessoryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoContainer: {
    backgroundColor: '#E0F4FF',
    borderRadius: 28,
    padding: 14,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
    marginBottom: 16,
  },
  ecoContainerObsidian: {
    backgroundColor: PenguinObsidianTheme.card,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  ecoBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.52,
  },
  auroraGlow: {
    position: 'absolute',
    top: -30,
    left: '15%',
    width: '70%',
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    zIndex: 5,
  },
  hudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(186, 230, 253, 0.8)',
  },
  hudPillDark: {
    backgroundColor: 'rgba(9, 17, 30, 0.82)',
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  hudEmoji: {
    fontSize: 16,
  },
  hudLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 9,
    fontWeight: '800',
    color: PenguColors.textSecondary,
    letterSpacing: 0.4,
  },
  hudLabelDark: {
    color: PenguinObsidianTheme.textSecondary,
  },
  hudValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  hudValueDark: {
    color: PenguinObsidianTheme.textPrimary,
  },
  stageArea: {
    height: 148,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  propLeft: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 6,
  },
  propRight: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 6,
  },
  propTag: {
    backgroundColor: 'rgba(9, 30, 66, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  propTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  temptationBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  temptationBarDark: {
    backgroundColor: 'rgba(9, 17, 30, 0.88)',
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
  },
  temptationText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    marginBottom: 6,
  },
  energyTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#10B981',
  },
});
