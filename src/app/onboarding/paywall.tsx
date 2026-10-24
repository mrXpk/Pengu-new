import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MASCOT_IMAGES, PrimaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function OnboardingPaywallScreen() {
  const router = useRouter();
  const setPremiumStatus = usePenguStore((s) => s.setPremiumStatus);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleUnlock = () => {
    setPremiumStatus(true);
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        <View style={styles.topBar}>
          <View style={{ width: 40 }} />
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={PenguColors.navyHeading} />
          </Pressable>
        </View>

        <Text style={styles.title}>Build your routine{'\n'}with Pingu</Text>
        <Text style={styles.subtitle}>Your study plan is ready to unlock.</Text>

        {/*Mascot Stage*/}
        <View style={styles.mascotStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.writing}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* Feature Checkmarks Card */}
        <View style={styles.featuresCard}>
          {[
            'Daily habit tracking & gentle reminders',
            'Progress insights for your routine',
            'Penguin rewards as you stay consistent',
          ].map((feat) => (
            <View key={feat} style={styles.featureRow}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Plan Cards */}
        <View style={styles.plansRow}>
          <Pressable
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}>
            <Text style={styles.planName}>Monthly</Text>
            <View style={styles.priceLine}>
              <Text style={styles.priceBig}>$4.99</Text>
              <Text style={styles.pricePeriod}> / month</Text>
            </View>
            <Text style={styles.planNote}>Flexible plan</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedPlan('annual')}
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardSelected,
            ]}>
            <View style={styles.bestValuePill}>
              <Text style={styles.bestValueText}>Best value</Text>
            </View>
            {selectedPlan === 'annual' && (
              <View style={styles.selectedCornerCheck}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            )}
            <Text style={styles.planName}>Annual</Text>
            <View style={styles.priceLine}>
              <Text style={styles.priceBig}>$29.99</Text>
              <Text style={styles.pricePeriod}> / year</Text>
            </View>
            <Text style={styles.planNoteGreen}>$2.50/month billed yearly</Text>
          </Pressable>
        </View>

        <View style={styles.previewBadge}>
          <Text style={styles.previewBadgeText}>Pricing preview</Text>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={PenguColors.textSecondary}
          />
        </View>

        <Text style={styles.cancelCaption}>
          Cancel anytime in your account settings.
        </Text>

        <PrimaryButton
          label="Unlock Penguin Task"
          trailingArrow
          onPress={handleUnlock}
          style={{ width: '100%', marginTop: 10 }}
        />

        <Pressable
          onPress={() => router.replace('/(tabs)' as any)}
          style={styles.continueFreeBtn}>
          <Text style={styles.continueFreeText}>Continue with free plan</Text>
        </Pressable>

        <View style={styles.footerLinks}>
          <Pressable
            onPress={() =>
              Alert.alert('Restore Purchases', 'Your local membership is active!')
            }>
            <Text style={styles.footerLinkText}>Restore purchases</Text>
          </Pressable>
          <Text style={styles.footerDivider}>|</Text>
          <Pressable onPress={() => router.push('/settings/help' as any)}>
            <Text style={styles.footerLinkText}>Terms</Text>
          </Pressable>
          <Text style={styles.footerDivider}>|</Text>
          <Pressable onPress={() => router.push('/settings/help' as any)}>
            <Text style={styles.footerLinkText}>Privacy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 31,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 37,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  mascotStage: {
    width: '100%',
    height: 170,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  mascotImg: {
    width: 160,
    height: 160,
  },
  featuresCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  plansRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: PenguColors.cardBorder,
    justifyContent: 'center',
    position: 'relative',
  },
  planCardSelected: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  bestValuePill: {
    alignSelf: 'flex-start',
    backgroundColor: PenguColors.primaryGreen,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  bestValueText: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  selectedCornerCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planName: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  priceBig: {
    fontFamily: Fonts?.rounded,
    fontSize: 25,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  pricePeriod: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  planNote: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 6,
  },
  planNoteGreen: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
    marginTop: 6,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 6,
  },
  previewBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: PenguColors.textSecondary,
  },
  cancelCaption: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    textAlign: 'center',
  },
  continueFreeBtn: {
    marginTop: 12,
    paddingVertical: 6,
  },
  continueFreeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  footerLinkText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.textSecondary,
  },
  footerDivider: {
    color: PenguColors.textMuted,
    fontSize: 13,
  },
});
