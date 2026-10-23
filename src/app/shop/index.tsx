import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import {
  ArcticFooter,
  CoinBadge,
  MASCOT_IMAGES,
  ScreenHeader,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import {
  SHOP_CATALOG,
  ShopCategory,
  usePenguStore,
} from '@/store/usePenguStore';

const CATEGORIES: { label: ShopCategory; icon: keyof typeof Ionicons.glyphMap }[] =
  [
    { label: 'Outfits', icon: 'shirt' },
    { label: 'Accessories', icon: 'glasses' },
    { label: 'Scenery', icon: 'image' },
  ];

export default function RewardsShopScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: ShopCategory }>();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>(
    params.tab ?? 'Outfits'
  );

  const ownedItemIds = usePenguStore((s) => s.ownedItemIds);
  const equippedOutfitId = usePenguStore((s) => s.equippedOutfitId);
  const equippedAccessoryId = usePenguStore((s) => s.equippedAccessoryId);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);

  const items = SHOP_CATALOG.filter((i) => i.category === selectedCategory);

  const isEquipped = (id: string) =>
    id === equippedOutfitId ||
    id === equippedAccessoryId ||
    id === equippedSceneryId;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Rewards shop"
          subtitle="Earn coins by completing habits."
          rightElement={<CoinBadge />}
        />

        {/* Category Pills */}
        <View style={styles.tabsRow}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.label;
            return (
              <Pressable
                key={cat.label}
                onPress={() => setSelectedCategory(cat.label)}
                style={[styles.tabPill, active && styles.tabPillActive]}>
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={active ? '#FFFFFF' : PenguColors.textSecondary}
                />
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 2-Column Item Grid */}
        <View style={styles.grid}>
          {items.map((item) => {
            const owned = ownedItemIds.includes(item.id);
            const equipped = isEquipped(item.id);

            return (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/shop/${item.id}` as any)}
                style={({ pressed }) => [
                  styles.itemCard,
                  owned && styles.itemCardOwned,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}>
                {owned && (
                  <View style={styles.ownedCornerCheck}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}

                <View style={styles.penguinPreviewWrap}>
                  <Image
                    source={MASCOT_IMAGES.celebrating}
                    style={styles.penguinImg}
                    contentFit="contain"
                  />
                  <View
                    style={[
                      styles.itemEmojiBadge,
                      { borderColor: item.accentColor },
                    ]}>
                    <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                  </View>
                </View>

                <Text style={styles.itemName}>{item.name}</Text>

                {owned ? (
                  <View style={styles.ownedPill}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={PenguColors.primaryGreen}
                    />
                    <Text style={styles.ownedPillText}>
                      {equipped ? 'Equipped' : 'Owned'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.pricePill}>
                    <Text style={{ fontSize: 16 }}>🪙</Text>
                    <Text style={styles.priceText}>{item.cost} coins</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* How Coins Work Link */}
        <Pressable
          onPress={() =>
            Alert.alert(
              'How coins work',
              'Every scheduled habit check-in earns you +5 coins and +10 XP. Spend coins on cozy outfits, accessories, and habitat scenery for Pingu!'
            )
          }
          style={styles.howCoinsBtn}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color="#2563EB"
          />
          <Text style={styles.howCoinsText}>How coins work</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563EB" />
        </Pressable>

        <ArcticFooter mascot="celebrating" height={125} />
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
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  tabPillActive: {
    backgroundColor: PenguColors.primaryGreen,
    borderColor: PenguColors.primaryGreen,
  },
  tabText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    gap: 10,
  },
  itemCardOwned: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  ownedCornerCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  penguinPreviewWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  penguinImg: {
    width: 115,
    height: 115,
  },
  itemEmojiBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  itemName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  ownedPill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#CDEED9',
    paddingVertical: 9,
    borderRadius: 999,
  },
  ownedPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  pricePill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PenguColors.surfaceMint,
    paddingVertical: 9,
    borderRadius: 999,
  },
  priceText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  howCoinsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingVertical: 6,
  },
  howCoinsText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});
