import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArcticFooter, MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function SettingsScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const isPremium = usePenguStore((s) => s.isPremium);
  const soundAndVibration = usePenguStore((s) => s.soundAndVibration);
  const setSoundAndVibration = usePenguStore((s) => s.setSoundAndVibration);

  const menuRows = [
    {
      label: 'Notifications',
      emoji: '🔔',
      route: '/settings/notifications',
    },
    {
      label: 'Appearance',
      emoji: '🎨',
      route: '/settings/appearance',
    },
    {
      label: 'Sound & vibration',
      emoji: '🔊',
      isToggle: true,
    },
    {
      label: 'Profile',
      emoji: '👤',
      route: '/settings/profile',
    },
    {
      label: 'Membership',
      emoji: '👑',
      route: '/settings/membership',
    },
    {
      label: 'Account & data',
      emoji: '🗄️',
      route: '/settings/account',
    },
    {
      label: 'Help & about',
      emoji: '❓',
      route: '/settings/help',
    },
    {
      label: 'Invite Friends & Rewards',
      emoji: '🎁',
      route: '/referrals',
    },
    {
      label: 'Run Onboarding Flow (22 steps)',
      emoji: '🧭',
      route: '/onboarding/splash',
    },
    {
      label: '3-Stage Paywall (50% → 70% Offer)',
      emoji: '💎',
      route: '/onboarding/paywall',
    },
    {
      label: 'Welcome Back Screen',
      emoji: '👋',
      route: '/onboarding/welcome-back',
    },
    {
      label: 'Milestone Reward Preview',
      emoji: '🧢',
      route: '/shop/milestone',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}>
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: PenguColors.cardBorder,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={PenguColors.navyHeading}
            />
          </Pressable>
          <Text style={[styles.pageTitle, { marginBottom: 0 }]}>Settings</Text>
        </View>

        {/* User Profile Card */}
        <Pressable
          onPress={() => router.push('/settings/profile' as any)}
          style={({ pressed }) => [
            styles.profileBanner,
            pressed && { opacity: 0.9 },
          ]}>
          <View style={styles.avatarCircle}>
            <Image
              source={MASCOT_IMAGES.celebrating}
              style={styles.avatarImg}
              contentFit="contain"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            {isPremium && (
              <View style={styles.premiumPill}>
                <Text style={{ fontSize: 13 }}>👑</Text>
                <Text style={styles.premiumPillText}>Premium member</Text>
              </View>
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={PenguColors.textSecondary}
          />
        </Pressable>

        {/* Settings Rows */}
        <View style={styles.menuList}>
          {menuRows.map((item) => {
            if (item.isToggle) {
              return (
                <View key={item.label} style={styles.menuRow}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Switch
                    value={soundAndVibration}
                    onValueChange={setSoundAndVibration}
                    trackColor={{
                      false: '#CBD5E1',
                      true: PenguColors.primaryGreen,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              );
            }

            return (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && { backgroundColor: PenguColors.surfaceMintLight },
                ]}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={PenguColors.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.versionText}>Penguin Task • Version 1.0</Text>
        <ArcticFooter mascot="celebrating" height={115} />
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 14,
  },
  profileBanner: {
    backgroundColor: PenguColors.surfaceMintLight,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F7E9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 64,
    height: 64,
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  profileName: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  premiumPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D5F3E0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  premiumPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  menuList: {
    gap: 10,
  },
  menuRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  menuEmoji: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  versionText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 18,
  },
});
