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
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import {
  bell,
  flow,
  loop,
  seeded,
  track,
  useLoopClock,
  wave,
} from '@/utils/motion';
import { playSound } from '@/utils/sound';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type MascotPoseKey = keyof typeof MASCOT_IMAGES;
export type MascotAnimMode = 'breathing' | 'walking' | 'celebrating' | 'focus';

interface AnimatedPinguProps {
  pose?: MascotPoseKey;
  mode?: MascotAnimMode;
  size?: number;
  showEquippedBadges?: boolean;
  previewItemId?: string;
  speechBubble?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Multi-layered, rigged SVG Penguin built with rossark-motion-skill principles:
 * - Articulated Left & Right Wings rotating around shoulder pivots (raise both wings high when cheering!)
 * - Blinking eyes & gliding pupils
 * - Actual wearable SVG Hats, Crowns, Scarves, Tuxedo Bowtie, Snow Goggles, Backpacks & Study Lantern
 *   drawn directly onto Pingu's head, eyes, neck, and shoulders!
 */
export function AnimatedPingu({
  pose = 'waving',
  mode = 'breathing',
  size = 150,
  previewItemId,
  speechBubble,
  onPress,
  style,
}: AnimatedPinguProps) {
  const reduceMotion = usePenguStore((s) => s.reduceMotion);
  const equippedOutfitId = usePenguStore((s) => s.equippedOutfitId);
  const equippedAccessoryId = usePenguStore((s) => s.equippedAccessoryId);

  const [cheeringBurst, setCheeringBurst] = useState(false);

  const activeMode: MascotAnimMode = cheeringBurst
    ? 'celebrating'
    : pose === 'celebrating'
    ? 'celebrating'
    : mode;

  // Determine which wearable cosmetics are active on Pingu's body
  const activeOutfit = previewItemId ?? equippedOutfitId;
  const activeAccessory = previewItemId ?? equippedAccessoryId;

  const wearsScarf = activeOutfit === 'cozy-scarf';
  const wearsWinterHat = activeOutfit === 'winter-hat';
  const wearsCrown = activeOutfit === 'star-crown';
  const wearsBowtie = activeOutfit === 'royal-tuxedo';
  const wearsBackpack =
    activeOutfit === 'explorer-backpack' ||
    activeAccessory === 'blue-backpack';
  const backpackColor =
    activeAccessory === 'blue-backpack' ? '#2563EB' : '#F97316';
  const wearsGoggles = activeAccessory === 'cool-glasses';
  const holdsLantern = activeAccessory === 'study-lantern';

  // Single 4800ms master clock per character (rossark-motion-skill principle #2)
  const clock = useLoopClock(4800, !reduceMotion);
  const tapBounce = useSharedValue(1);

  // Whole-body jump, waddle & squash/stretch
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    const t = clock.value;
    if (reduceMotion) {
      return { transform: [{ scale: tapBounce.value }] };
    }

    if (activeMode === 'celebrating') {
      // Joyful jump loop: leaps up with squash & stretch
      const jumpWave = Math.abs(wave(t, 960, 0));
      const ty = -jumpWave * 18;
      const sx = 1 - jumpWave * 0.04 + (1 - jumpWave) * 0.03;
      const sy = 1 + jumpWave * 0.06 - (1 - jumpWave) * 0.03;
      const rot = wave(t, 960, 0.25) * 4;
      return {
        transform: [
          { translateY: ty },
          { scaleX: sx * tapBounce.value },
          { scaleY: sy * tapBounce.value },
          { rotateZ: `${rot}deg` },
        ],
      };
    }

    if (activeMode === 'walking') {
      const tx = flow(t, [
        [0, 0],
        [1200, 10],
        [2400, 0],
        [3600, -10],
        [4800, 0],
      ]);
      const ty = -Math.abs(wave(t, 800, 0)) * 5;
      const rot = wave(t, 800, 0.12) * 3.8;
      const sy = 1 + wave(t, 800, 0) * 0.02;
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

    if (activeMode === 'focus') {
      const breath = wave(t, 4800, 0);
      return {
        transform: [
          { translateY: breath * -3 },
          { scaleX: (1 + breath * 0.014) * tapBounce.value },
          { scaleY: (1 + breath * 0.022) * tapBounce.value },
          { rotateZ: `${wave(t, 4800, 0.25) * 1.5}deg` },
        ],
      };
    }

    // Calm breathing idle
    const breath = wave(t, 2400, 0);
    const tilt = wave(t, 4800, 0.2) * 2.2;
    return {
      transform: [
        { translateY: breath * -4 },
        { scaleX: (1 - breath * 0.012) * tapBounce.value },
        { scaleY: (1 + breath * 0.024) * tapBounce.value },
        { rotateZ: `${tilt}deg` },
      ],
    };
  });

