import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#10B981',
  '#F59E0B',
  '#38BDF8',
  '#F43F5E',
  '#A855F7',
  '#FACC15',
  '#22C55E',
];

const EMOJI_PARTICLES = ['✨', '⭐', '🎉', '🔥', '🪙', '💎'];

interface ParticleConfig {
  id: number;
  fromLeft: boolean;
  targetX: number;
  peakY: number;
  endY: number;
  color: string;
  emoji?: string;
  size: number;
  delay: number;
  rotation: number;
}

const PARTICLES: ParticleConfig[] = Array.from({ length: 48 }, (_, i) => {
  const fromLeft = i % 2 === 0;
  const spreadX = (Math.random() * 0.85 + 0.1) * SCREEN_W;
  return {
    id: i,
    fromLeft,
    targetX: fromLeft ? spreadX : SCREEN_W - spreadX,
    peakY: -(SCREEN_H * (0.42 + Math.random() * 0.42)),
    endY: 80 + Math.random() * 140,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    emoji: i % 5 === 0 ? EMOJI_PARTICLES[i % EMOJI_PARTICLES.length] : undefined,
    size: 10 + (i % 4) * 3,
    delay: (i % 12) * 35,
    rotation: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
  };
});

function SingleParticle({
  config,
  triggerKey,
}: {
  config: ParticleConfig;
  triggerKey: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      config.delay,
      withSequence(
        withTiming(0.5, {
          duration: 580,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: 950,
          easing: Easing.in(Easing.quad),
        })
      )
    );
  }, [config.delay, progress, triggerKey]);

  const startX = config.fromLeft ? 16 : SCREEN_W - 24;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const currentX = startX + (config.targetX - startX) * p;
    const currentY =
      p <= 0.5
        ? (p / 0.5) * config.peakY
        : config.peakY + ((p - 0.5) / 0.5) * (config.endY - config.peakY);
    const opacity = p < 0.05 ? p * 20 : p > 0.82 ? (1 - p) * 5.5 : 1;

    return {
      opacity,
      transform: [
        { translateX: currentX },
        { translateY: currentY },
        { rotateZ: `${p * config.rotation}deg` },
        { scale: p < 0.15 ? 0.5 + p * 3.5 : 1 },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        !config.emoji && {
          width: config.size,
          height: config.size * 0.65,
          backgroundColor: config.color,
          borderRadius: 3,
        },
        style,
      ]}>
      {config.emoji ? (
        <Text style={{ fontSize: 18 }}>{config.emoji}</Text>
      ) : null}
    </Animated.View>
  );
}

export function ConfettiBlast({
  visible,
  triggerKey = 1,
}: {
  visible: boolean;
  triggerKey?: number;
}) {
  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {PARTICLES.map((p) => (
        <SingleParticle key={p.id} config={p} triggerKey={triggerKey} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    bottom: 20,
    left: 0,
  },
});
