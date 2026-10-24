// motion.ts: Adapted from rossark0/rossark-motion-skill (react-native-reanimated 3/4)
// Everything that moves reads a clock: a looping clock for idle life, a one-shot
// clock for a scene that tells an action. All worklets run on the UI thread at 60fps.
import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Things that travel (gaze, sway, a head turning, a progress arc). */
export const EASE_IN_OUT = Easing.bezierFn(0.77, 0, 0.175, 1);
/** Things that open or arrive (a score ring filling, a card appearing, a bar growing). */
export const EASE_OUT = Easing.bezierFn(0.23, 1, 0.32, 1);
/** Only for things leaving or falling away. */
export const EASE_IN = Easing.bezierFn(0.55, 0, 1, 0.45);

export type Key = readonly [number, number, 'out'?];
export type Keys = readonly Key[];

/** The value of a keyframe track at time `t`. Last key equals the first so loops never jump. */
export function track(t: number, keys: Keys): number {
  'worklet';
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const k1 = keys[i];
    if (t <= k1[0]) {
      const k0 = keys[i - 1];
      const span = k1[0] - k0[0];
      const p = span > 0 ? (t - k0[0]) / span : 1;
      const e = k1[2] === 'out' ? EASE_OUT(p) : EASE_IN_OUT(p);
      return k0[1] + (k1[1] - k0[1]) * e;
    }
  }
  return keys[keys.length - 1][1];
}

export type FlowKey = readonly [number, number];

/**
 * Smooth monotone cubic interpolation through key poses for character acting.
 * Passes through keys with continuous velocity without robotic stops or overshoot.
 */
export function flow(t: number, k: readonly FlowKey[]): number {
  'worklet';
  const n = k.length;
  if (t <= k[0][0]) return k[0][1];
  if (t >= k[n - 1][0]) return k[n - 1][1];
  let i = 0;
  while (k[i + 1][0] < t) i++;
  function slope(j: number): number {
    return (k[j + 1][1] - k[j][1]) / (k[j + 1][0] - k[j][0]);
  }
  function tangent(j: number): number {
    if (j === 0 || j === n - 1) return 0;
    const a = slope(j - 1);
    const b = slope(j);
    if (a * b <= 0) return 0;
    const h0 = k[j][0] - k[j - 1][0];
    const h1 = k[j + 1][0] - k[j][0];
    const w0 = 2 * h1 + h0;
    const w1 = h1 + 2 * h0;
    return (w0 + w1) / (w0 / a + w1 / b);
  }
  const h = k[i + 1][0] - k[i][0];
  const s = (t - k[i][0]) / h;
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    (2 * s3 - 3 * s2 + 1) * k[i][1] +
    (s3 - 2 * s2 + s) * h * tangent(i) +
    (-2 * s3 + 3 * s2) * k[i + 1][1] +
    (s3 - s2) * h * tangent(i + 1)
  );
}

/** 0 -> 1 inside window [a, b] of a clock (eased), 0 before, 1 after. */
export function seg(
  t: number,
  a: number,
  b: number,
  curve: 'out' | 'inOut' = 'out'
): number {
  'worklet';
  if (t <= a) return 0;
  if (t >= b) return 1;
  const p = (t - a) / (b - a);
  return curve === 'out' ? EASE_OUT(p) : EASE_IN_OUT(p);
}

/** Smooth sine wave from -1 to 1 with phase offset (0..1) for overlap & follow-through. */
export function wave(t: number, period: number, phase = 0): number {
  'worklet';
  return Math.sin((t / period + phase) * Math.PI * 2);
}

/** Progress through a loop, 0 to 1, with phase offset. */
export function loop(t: number, period: number, phase = 0): number {
  'worklet';
  const p = (t / period + phase) % 1;
  return p < 0 ? p + 1 : p;
}

/** 0 at both ends of a loop and 1 in the middle: fade in and out (sparkles, ripples). */
export function bell(p: number): number {
  'worklet';
  return Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
}

/** Deterministic pseudo-random number in [0, 1) for item `i`. */
export function seeded(i: number, salt = 0): number {
  'worklet';
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Looping clock from 0 to `period` ms. Paused at frame 0 when `live` is false. */
export function useLoopClock(period: number, live = true): SharedValue<number> {
  const clock = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(clock);
    clock.value = 0;
    if (!live) return;
    clock.value = withRepeat(
      withTiming(period, { duration: period, easing: Easing.linear }),
      -1
    );
    return () => cancelAnimation(clock);
  }, [live, period, clock]);
  return clock;
}

/** One-shot clock from 0 to `duration` ms when `play` is true. */
export function useOneShotClock(
  duration: number,
  play: boolean,
  reduced = false
): SharedValue<number> {
  const clock = useSharedValue(reduced ? duration : 0);
  useEffect(() => {
    cancelAnimation(clock);
    if (!play) {
      clock.value = 0;
      return;
    }
    if (reduced) {
      clock.value = duration;
      return;
    }
    clock.value = 0;
    clock.value = withTiming(duration, {
      duration,
      easing: Easing.linear,
    });
    return () => cancelAnimation(clock);
  }, [play, reduced, duration, clock]);
  return clock;
}