  // Left Wing / Flipper articulated rotation around shoulder
  const leftWingStyle = useAnimatedStyle(() => {
    const t = clock.value;
    if (activeMode === 'celebrating') {
      // Raise left wing high up and wave ("Hurray!")
      const deg = 115 + wave(t, 480, 0) * 22;
      return {
        transform: [{ translateY: -8 }, { rotateZ: `${deg}deg` }],
      };
    }
    if (activeMode === 'walking') {
      const deg = 18 + wave(t, 800, 0.1) * 18;
      return { transform: [{ rotateZ: `${deg}deg` }] };
    }
    const deg = 8 + wave(t, 2400, 0.15) * 8;
    return { transform: [{ rotateZ: `${deg}deg` }] };
  });

  // Right Wing / Flipper articulated rotation around right shoulder
  const rightWingStyle = useAnimatedStyle(() => {
    const t = clock.value;
    if (activeMode === 'celebrating') {
      // Raise right wing high up in celebration!
      const deg = -115 - wave(t, 480, 0.08) * 22;
      return {
        transform: [{ translateY: -8 }, { rotateZ: `${deg}deg` }],
      };
    }
    if (pose === 'waving') {
      const deg = -95 + wave(t, 960, 0) * 18;
      return {
        transform: [{ translateY: -6 }, { rotateZ: `${deg}deg` }],
      };
    }
    const deg = -8 - wave(t, 2400, 0.15) * 8;
    return { transform: [{ rotateZ: `${deg}deg` }] };
  });

