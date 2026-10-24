import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 550);

    const timer = setTimeout(() => {
      router.replace('/onboarding/welcome' as any);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <Pressable
      style={styles.outer}
      onPress={() => router.replace('/onboarding/welcome' as any)}>
      <Image
        source={MASCOT_IMAGES.arctic}
        style={styles.bgImage}
        contentFit="cover"
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.topBrand}>
          <View style={styles.crownRow}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.crownEmoji}>👑</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
          <Image
            source={MASCOT_IMAGES.wordmark}
            style={styles.wordmarkImg}
            contentFit="contain"
          />
          <Text style={styles.tagline}>Small steps,{'\n'}big dreams!</Text>
        </View>

        <View style={styles.mascotWrap}>
          <Image
            source={MASCOT_IMAGES.checklist}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        <View style={styles.bottomLoader}>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.tapHint}>Tap anywhere to continue</Text>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#BCE6FF',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  topBrand: {
    alignItems: 'center',
    marginTop: 18,
  },
  crownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: -8,
  },
  crownEmoji: {
    fontSize: 44,
  },
  sparkle: {
    fontSize: 22,
  },
  wordmarkImg: {
    width: 280,
    height: 130,
  },
  tagline: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 34,
    marginTop: 4,
  },
  mascotWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mascotImg: {
    width: 310,
    height: 310,
  },
  bottomLoader: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  progressTrack: {
    width: '78%',
    height: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#2295F2',
  },
  tapHint: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.navyHeading,
    opacity: 0.7,
  },
});
