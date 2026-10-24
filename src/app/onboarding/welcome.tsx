import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MASCOT_IMAGES, PrimaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.outer}>
      <Image
        source={MASCOT_IMAGES.arctic}
        style={styles.bgImage}
        contentFit="cover"
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Speech Bubble */}
        <View style={styles.speechBubbleWrap}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Hi there! 👋{'\n'}I’m Pingu, your{'\n'}productivity buddy!
            </Text>
          </View>
          <View style={styles.speechTail} />
        </View>

        {/* Waving Pingu */}
        <View style={styles.mascotWrap}>
          <Image
            source={MASCOT_IMAGES.waving}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* Bottom Card & CTAs */}
        <View style={styles.bottomSection}>
          <Text style={styles.subtitle}>
            Let’s build better{'\n'}habits together.
          </Text>

          <PrimaryButton
            label="Get Started"
            trailingArrow
            onPress={() => router.push('/onboarding/wizard' as any)}
            style={styles.ctaButton}
          />

          <View style={styles.signInRow}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(tabs)' as any)}>
              <Text style={styles.signInLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#E8F6FF',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  speechBubbleWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  speechBubble: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 22,
    paddingHorizontal: 26,
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  speechText: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    lineHeight: 35,
  },
  speechTail: {
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -11,
    marginLeft: -80,
  },
  mascotWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mascotImg: {
    width: 295,
    height: 295,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  subtitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 27,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 34,
  },
  ctaButton: {
    width: '100%',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  alreadyText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    fontWeight: '600',
  },
  signInLink: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: '#1976D2',
  },
});
