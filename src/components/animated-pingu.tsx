import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { SHOP_CATALOG, usePenguStore } from '@/store/usePenguStore';
import { bell, flow, loop, seeded, useLoopClock, wave } from '@/utils/motion';
import { playSound } from '@/utils/sound';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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

  // Single 4800ms master clock per character (rossark-motion-skill principle #2)
  const clock = useLoopClock(4800, !reduceMotion);
  const tapBounce = useSharedValue(1);

  const [heartPop, setHeartPop] = useState(false);

  const outfitItem = SHOP_CATALOG.find((i) => i.id === equippedOutfitId);
  const accessoryItem = SHOP_CATALOG.find((i) => i.id === equippedAccessoryId);

  // Main body motion driven by rossark-motion-skill wave() & flow()
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    const t = clock.value;
    if (reduceMotion) {
      return { transform: [{ scale: tapBounce.value }] };
    }

    if (mode === 'walking') {
      const tx = flow(t, [
        [0, 0],
        [1200, 14],
        [2400, 0],
        [3600, -14],
        [4800, 0],
      ]);
      const ty = -Math.abs(wave(t, 800, 0)) * 5;
      const rot = wave(t, 800, 0.12) * 3.5;
      const sy = 1 + wave(t, 800, 0) * 0.022;
      return {
        transform: [
          { translateX: tx },
          { translateY: ty },
          { scaleX: tapBounce.value },
          { scaleY: sy * tapBounce.value },
          { rotateZ: `${rot}deg` },
        ],
      };
    }

    if (mode === 'celebrating') {
      const ty = -Math.abs(wave(t, 600, 0)) * 11;
      const rot = wave(t, 1200, 0.1) * 5;
      const sx = 1 + wave(t, 600, 0) * 0.035;
      return {
        transform: [
          { translateY: ty },
          { scaleX: sx * tapBounce.value },
          { scaleY: tapBounce.value },
          { rotateZ: `${rot}deg` },
        ],
      };
    }

    if (mode === 'focus') {
      // Calm 4.8s deep focus breath
      const breath = wave(t, 4800, 0);
      return {
        transform: [
          { translateY: breath * -3.5 },
          { scaleX: (1 + breath * 0.015) * tapBounce.value },
          { scaleY: (1 + breath * 0.025) * tapBounce.value },
          { rotateZ: `${wave(t, 4800, 0.25) * 1.8}deg` },
        ],
      };
    }

    // Default calm idle breathing (rossark-motion-skill: small amplitude, 3.2-4.8s cycle)
    const breath = wave(t, 2400, 0);
    const tilt = wave(t, 4800, 0.2) * 2.4;
    return {
      transform: [
        { translateY: breath * -4.5 },
        { scaleX: (1 - breath * 0.012) * tapBounce.value },
        { scaleY: (1 + breath * 0.024) * tapBounce.value },
        { rotateZ: `${tilt}deg` },
      ],
    };
  });

  // Secondary follow-through with phase delay on outfit badge (rossark-motion-skill principle #5)
  const outfitFollowStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const delayedY = wave(t, 2400, 0.18) * -3.5;
    const delayedRot = wave(t, 2400, 0.28) * 6;
    return {
      transform: [{ translateY: delayedY }, { rotateZ: `${delayedRot}deg` }],
    };
  });

  const accessoryFollowStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const delayedY = wave(t, 2400, 0.32) * -3.5;
    return {
      transform: [{ translateY: delayedY }],
    };
  });

  const handleTap = () => {
    playSound('tap', 1.25);
    tapBounce.value = withSequence(
      withSpring(1.12, { damping: 8, stiffness: 260 }),
      withSpring(1, { damping: 12, stiffness: 220 })
    );
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 850);
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
          <Text style={styles.heartFloatText}>💛 +1 Joy</Text>
        </View>
      )}

      <Animated.View
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          bodyAnimatedStyle,
        ]}>
        <Image
          source={MASCOT_IMAGES[pose]}
          style={{ width: size, height: size }}
          contentFit="contain"
        />

        {showEquippedBadges && outfitItem && (
          <Animated.View style={[styles.outfitBadge, outfitFollowStyle]}>
            <Text style={{ fontSize: 16 }}>{outfitItem.emoji}</Text>
          </Animated.View>
        )}
        {showEquippedBadges && accessoryItem && (
          <Animated.View style={[styles.accessoryBadge, accessoryFollowStyle]}>
            <Text style={{ fontSize: 16 }}>{accessoryItem.emoji}</Text>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Seeded ambient snow/sparkle mote using rossark-motion-skill's loop(), bell(), and seeded()
 */
function AmbientMote({
  index,
  clock,
}: {
  index: number;
  clock: SharedValue<number>;
}) {
  const phase = seeded(index, 1);
  const leftPct = 12 + Math.round(seeded(index, 2) * 76);
  const topBase = 16 + Math.round(seeded(index, 3) * 110);
  const dotSize = 5 + Math.round(seeded(index, 4) * 5);

  const moteStyle = useAnimatedStyle(() => {
    const p = loop(clock.value, 4800, phase);
    const opacity = bell(p) * 0.65;
    const translateY = -p * 22;
    const translateX = wave(clock.value, 4800, phase) * 6;
    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: `${leftPct}%`,
          top: topBase,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: '#FFFFFF',
        },
        moteStyle,
      ]}
    />
  );
}

