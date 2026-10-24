import { Platform, Vibration } from 'react-native';

import { usePenguStore } from '@/store/usePenguStore';

export type SoundEffectType =
  | 'tap'
  | 'checkin'
  | 'celebration'
  | 'iceCrack'
  | 'chestOpen'
  | 'timerStart'
  | 'timerDone'
  | 'discount'
  | 'cheer'
  | 'pledgeTick';

export type AmbientSoundscapeType = 'none' | 'rain' | 'wind' | 'brown' | 'binaural';

let webAudioCtx: AudioContext | null = null;
let activeAmbientCleanup: (() => void) | null = null;

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined') return null;
  if (!webAudioCtx) {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      webAudioCtx = new AudioCtx();
    }
  }
  if (webAudioCtx && webAudioCtx.state === 'suspended') {
    webAudioCtx.resume().catch(() => {});
  }
  return webAudioCtx;
}

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'triangle',
  peakGain = 0.22,
  endFreq?: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
  }

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.018, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/**
 * Duolingo-inspired zero-latency procedural sound & haptic engine
 */
export function playSound(effect: SoundEffectType, pitchMultiplier = 1) {
  const { soundAndVibration } = usePenguStore.getState();
  if (!soundAndVibration) return;

  // Native vibration patterns
  if (Platform.OS !== 'web') {
    switch (effect) {
      case 'tap':
      case 'pledgeTick':
        Vibration.vibrate(12);
        break;
      case 'checkin':
      case 'cheer':
        Vibration.vibrate([0, 22, 40, 35]);
        break;
      case 'celebration':
      case 'chestOpen':
        Vibration.vibrate([0, 35, 50, 45, 60, 80]);
        break;
      case 'iceCrack':
        Vibration.vibrate(30);
        break;
      default:
        Vibration.vibrate(18);
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (effect) {
    case 'tap': {
      // Crisp Duolingo wooden/bubble pop
      playNote(ctx, 210 * pitchMultiplier, now, 0.055, 'sine', 0.16, 420 * pitchMultiplier);
      break;
    }

    case 'pledgeTick': {
      playNote(ctx, 320 * pitchMultiplier, now, 0.07, 'triangle', 0.18, 520 * pitchMultiplier);
      break;
    }

    case 'checkin': {
      // Bright Duolingo upward major marimba arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        const t = now + idx * 0.065;
        playNote(ctx, f, t, 0.24, 'triangle', 0.25);
        playNote(ctx, f * 2, t, 0.14, 'sine', 0.08);
      });
      break;
    }

    case 'cheer': {
      // High-five double chime
      playNote(ctx, 587.33, now, 0.12, 'triangle', 0.22);
      playNote(ctx, 880, now + 0.075, 0.25, 'triangle', 0.25);
      break;
    }

    case 'celebration': {
      // Triumphant Duolingo Perfect Lesson Fanfare!
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.14 }, // C5
        { f: 659.25, t: 0.1, d: 0.14 }, // E5
        { f: 783.99, t: 0.2, d: 0.14 }, // G5
        { f: 1046.5, t: 0.31, d: 0.22 }, // C6
        { f: 783.99, t: 0.48, d: 0.14 }, // G5
        { f: 1046.5, t: 0.6, d: 0.55 }, // C6 sustain
        { f: 1318.5, t: 0.6, d: 0.55 }, // E6 harmony
        { f: 1567.98, t: 0.6, d: 0.55 }, // G6 harmony
      ];
      fanfare.forEach((n) => {
        playNote(ctx, n.f, now + n.t, n.d, 'triangle', 0.22);
        playNote(ctx, n.f * 0.5, now + n.t, n.d, 'sine', 0.1);
      });
      break;
    }

    case 'iceCrack': {
      // Crisp crystalline ice crack
      playNote(ctx, 920, now, 0.05, 'sawtooth', 0.15, 280);
      playNote(ctx, 1480, now + 0.02, 0.06, 'triangle', 0.18, 620);
      break;
    }

    case 'chestOpen': {
      // Magical treasure unlock arpeggio
      const chestNotes = [349.23, 440, 523.25, 698.46, 880, 1046.5, 1396.91];
      chestNotes.forEach((f, i) => {
        playNote(ctx, f, now + i * 0.055, 0.35, 'triangle', 0.22);
        playNote(ctx, f * 1.5, now + i * 0.055, 0.2, 'sine', 0.08);
      });
      break;
    }

    case 'timerStart': {
      // Gentle zen bowl strike
      playNote(ctx, 432, now, 0.65, 'sine', 0.24);
      playNote(ctx, 864, now, 0.45, 'sine', 0.09);
      break;
    }

    case 'timerDone': {
      // Double harmonic zen singing bowl + sparkle
      [528, 792, 1056].forEach((f, i) => {
        playNote(ctx, f, now + i * 0.14, 0.75, 'sine', 0.22);
      });
      break;
    }

    case 'discount': {
      // Exciting power-up reveal sweep
      const sweep = [440, 554.37, 659.25, 880, 1108.73];
      sweep.forEach((f, i) => {
        playNote(ctx, f, now + i * 0.05, 0.24, 'triangle', 0.22);
      });
      break;
    }
  }
}

/**
 * ADHD Focus Ambient Soundscape Generator (Procedural Rain, Arctic Wind, Brown Noise, Binaural Flow)
 */
export function startAmbientSoundscape(mode: AmbientSoundscapeType) {
  stopAmbientSoundscape();
  if (mode === 'none') return;

  const { soundAndVibration } = usePenguStore.getState();
  if (!soundAndVibration) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (mode === 'binaural') {
    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    const gain = ctx.createGain();

    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    oscLeft.frequency.value = 200;
    oscRight.frequency.value = 210; // 10Hz Alpha focus wave

    gain.gain.value = 0.04;
    oscLeft.connect(gain);
    oscRight.connect(gain);
    gain.connect(ctx.destination);

    oscLeft.start();
    oscRight.start();

    activeAmbientCleanup = () => {
      try {
        oscLeft.stop();
        oscRight.stop();
        gain.disconnect();
      } catch {}
    };
    return;
  }

  // Procedural noise buffer (Rain / Wind / Brown Noise)
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= mode === 'rain' ? 2.5 : 3.2;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = mode === 'wind' ? 'bandpass' : 'lowpass';
  filter.frequency.value = mode === 'rain' ? 850 : mode === 'wind' ? 380 : 240;

  const gainNode = ctx.createGain();
  gainNode.gain.value = mode === 'rain' ? 0.07 : 0.06;

  whiteNoise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  whiteNoise.start(0);

  activeAmbientCleanup = () => {
    try {
      whiteNoise.stop();
      whiteNoise.disconnect();
      gainNode.disconnect();
    } catch {}
  };
}

export function stopAmbientSoundscape() {
  if (activeAmbientCleanup) {
    activeAmbientCleanup();
    activeAmbientCleanup = null;
  }
}
