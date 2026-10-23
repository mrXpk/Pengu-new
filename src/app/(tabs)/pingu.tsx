import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CoinBadge,
  MASCOT_IMAGES,
  PrimaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { SHOP_CATALOG, usePenguStore } from '@/store/usePenguStore';

export default function PinguHomeScreen() {
  const router = useRouter();
  const companionName = usePenguStore((s) => s.companionName);
  const level = usePenguStore((s) => s.level);
  const xp = usePenguStore((s) => s.xp);
  const ownedItemIds = usePenguStore((s) => s.ownedItemIds);
  const equippedOutfitId = usePenguStore((s) => s.equippedOutfitId);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);

  const equippedOutfit = SHOP_CATALOG.find((i) => i.id === equippedOutfitId);
  const equippedScenery = SHOP_CATALOG.find((i) => i.id === equippedSceneryId);

  const ownedOutfitsCount = SHOP_CATALOG.filter(
    (i) => i.category === 'Outfits' && ownedItemIds.includes(i.id)
  ).length;
  const ownedSceneryCount = SHOP_CATALOG.filter(
    (i) => i.category === 'Scenery' && ownedItemIds.includes(i.id)
  ).length;

  const xpNeeded = Math.max(0, 100 - xp);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Pingu’s home</Text>
          <CoinBadge />
        </View>

        {/* Level & XP Bar Card */}
        <View style={styles.levelCard}>
          <Text style={{ fontSize: 22 }}>⭐</Text>
          <Text style={styles.levelLabel}>Level {level}</Text>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.min(100, xp)}%` }]} />
          </View>
          <Text style={styles.xpText}>{xp} / 100 XP</Text>
        </View>

        {/* Cozy Igloo Habitat Stage */}
        <View style={styles.habitatStage}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.habitatBg}
            contentFit="cover"
          />
          <View style={styles.iglooArch}>
            <View style={styles.roomDecorLeft}>
              <Text style={{ fontSize: 28 }}>🪴</Text>
              <Text style={{ fontSize: 26 }}>🛋️</Text>
            </View>

            <View style={styles.penguinCenterWrap}>
              {equippedOutfit && (
                <View style={styles.equippedPill}>
                  <Text style={{ fontSize: 14 }}>{equippedOutfit.emoji}</Text>
                  <Text style={styles.equippedPillText}>
                    {equippedOutfit.name}
                  </Text>
                </View>
              )}
              <Image
                source={MASCOT_IMAGES.celebrating}
                style={styles.penguinHero}
                contentFit="contain"
              />
              <View style={styles.cozyRug} />
            </View>

            <View style={styles.roomDecorRight}>
              <Text style={{ fontSize: 26 }}>📚</Text>
              <Text style={{ fontSize: 26 }}>❄️</Text>
            </View>
          </View>
        </View>

        {/* Companion Name Banner */}
        <View style={styles.nameBanner}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.companionName}>{companionName}</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>

        {/* 3 Quick Action Cards: Outfits, Scenery, Shop */}
        <View style={styles.categoryGrid}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/shop',
                params: { tab: 'Outfits' },
              } as any)
            }
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={styles.categoryEmoji}>🧶</Text>
            <Text style={styles.categoryTitle}>Outfits</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/shop',
                params: { tab: 'Scenery' },
              } as any)
            }
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={styles.categoryEmoji}>🧊</Text>
            <Text style={styles.categoryTitle}>Scenery</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/shop' as any)}
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={styles.categoryEmoji}>🛍️</Text>
            <Text style={styles.categoryTitle}>Shop</Text>
          </Pressable>
        </View>

        {/* Milestone & Collection Cards */}
        <View style={styles.bottomInfoRow}>
          <Pressable
            onPress={() => router.push('/progress/achievements' as any)}
            style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Next milestone</Text>
            <Text style={styles.infoBigEmoji}>🚩</Text>
            <Text style={styles.infoCardValue}>
              {xpNeeded} XP to Level {level + 1}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/shop' as any)}
            style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Your collection</Text>
            <View style={styles.collectionIconsRow}>
              <Text style={styles.infoBigEmoji}>
                {equippedOutfit?.emoji ?? '🧣'}
              </Text>
              <Text style={styles.infoBigEmoji}>
                {equippedScenery?.emoji ?? '🏔️'}
              </Text>
            </View>
            <Text style={styles.infoCardValue}>
              {ownedOutfitsCount} outfit • {ownedSceneryCount} scenery
            </Text>
          </Pressable>
        </View>

        {/* Visit Rewards Shop CTA */}
        <PrimaryButton
          label="Visit rewards shop"
          icon="cart"
          trailingArrow
          onPress={() => router.push('/shop' as any)}
        />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  levelLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  xpTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: PenguColors.primaryGreen,
  },
  xpText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  habitatStage: {
    height: 235,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    justifyContent: 'flex-end',
    padding: 16,
  },
  habitatBg: {
    ...StyleSheet.absoluteFill,
  },
  iglooArch: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  roomDecorLeft: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 10,
    borderRadius: 18,
  },
  roomDecorRight: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 10,
    borderRadius: 18,
  },
  penguinCenterWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  equippedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  equippedPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  penguinHero: {
    width: 150,
    height: 150,
    zIndex: 2,
  },
  cozyRug: {
    width: 170,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#7DD3FC',
    marginTop: -16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  nameBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  sparkle: {
    fontSize: 18,
  },
  companionName: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: PenguColors.surfaceMintLight,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 40,
  },
  categoryTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  bottomInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    minHeight: 136,
  },
  infoCardTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  infoBigEmoji: {
    fontSize: 38,
    marginVertical: 6,
  },
  collectionIconsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  infoCardValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
});