  // Blinking eyes (track every 4.8s)
  const eyeBlinkStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const scaleY = track(t, [
      [0, 1],
      [3400, 1],
      [3520, 0.08],
      [3660, 1],
      [4800, 1],
    ]);
    const pupilX = flow(t, [
      [0, 0],
      [1500, 2],
      [3200, -2],
      [4800, 0],
    ]);
    return {
      transform: [{ translateX: pupilX }, { scaleY }],
    };
  });

  // Secondary follow-through on headwear & scarf fringe (rossark-motion-skill principle #5)
  const headwearFollowStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const ty = wave(t, 1200, 0.22) * -2.5;
    const rot = wave(t, 2400, 0.3) * 3;
    return {
      transform: [{ translateY: ty }, { rotateZ: `${rot}deg` }],
    };
  });

  const handleTap = () => {
    playSound('celebration');
    tapBounce.value = withSequence(
      withSpring(1.1, { damping: 7, stiffness: 260 }),
      withSpring(1, { damping: 12, stiffness: 220 })
    );
    setCheeringBurst(true);
    setTimeout(() => setCheeringBurst(false), 1800);
    onPress?.();
  };

  return (
    <Pressable onPress={handleTap} style={[styles.wrap, style]}>
      {speechBubble || cheeringBurst || activeMode === 'celebrating' ? (
        <View
          style={[
            styles.speechPill,
            (cheeringBurst || activeMode === 'celebrating') &&
              styles.speechPillHurray,
          ]}>
          <Text style={styles.speechText} numberOfLines={2}>
            {cheeringBurst
              ? '🎉 Hurray!! You’re unstoppable!'
              : speechBubble || '🎉 Hurray! All goals done!'}
          </Text>
        </View>
      ) : null}

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
        {/* MASTER RIGGED SVG PENGUIN CANVAS */}
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="plumageGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1E3A5F" />
              <Stop offset="100%" stopColor="#0F1E36" />
            </LinearGradient>
            <LinearGradient id="bellyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#E6F2FA" />
            </LinearGradient>
            <LinearGradient id="beakGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>

          {/* 1. Ground Shadow */}
          <Ellipse
            cx="100"
            cy="184"
            rx={activeMode === 'celebrating' ? '38' : '48'}
            ry="9"
            fill="rgba(9, 30, 66, 0.12)"
          />

          {/* 2. Backpack Behind Shoulders (When Equipped) */}
          {wearsBackpack && (
            <G>
              <Rect
                x="44"
                y="84"
                width="112"
                height="68"
                rx="22"
                fill={backpackColor}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <Rect
                x="48"
                y="96"
                width="10"
                height="28"
                rx="5"
                fill="rgba(0,0,0,0.18)"
              />
              <Rect
                x="142"
                y="96"
                width="10"
                height="28"
                rx="5"
                fill="rgba(0,0,0,0.18)"
              />
            </G>
          )}

          {/* 3. Webbed Orange Feet */}
          <G>
            <Ellipse
              cx="76"
              cy={activeMode === 'celebrating' ? '170' : '176'}
              rx="18"
              ry="9"
              fill="#F59E0B"
              transform={
                activeMode === 'celebrating' ? 'rotate(-16 76 170)' : undefined
              }
            />
            <Ellipse
              cx="124"
              cy={activeMode === 'celebrating' ? '170' : '176'}
              rx="18"
              ry="9"
              fill="#F59E0B"
              transform={
                activeMode === 'celebrating' ? 'rotate(16 124 170)' : undefined
              }
            />
          </G>

          {/* 4. Plump Penguin Body & Head Base */}
          <Path
            d="M 100 32 C 138 32, 156 64, 156 116 C 156 156, 136 174, 100 174 C 64 174, 44 156, 44 116 C 44 64, 62 32, 100 32 Z"
            fill="url(#plumageGrad)"
          />

          {/* White Heart-Shaped Face & Cream Belly */}
          <Path
            d="M 74 54 C 84 48, 96 54, 100 60 C 104 54, 116 48, 126 54 C 140 62, 142 92, 140 124 C 138 154, 124 168, 100 168 C 76 168, 62 154, 60 124 C 58 92, 60 62, 74 54 Z"
            fill="url(#bellyGrad)"
          />

          {/* Backpack Front Shoulder Straps (When Equipped) */}
          {wearsBackpack && (
            <G>
              <Path
                d="M 60 88 Q 66 118 64 146"
                stroke={backpackColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 140 88 Q 134 118 136 146"
                stroke={backpackColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </G>
          )}

          {/* Rosy Cheeks */}
          <Ellipse
            cx="68"
            cy="78"
            rx="9"
            ry="5.5"
            fill="#FDA4AF"
            opacity="0.75"
          />
          <Ellipse
            cx="132"
            cy="78"
            rx="9"
            ry="5.5"
            fill="#FDA4AF"
            opacity="0.75"
          />

          {/* Beak (Opens wide when cheering "Hurray!") */}
          {activeMode === 'celebrating' ? (
            <G>
              <Path
                d="M 88 74 Q 100 66 112 74 Q 100 92 88 74 Z"
                fill="#EA580C"
              />
              <Path
                d="M 86 73 Q 100 65 114 73 Q 100 79 86 73 Z"
                fill="url(#beakGrad)"
              />
              <Ellipse cx="100" cy="80" rx="6" ry="4" fill="#FDA4AF" />
            </G>
          ) : (
            <Path
              d="M 88 73 Q 100 66 112 73 Q 100 84 88 73 Z"
              fill="url(#beakGrad)"
            />
          )}

          {/* 5. Wearable Neck Cosmetics: Cozy Knit Scarf OR Tuxedo Bowtie */}
          {wearsScarf && (
            <G>
              {/* Main Wrap Around Neck */}
              <Path
                d="M 54 90 Q 100 104 146 90 Q 148 104 142 108 Q 100 120 58 108 Q 52 104 54 90 Z"
                fill="#EF4444"
              />
              {/* Knit Stripes */}
              <Path
                d="M 68 95 L 68 110 M 88 99 L 88 113 M 112 99 L 112 113 M 132 95 L 132 110"
                stroke="#FCA5A5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Hanging Scarf Tail + Fringe */}
              <Path
                d="M 114 104 Q 126 124 122 142 L 138 140 Q 140 120 132 102 Z"
                fill="#DC2626"
              />
              <Path
                d="M 123 142 L 122 149 M 129 141 L 129 148 M 135 140 L 136 147"
                stroke="#FCA5A5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </G>
          )}

          {wearsBowtie && (
            <G>
              {/* Crisp Tuxedo V-Collar */}
              <Path
                d="M 76 92 L 100 112 L 124 92"
                stroke="#1E293B"
                strokeWidth="4"
                fill="none"
              />
              {/* Velvet Bowtie */}
              <Path d="M 82 90 L 100 98 L 82 106 Z" fill="#E11D48" />
              <Path d="M 118 90 L 100 98 L 118 106 Z" fill="#E11D48" />
              <Circle cx="100" cy="98" r="5" fill="#BE123C" />
            </G>
          )}
        </Svg>

        {/* 6. Articulated Left Wing Overlay (Rotates Around Shoulder Pivot!) */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: size * 0.11,
              top: size * 0.44,
              width: size * 0.22,
              height: size * 0.34,
            },
            leftWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 44 68">
            <Path
              d="M 36 8 C 16 10, 4 32, 8 56 C 12 66, 26 62, 36 44 Z"
              fill="#172E4E"
            />
          </Svg>
        </Animated.View>

        {/* 7. Articulated Right Wing Overlay (Raises for Wave / Hurray + Holds Lantern!) */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              right: size * 0.11,
              top: size * 0.44,
              width: size * 0.22,
              height: size * 0.34,
            },
            rightWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 44 68">
            <Path
              d="M 8 8 C 28 10, 40 32, 36 56 C 32 66, 18 62, 8 44 Z"
              fill="#172E4E"
            />
            {holdsLantern && (
              <G>
                <Circle
                  cx="32"
                  cy="54"
                  r="10"
                  fill="#FDE047"
                  stroke="#D97706"
                  strokeWidth="2"
                />
                <Circle cx="32" cy="54" r="5" fill="#FEF9C3" />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* 8. Animated Eyes OR Cool Snow Goggles */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: size * 0.27,
              width: size * 0.46,
              height: size * 0.14,
              alignItems: 'center',
              justifyContent: 'center',
            },
            eyeBlinkStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 92 28">
            {wearsGoggles ? (
              <G>
                {/* Ski Goggles / Cool Shades Frame */}
                <Rect
                  x="4"
                  y="3"
                  width="38"
                  height="22"
                  rx="9"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <Rect
                  x="50"
                  y="3"
                  width="38"
                  height="22"
                  rx="9"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <Path
                  d="M 42 12 L 50 12"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />
                {/* Lens Glint */}
                <Path
                  d="M 12 9 L 22 9 M 58 9 L 68 9"
                  stroke="#7DD3FC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </G>
            ) : activeMode === 'celebrating' ? (
              <G>
                {/* Happy Cheering Arc Eyes (^ ^) */}
                <Path
                  d="M 14 18 Q 23 6 32 18"
                  stroke="#091E42"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M 60 18 Q 69 6 78 18"
                  stroke="#091E42"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            ) : (
              <G>
                <Circle cx="23" cy="14" r="6.5" fill="#091E42" />
                <Circle cx="21" cy="11.5" r="2.2" fill="#FFFFFF" />
                <Circle cx="69" cy="14" r="6.5" fill="#091E42" />
                <Circle cx="67" cy="11.5" r="2.2" fill="#FFFFFF" />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* 9. Wearable Headwear Drawn Directly on Pingu's Crown (Winter Hat OR Emperor Crown!) */}
        {(wearsWinterHat || wearsCrown) && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: size * 0.01,
                width: size * 0.56,
                height: size * 0.25,
              },
              headwearFollowStyle,
            ]}>
            <Svg width="100%" height="100%" viewBox="0 0 112 50">
              {wearsWinterHat ? (
                <G>
                  {/* Fluffy Pom-Pom */}
                  <Circle
                    cx="56"
                    cy="10"
                    r="9"
                    fill="#FFFFFF"
                    stroke="#BAE6FD"
                    strokeWidth="1.5"
                  />
                  {/* Blue Knit Dome */}
                  <Path
                    d="M 18 40 C 18 16, 94 16, 94 40 Z"
                    fill="#2563EB"
                  />
                  {/* Ribbed Cuff Sitting Snugly on Head */}
                  <Rect
                    x="14"
                    y="35"
                    width="84"
                    height="12"
                    rx="6"
                    fill="#60A5FA"
                  />
                </G>
              ) : (
                <G>
                  {/* Golden Emperor Crown */}
                  <Path
                    d="M 22 44 L 16 16 L 40 30 L 56 10 L 72 30 L 96 16 L 90 44 Z"
                    fill="#FBBF24"
                    stroke="#D97706"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Crown Jewels */}
                  <Circle cx="56" cy="28" r="4" fill="#EF4444" />
                  <Circle cx="36" cy="34" r="3" fill="#10B981" />
                  <Circle cx="76" cy="34" r="3" fill="#3B82F6" />
                </G>
              )}
            </Svg>
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
                  ? 'Hurray! All goals done!'
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
              <Ionicons name="timer-outline" size={15} color="#FFFFFF" />
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
                <Text style={styles.secondaryActionPillText}>
                  🐧 Dress Pingu
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Right Column: Rigged Animated Pingu Wearing Equipped Hat/Scarf/Glasses */}
        <View style={styles.heroMascotCol}>
          <AnimatedPingu
            pose={isAllDone ? 'celebrating' : 'waving'}
            mode={isAllDone ? 'celebrating' : 'walking'}
            size={134}
            showEquippedBadges
            onPress={isAllDone ? onPressCelebrate : undefined}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5ECF9',
    marginBottom: 4,
    maxWidth: 220,
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  speechPillHurray: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  speechText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
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