interface LivingEcosystemPanelProps {
  completedCount: number;
  totalCount: number;
  onPressFocus: () => void;
  onPressCelebrate: () => void;
  onPressPinguHome?: () => void;
}

export function LivingEcosystemPanel({
  completedCount,
  totalCount,
  onPressFocus,
  onPressCelebrate,
  onPressPinguHome,
}: LivingEcosystemPanelProps) {
  const reduceMotion = usePenguStore((s) => s.reduceMotion);
  const habits = usePenguStore((s) => s.habits);

  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 8);
  const dailyScore =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && completedCount >= totalCount;

  // Smoothly animated SVG Score Ring using EASE_OUT cubic bezier
  const ringSize = 68;
  const strokeWidth = 7;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressSv = useSharedValue(dailyScore / 100);
  const ambientClock = useLoopClock(4800, !reduceMotion);

  useEffect(() => {
    progressSv.value = withTiming(dailyScore / 100, {
      duration: 650,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    });
  }, [dailyScore, progressSv]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progressSv.value),
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${Math.round(progressSv.value * 100)}%`,
  }));

  return (
    <View style={styles.heroCard}>
      {/* Soft Arctic Background Illustration */}
      <Image
        source={MASCOT_IMAGES.arctic}
        style={styles.heroBg}
        contentFit="cover"
      />

      {/* Out-of-phase ambient snow/sparkle particles (rossark-motion-skill principle #6) */}
      {[0, 1, 2, 3].map((i) => (
        <AmbientMote key={i} index={i} clock={ambientClock} />
      ))}

      <View style={styles.heroContentRow}>
        {/* Left Column: Minimalist Today Header, Fluid Score Ring & Quick Actions */}
        <View style={styles.heroLeftCol}>
          <View style={styles.todayTopRow}>
            <Text style={styles.todayTitle}>Today</Text>
            <View style={styles.streakTag}>
              <Text style={styles.streakTagText}>🔥 {maxStreak}d</Text>
            </View>
          </View>

          <Text style={styles.todaySub}>
            {completedCount} of {totalCount} habits completed
          </Text>

          {/* Fluid SVG Score Ring + Score Metrics */}
          <View style={styles.scoreRingRow}>
            <View style={styles.ringBox}>
              <Svg width={ringSize} height={ringSize}>
                <Circle
                  stroke="rgba(9, 30, 66, 0.08)"
                  fill="rgba(255, 255, 255, 0.75)"
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                <AnimatedCircle
                  stroke={PenguColors.primaryGreen}
                  fill="none"
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  animatedProps={animatedCircleProps}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                />
              </Svg>
              <View style={styles.ringCenterTextWrap}>
                <Text style={styles.ringScoreText}>{dailyScore}%</Text>
              </View>
            </View>

            <View style={styles.scoreMetaCol}>
              <Text style={styles.scoreMetaLabel}>DAILY SCORE</Text>
              <Text style={styles.scoreMetaStatus}>
                {isAllDone
                  ? 'All goals complete!'
                  : dailyScore >= 50
                  ? 'Steady momentum'
                  : 'Small steps count'}
              </Text>
              <View style={styles.miniProgressTrack}>
                <Animated.View
                  style={[styles.miniProgressFill, progressBarStyle]}
                />
              </View>
            </View>
          </View>

          {/* Minimalist Action Pills: Focus Session & Pingu's Home */}
          <View style={styles.actionPillsRow}>
            <Pressable
              onPress={() => {
                playSound('tap');
                onPressFocus();
              }}
              style={({ pressed }) => [
                styles.focusActionPill,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons
                name="timer-outline"
                size={15}
                color="#FFFFFF"
              />
              <Text style={styles.focusActionPillText}>Focus Session</Text>
            </Pressable>

            {onPressPinguHome && (
              <Pressable
                onPress={() => {
                  playSound('tap');
                  onPressPinguHome();
                }}
                style={({ pressed }) => [
                  styles.secondaryActionPill,
                  pressed && { opacity: 0.8 },
                ]}>
                <Text style={styles.secondaryActionPillText}>🐧 Pingu</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Right Column: Breathing / Acting Pingu Companion */}
        <View style={styles.heroMascotCol}>
          <AnimatedPingu
            pose={isAllDone ? 'celebrating' : 'waving'}
            mode={isAllDone ? 'celebrating' : 'walking'}
            size={126}
            showEquippedBadges
            onPress={isAllDone ? onPressCelebrate : onPressPinguHome}
          />
        </View>
      </View>
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
    borderWidth: 1,
    borderColor: '#D5ECF9',
    marginBottom: 6,
    maxWidth: 240,
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  speechText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  heartFloat: {
    position: 'absolute',
    top: -16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
  },
  heartFloatText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  outfitBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessoryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: '#EAF6FF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D5ECF9',
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.42,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  heroLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  todayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    letterSpacing: -0.4,
  },
  streakTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  streakTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  todaySub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
    marginBottom: 12,
  },
  scoreRingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 12,
  },
  ringBox: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterTextWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScoreText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  scoreMetaCol: {
    flex: 1,
    gap: 3,
  },
  scoreMetaLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  scoreMetaStatus: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  miniProgressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(9, 30, 66, 0.08)',
    overflow: 'hidden',
    marginTop: 3,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: PenguColors.primaryGreen,
  },
  actionPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  focusActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PenguColors.primaryGreen,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  focusActionPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryActionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D5ECF9',
  },
  secondaryActionPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  heroMascotCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
