import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPingu } from '@/components/animated-pingu';
import { ConfettiBlast } from '@/components/confetti-blast';
import {
  CoinBadge,
  PrimaryButton,
  ScreenHeader,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

const MILESTONE_TIERS = [
  {
    friendsRequired: 1,
    title: '1 Friend Joins',
    reward: '+250 Coins 🪙 & 1x Ice Shield 🧊',
    emoji: '🧊',
  },
  {
    friendsRequired: 3,
    title: '3 Friends Join',
    reward: 'Royal Emperor Crown 👑 + 750 Coins',
    emoji: '👑',
  },
  {
    friendsRequired: 5,
    title: '5 Friends Join',
    reward: 'Free PenguTask Pro 💎 + 1,500 Coins',
    emoji: '💎',
  },
];

export default function InviteFriendsReferralScreen() {
  const referralCode = usePenguStore((s) => s.referralCode);
  const referredFriends = usePenguStore((s) => s.referredFriends);
  const simulateFriendReferral = usePenguStore((s) => s.simulateFriendReferral);

  const [blastVisible, setBlastVisible] = useState(false);
  const [blastKey, setBlastKey] = useState(1);

  const count = referredFriends.length;

  const handleShareInvite = async () => {
    playSound('tap');
    try {
      await Share.share({
        message: `Join me and my penguin buddy on PenguTask! Use my invite code ${referralCode} to get +100 starter coins and build daily habits together: https://pengutask.app/invite/${referralCode}`,
      });
    } catch {
      Alert.alert('Invite Link Copied', `Share code: ${referralCode}`);
    }
  };

  const handleSimulateSignUp = () => {
    const res = simulateFriendReferral();
    playSound('celebration');
    setBlastVisible(true);
    setBlastKey((k) => k + 1);
    Alert.alert('🎉 Friend Signed Up!', res.rewardText);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ConfettiBlast visible={blastVisible} triggerKey={blastKey} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Invite Friends"
          subtitle="Build habits with friends & unlock exclusive penguin rewards."
          rightElement={<CoinBadge />}
        />

        {/* Hero Stage */}
        <View style={styles.heroCard}>
          <AnimatedPingu
            pose="celebrating"
            mode="celebrating"
            size={145}
            showEquippedBadges
            speechBubble={`${count} friend${count === 1 ? '' : 's'} joined your Iceberg Squad!`}
          />
          <View style={styles.codeBox}>
            <View>
              <Text style={styles.codeLabel}>YOUR PERSONAL INVITE CODE</Text>
              <Text style={styles.codeValue}>{referralCode}</Text>
            </View>
            <Pressable
              onPress={() => {
                playSound('tap');
                Alert.alert('Copied!', `Referral code ${referralCode} copied.`);
              }}
              style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>

          <PrimaryButton
            label="Share Invite Link with Friends"
            icon="share-social"
            onPress={handleShareInvite}
            style={{ width: '100%' }}
          />
        </View>

        {/* Tiered Reward Ladder */}
        <Text style={styles.sectionTitle}>Referral Milestone Rewards</Text>
        <View style={styles.tiersCol}>
          {MILESTONE_TIERS.map((tier) => {
            const unlocked = count >= tier.friendsRequired;
            return (
              <View
                key={tier.friendsRequired}
                style={[
                  styles.tierCard,
                  unlocked && styles.tierCardUnlocked,
                ]}>
                <View
                  style={[
                    styles.tierEmojiCircle,
                    unlocked && styles.tierEmojiCircleUnlocked,
                  ]}>
                  <Text style={{ fontSize: 26 }}>{tier.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tierTitle}>{tier.title}</Text>
                  <Text style={styles.tierReward}>{tier.reward}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    unlocked && styles.statusBadgeUnlocked,
                  ]}>
                  <Text
                    style={[
                      styles.statusBadgeText,
                      unlocked && styles.statusBadgeTextUnlocked,
                    ]}>
                    {unlocked
                      ? '✓ Claimed'
                      : `${count}/${tier.friendsRequired}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Test Button to Simulate Friend Joining */}
        <SecondaryButton
          label="✨ Simulate Friend Sign-Up (Test Reward)"
          variant="mint"
          onPress={handleSimulateSignUp}
          style={{ marginTop: 16 }}
        />

        {/* Friends Who Joined */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>
          Friends Joined ({referredFriends.length})
        </Text>
        <View style={styles.tiersCol}>
          {referredFriends.map((f) => (
            <View key={f.id} style={styles.friendRow}>
              <Text style={{ fontSize: 28 }}>{f.avatar}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.friendName}>{f.name}</Text>
                <Text style={styles.friendSub}>{f.joinedAgo}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakBadgeText}>🔥 {f.streak}d</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PenguColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#EAF6FF',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    gap: 14,
    marginBottom: 20,
  },
  codeBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#38BDF8',
  },
  codeLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 10,
    fontWeight: '800',
    color: PenguColors.textSecondary,
    letterSpacing: 0.6,
  },
  codeValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PenguColors.navyHeading,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  copyBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 12,
  },
  tiersCol: {
    gap: 10,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  tierCardUnlocked: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  tierEmojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierEmojiCircleUnlocked: {
    backgroundColor: '#D5F3E0',
  },
  tierTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  tierReward: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeUnlocked: {
    backgroundColor: PenguColors.primaryGreen,
  },
  statusBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  statusBadgeTextUnlocked: {
    color: '#FFFFFF',
  },
  friendRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  friendName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  friendSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
  },
  streakBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  streakBadgeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: '#EA580C',
  },
});
