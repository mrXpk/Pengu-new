import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import { MASCOT_IMAGES, PrimaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors, PenguinObsidianTheme } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

type PaywallStage = 'standard' | 'offer50' | 'bumper70';

const WHAT_YOU_GET_ITEMS = [
  {
    emoji: '✨',
    title: 'Unlimited Build & Break Habits',
    sub: 'Track daily routines + clean-streak timers for bad habits.',
  },
  {
    emoji: '⏱️',
    title: 'ADHD Body-Doubling Focus Studio',
    sub: 'Study alongside Pingu with Cozy Rain, Brown Noise & 2x XP.',
  },
  {
    emoji: '🤝',
    title: 'Shared Co-Op Buddy Streaks',
    sub: 'Keep shared flames alive with friends & nudge partners.',
  },
  {
    emoji: '🐧',
    title: 'Penguin Obsidian Plumage Theme',
    sub: 'Unlock the velvet dark penguin-skin theme & exclusive outfits.',
  },
  {
    emoji: '🧊',
    title: 'Monthly Streak Ice Shields + 500 Bonus Coins',
    sub: 'Never lose your hard-earned streak on a busy day.',
  },
];

export default function OnboardingPaywallScreen() {
  const router = useRouter();
  const setPremiumStatus = usePenguStore((s) => s.setPremiumStatus);
  const unlockAndEquipMilestone = usePenguStore(
    (s) => s.unlockAndEquipMilestone
  );

  const [stage, setStage] = useState<PaywallStage>('standard');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    'annual'
  );
  const [countdownSecs, setCountdownSecs] = useState(599); // 09:59
  const [blastVisible, setBlastVisible] = useState(false);
  const [blastKey, setBlastKey] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSecs((prev) => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minsStr = Math.floor(countdownSecs / 60)
    .toString()
    .padStart(2, '0');
  const secsStr = (countdownSecs % 60).toString().padStart(2, '0');

  const handleCloseOrIntercept = () => {
    if (stage === 'standard') {
      playSound('discount');
      setBlastVisible(true);
      setBlastKey((k) => k + 1);
      setStage('offer50');
    } else if (stage === 'offer50') {
      playSound('celebration');
      setBlastVisible(true);
      setBlastKey((k) => k + 1);
      setStage('bumper70');
    } else {
      playSound('tap');
      router.replace('/(tabs)' as any);
    }
  };

  const handleUnlockPro = (tierLabel: string) => {
    playSound('celebration');
    setPremiumStatus(true);
    if (stage === 'bumper70') {
      unlockAndEquipMilestone('star-crown');
    }
    Alert.alert(
      '🎉 Welcome to PenguTask Pro!',
      `Your ${tierLabel} membership is active! All ADHD Focus tools, Co-Op Streaks, and Penguin rewards are unlocked.`,
      [
        {
          text: 'Let’s Go!',
          onPress: () => router.replace('/(tabs)' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ConfettiBlast visible={blastVisible} triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Bar with Funnel Stage Indicator & Intercept Close Button */}
        <View style={styles.topBar}>
          <View style={styles.stageBadge}>
            <Text style={styles.stageBadgeText}>
              {stage === 'standard'
                ? '👑 PENGUTASK PRO'
                : stage === 'offer50'
                ? `⏳ RARE 50% FLASH OFFER • ${minsStr}:${secsStr}`
                : '💎 FINAL ONE-TIME 70% BUMPER OFFER'}
            </Text>
          </View>
          <Pressable onPress={handleCloseOrIntercept} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#CBD5E1" />
          </Pressable>
        </View>

        {/* STAGE 1: STANDARD HARD PAYWALL */}
        {stage === 'standard' && (
          <>
            <Text style={styles.title}>
              Build & break habits{'\n'}3.4x faster with Pingu
            </Text>
            <Text style={styles.subtitle}>
              Your custom routine is ready. Unlock the complete PenguTask Pro
              ecosystem.
            </Text>

            <View style={styles.mascotStage}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={styles.stageBg}
                contentFit="cover"
              />
              <AnimatedPingu
                pose="writing"
                mode="celebrating"
                size={145}
                showEquippedBadges
                speechBubble="I’m ready to be your daily habit buddy!"
              />
            </View>

            {/* What You Get Immediately */}
            <View style={styles.benefitsBox}>
              <Text style={styles.benefitsHeader}>
                WHAT YOU UNLOCK IMMEDIATELY
              </Text>
              {WHAT_YOU_GET_ITEMS.map((item) => (
                <View key={item.title} style={styles.benefitRow}>
                  <View style={styles.benefitEmojiBox}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.benefitTitle}>{item.title}</Text>
                    <Text style={styles.benefitSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
              ))}
            </View>

            {/* Plan Selector Cards */}
            <View style={styles.plansRow}>
              <Pressable
                onPress={() => {
                  playSound('tap');
                  setSelectedPlan('monthly');
                }}
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}>
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.priceBig}>$6.99</Text>
                <Text style={styles.priceSub}>per month</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  playSound('tap');
                  setSelectedPlan('annual');
                }}
                style={[
                  styles.planCard,
                  selectedPlan === 'annual' && styles.planCardSelected,
                ]}>
                <View style={styles.bestValuePill}>
                  <Text style={styles.bestValueText}>MOST POPULAR</Text>
                </View>
                <Text style={styles.planName}>Annual Pro</Text>
                <Text style={styles.priceBig}>$39.99</Text>
                <Text style={styles.priceSubGreen}>
                  $3.33/mo • 7-day free trial
                </Text>
              </Pressable>
            </View>

            <PrimaryButton
              label="Start 7-Day Free Trial & Unlock Pro"
              trailingArrow
              onPress={() => handleUnlockPro('Annual Pro')}
              style={{ width: '100%' }}
            />

            <Pressable
              onPress={handleCloseOrIntercept}
              style={styles.declineBtn}>
              <Text style={styles.declineText}>
                Maybe later (See if a scholarship is available)
              </Text>
            </Pressable>
          </>
        )}

        {/* STAGE 2: 50% OFF RARE FLASH OFFER */}
        {stage === 'offer50' && (
          <>
            <View style={styles.flashBanner}>
              <Text style={styles.flashBannerText}>
                ⚡ WAIT! DON’T LEAVE PINGU BEHIND — 50% OFF UNLOCKED!
              </Text>
            </View>

            <Text style={styles.title}>
              Claim Your 50% OFF{'\n'}Starter Scholarship
            </Text>
            <Text style={styles.subtitle}>
              We never want price to stop you from building life-changing
              habits.
            </Text>

            <View style={styles.mascotStage}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={styles.stageBg}
                contentFit="cover"
              />
              <AnimatedPingu
                pose="encouraging"
                mode="celebrating"
                size={150}
                showEquippedBadges
                speechBubble="Let’s do this together for half price! 🧣"
              />
            </View>

            <View style={styles.offerHighlightCard}>
              <View style={styles.discountRibbon}>
                <Text style={styles.discountRibbonText}>SAVE 50% TODAY</Text>
              </View>
              <Text style={styles.offerStrike}>$39.99 / year</Text>
              <Text style={styles.offerBigPrice}>$19.99 / year</Text>
              <Text style={styles.offerPerMonth}>
                Just $1.66 / month • Full Pro Access
              </Text>

              <View style={styles.offerDivider} />
              {WHAT_YOU_GET_ITEMS.slice(0, 4).map((item) => (
                <View key={item.title} style={styles.miniCheckRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.miniCheckText}>{item.title}</Text>
                </View>
              ))}
            </View>

            <PrimaryButton
              label="🎁 Claim 50% OFF Scholarship ($1.66/mo)"
              trailingArrow
              onPress={() => handleUnlockPro('50% OFF Scholarship')}
              style={{ width: '100%' }}
            />

            <Pressable
              onPress={handleCloseOrIntercept}
              style={styles.declineBtn}>
              <Text style={styles.declineText}>
                No thanks, I’ll pass on the 50% discount
              </Text>
            </Pressable>
          </>
        )}

        {/* STAGE 3: FINAL ONE-TIME 70% OFF BUMPER OFFER */}
        {stage === 'bumper70' && (
          <>
            <View
              style={[
                styles.flashBanner,
                { backgroundColor: '#F59E0B', borderColor: '#FDE68A' },
              ]}>
              <Text style={[styles.flashBannerText, { color: '#09111E' }]}>
                🔥 FINAL ONE-TIME 70% OFF BUMPER OFFER — NEVER SHOWN AGAIN!
              </Text>
            </View>

            <Text style={styles.title}>
              Last Chance: 70% OFF{'\n'}+ Royal Emperor Bundle!
            </Text>
            <Text style={styles.subtitle}>
              Once you close this screen, this $0.99/mo Founder’s Bumper Offer
              disappears forever.
            </Text>

            <View style={styles.mascotStage}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={styles.stageBg}
                contentFit="cover"
              />
              <AnimatedPingu
                pose="celebrating"
                mode="celebrating"
                size={155}
                showEquippedBadges
                speechBubble="👑 70% OFF + Free Emperor Crown Outfit!"
              />
            </View>

            <View
              style={[
                styles.offerHighlightCard,
                { borderColor: '#F59E0B', borderWidth: 2.5 },
              ]}>
              <View
                style={[
                  styles.discountRibbon,
                  { backgroundColor: '#F59E0B' },
                ]}>
                <Text
                  style={[styles.discountRibbonText, { color: '#09111E' }]}>
                  70% OFF BUMPER BUNDLE • EXPIRES IN {minsStr}:{secsStr}
                </Text>
              </View>
              <Text style={styles.offerStrike}>$39.99 / year</Text>
              <Text style={[styles.offerBigPrice, { color: '#FACC15' }]}>
                $11.99 / year
              </Text>
              <Text style={styles.offerPerMonth}>
                Only $0.99 / month! (Less than a cup of tea)
              </Text>

              <View style={styles.offerDivider} />
              <Text style={styles.benefitsHeader}>
                EVERYTHING INCLUDED IN YOUR 70% BUMPER PACK:
              </Text>
              {WHAT_YOU_GET_ITEMS.map((item) => (
                <View key={item.title} style={styles.miniCheckRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#FACC15" />
                  <Text style={styles.miniCheckText}>{item.title}</Text>
                </View>
              ))}
              <View style={styles.miniCheckRow}>
                <Ionicons name="sparkles" size={18} color="#FACC15" />
                <Text style={[styles.miniCheckText, { color: '#FACC15' }]}>
                  BONUS: Instant Royal Emperor Crown Outfit 👑
                </Text>
              </View>
            </View>

            <PrimaryButton
              label="👑 Claim 70% OFF Bumper Offer ($0.99/mo)"
              trailingArrow
              onPress={() => handleUnlockPro('70% OFF Founder Bumper')}
              style={{
                width: '100%',
                backgroundColor: '#F59E0B',
                borderBottomColor: '#B45309',
              }}
            />

            <Pressable
              onPress={handleCloseOrIntercept}
              style={styles.declineBtn}>
              <Text style={styles.declineText}>
                I understand I’ll never see 70% off again • Continue with
                limited free mode
              </Text>
            </Pressable>
          </>
        )}

        {/* Footer Legal Links */}
        <View style={styles.footerLinks}>
          <Pressable
            onPress={() =>
              Alert.alert('Restore Purchases', 'Your Pro membership is active!')
            }>
            <Text style={styles.footerLinkText}>Restore purchases</Text>
          </Pressable>
          <Text style={styles.footerDivider}>•</Text>
          <Pressable onPress={() => router.push('/settings/help' as any)}>
            <Text style={styles.footerLinkText}>Terms</Text>
          </Pressable>
          <Text style={styles.footerDivider}>•</Text>
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
    backgroundColor: PenguinObsidianTheme.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stageBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stageBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PenguinObsidianTheme.card,
    borderWidth: 1,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 29,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 35,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 20,
  },
  mascotStage: {
    width: '100%',
    height: 185,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PenguinObsidianTheme.card,
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    marginBottom: 14,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  benefitsBox: {
    width: '100%',
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    marginBottom: 16,
  },
  benefitsHeader: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '900',
    color: PenguinObsidianTheme.glacierCyan,
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  benefitSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  plansRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  planCard: {
    flex: 1,
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
    position: 'relative',
  },
  planCardSelected: {
    backgroundColor: PenguinObsidianTheme.cardSelected,
    borderColor: '#10B981',
  },
  bestValuePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  bestValueText: {
    fontFamily: Fonts?.rounded,
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  planName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  priceBig: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  priceSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  priceSubGreen: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 2,
  },
  flashBanner: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1.5,
    borderColor: '#F87171',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  flashBannerText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '900',
    color: '#FCA5A5',
    textAlign: 'center',
  },
  offerHighlightCard: {
    width: '100%',
    backgroundColor: PenguinObsidianTheme.card,
    borderRadius: 26,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountRibbon: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  discountRibbonText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  offerStrike: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  offerBigPrice: {
    fontFamily: Fonts?.rounded,
    fontSize: 38,
    fontWeight: '900',
    color: '#34D399',
    marginTop: 2,
  },
  offerPerMonth: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  offerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: PenguinObsidianTheme.bellyHighlightBorder,
    marginVertical: 14,
  },
  miniCheckRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  miniCheckText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  declineBtn: {
    marginTop: 14,
    paddingVertical: 8,
  },
  declineText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  footerLinkText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: '#64748B',
  },
  footerDivider: {
    color: '#475569',
    fontSize: 12,
  },
});
