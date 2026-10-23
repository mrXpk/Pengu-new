import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';

export default function MembershipScreen() {
  const router = useRouter();

  const perks = [
    { emoji: '📚', title: 'Personalized habit tools' },
    { emoji: '📊', title: 'Progress insights' },
    { emoji: '🐧', title: 'Companion customization' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={PenguColors.navyHeading}
          />
        </Pressable>

        <Text style={styles.pageTitle}>Your membership</Text>

        <View style={styles.heroStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.checklist}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* Gold Premium Banner */}
        <View style={styles.goldBanner}>
          <Text style={{ fontSize: 32 }}>👑</Text>
          <Text style={styles.goldBannerText}>Penguin Task Premium</Text>
          <Text style={{ fontSize: 18 }}>✨</Text>
        </View>

        {/* Active Membership Card */}
        <View style={styles.activeCard}>
          <View style={styles.greenCheck}>
            <Ionicons name="checkmark" size={26} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.activeTitle}>Active membership</Text>
            <Text style={styles.activeSub}>
              Your billing details are available in your app store.
            </Text>
          </View>
        </View>

        {/* Perks List */}
        <View style={styles.perksList}>
          {perks.map((p) => (
            <View key={p.title} style={styles.perkRow}>
              <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
              <Text style={styles.perkTitle}>{p.title}</Text>
              <View style={styles.smallCheck}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Manage subscription"
          trailingArrow
          onPress={() =>
            Alert.alert(
              'Penguin Task Premium',
              'Your Premium membership is active on this device!'
            )
          }
          style={{ marginTop: 14 }}
        />

        <SecondaryButton
          label="Restore purchases"
          onPress={() =>
            Alert.alert('Restored', 'Your Premium membership is up to date.')
          }
          style={{ marginTop: 10 }}
        />

        <Text style={styles.footerNote}>
          Subscriptions are managed through your app store.
        </Text>
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
    paddingBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 32,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  heroStage: {
    height: 170,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  mascotImg: {
    width: 155,
    height: 155,
  },
  goldBanner: {
    backgroundColor: '#FFF6DF',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: PenguColors.goldBorder,
    marginBottom: 12,
  },
  goldBannerText: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  activeCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginBottom: 12,
  },
  greenCheck: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  activeSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    lineHeight: 20,
  },
  perksList: {
    gap: 10,
  },
  perkRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  perkTitle: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  smallCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNote: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
});
