import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
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
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { SHOP_CATALOG, usePenguStore } from '@/store/usePenguStore';

export default function ShopItemPreviewScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const coins = usePenguStore((s) => s.coins);
  const ownedItemIds = usePenguStore((s) => s.ownedItemIds);
  const equippedOutfitId = usePenguStore((s) => s.equippedOutfitId);
  const equippedAccessoryId = usePenguStore((s) => s.equippedAccessoryId);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);
  const buyItem = usePenguStore((s) => s.buyItem);
  const equipItem = usePenguStore((s) => s.equipItem);

  const item =
    SHOP_CATALOG.find((i) => i.id === itemId) ?? SHOP_CATALOG[1];
  const isOwned = ownedItemIds.includes(item.id);
  const isEquipped =
    item.id === equippedOutfitId ||
    item.id === equippedAccessoryId ||
    item.id === equippedSceneryId;
  const canAfford = coins >= item.cost;
  const balanceAfter = Math.max(0, coins - item.cost);

  const handleConfirmPurchase = () => {
    const ok = buyItem(item.id);
    if (ok) {
      setConfirmOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Navigation Row */}
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={PenguColors.navyHeading}
            />
          </Pressable>
          <Text style={styles.topTitle}>{item.name}</Text>
          <CoinBadge />
        </View>

        {/* Big Mascot Stage */}
        <View style={styles.stageBox}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.penguinHero}
            contentFit="contain"
          />
          <View
            style={[
              styles.floatingItemBadge,
              { borderColor: item.accentColor },
            ]}>
            <Text style={{ fontSize: 34 }}>{item.emoji}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>{item.subtitle}</Text>

        {/* Price & Balance Card */}
        <View style={styles.priceBox}>
          <Text style={{ fontSize: 42 }}>🪙</Text>
          <View style={styles.priceInfo}>
            <Text style={styles.priceAmount}>
              {isOwned ? 'Unlocked in collection' : `${item.cost} coins`}
            </Text>
            <Text style={styles.balanceSub}>
              {isOwned
                ? isEquipped
                  ? 'Currently equipped on Pingu.'
                  : 'Ready to equip anytime.'
                : canAfford
                ? `Balance after purchase: ${balanceAfter} coins.`
                : `Need ${item.cost - coins} more coins to unlock.`}
            </Text>
          </View>
        </View>

        {isOwned ? (
          <PrimaryButton
            label={isEquipped ? 'Equipped ✓' : 'Equip now'}
            trailingArrow={!isEquipped}
            onPress={() => {
              equipItem(item.id);
              router.back();
            }}
          />
        ) : (
          <PrimaryButton
            label={
              canAfford
                ? `Buy for ${item.cost} coins`
                : `Not enough coins (${item.cost})`
            }
            disabled={!canAfford}
            onPress={() => setConfirmOpen(true)}
          />
        )}

        <SecondaryButton
          label="Back to shop"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        />

        <Text style={styles.disclaimer}>
          Cosmetic item • No effect on habit progress.
        </Text>
      </ScrollView>

      {/* Confirmation Bottom Sheet Modal (Penguin Explorer Backpack Confirmation.png) */}
      <Modal
        visible={confirmOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Get {item.name}?</Text>

            <View style={styles.modalMascotWrap}>
              <Image
                source={MASCOT_IMAGES.celebrating}
                style={styles.modalPenguin}
                contentFit="contain"
              />
              <View style={styles.modalEmojiTag}>
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
              </View>
            </View>

            <View style={styles.ledgerCard}>
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>🪙  Your coins</Text>
                <Text style={styles.ledgerValue}>{coins}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>🛒  Item cost</Text>
                <Text style={styles.ledgerValue}>– {item.cost}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>👛  Balance after purchase</Text>
                <Text style={styles.ledgerValue}>{balanceAfter}</Text>
              </View>
            </View>

            <Text style={styles.modalNote}>
              Uses earned coins. No money will be charged.
            </Text>

            <PrimaryButton
              label="Confirm purchase"
              onPress={handleConfirmPurchase}
              style={{ width: '100%' }}
            />

            <SecondaryButton
              label="Cancel"
              onPress={() => setConfirmOpen(false)}
              style={{ width: '100%', marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  topTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  stageBox: {
    height: 280,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
    marginBottom: 18,
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
  },
  penguinHero: {
    width: 230,
    height: 230,
  },
  floatingItemBadge: {
    position: 'absolute',
    bottom: 18,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  subtitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  priceBox: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.primaryGreen,
    marginBottom: 16,
  },
  priceInfo: {
    flex: 1,
    gap: 4,
  },
  priceAmount: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  balanceSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  disclaimer: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 30, 66, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 26,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  modalMascotWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalPenguin: {
    width: 145,
    height: 145,
  },
  modalEmojiTag: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF6DF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PenguColors.coinGold,
  },
  ledgerCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 12,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  ledgerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  ledgerLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  ledgerValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  modalNote: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginBottom: 14,
  },
});
