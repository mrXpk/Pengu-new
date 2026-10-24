import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function MilestoneRewardScreen() {
  const router = useRouter();
  const unlockAndEquipMilestone = usePenguStore(
    (s) => s.unlockAndEquipMilestone
  );

  const handleEquipNow = () => {
    unlockAndEquipMilestone('winter-hat');
    router.replace('/(tabs)/pingu' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Milestone Badge */}
        <View style={styles.milestonePill}>
          <Text style={styles.milestoneSparkle}>✨</Text>
          <Text style={styles.milestonePillText}>Milestone reward</Text>
        </View>

        <Text style={styles.title}>A new look{'\n'}for Pingu!</Text>

        {/* Reward Stage */}
        <View style={styles.stageCard}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.stageBg}
            contentFit="cover"
          />
          <View style={styles.hatFloatBadge}>
            <Text style={{ fontSize: 40 }}>🧢</Text>
          </View>
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.mascotImg}
            contentFit="contain"
          />
        </View>

        {/* Item Info Card */}
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Winter hat</Text>
          <Text style={styles.itemSub}>Unlocked with your 25th check-in.</Text>
        </View>

        <PrimaryButton
          label="Equip now"
          trailingArrow
          onPress={handleEquipNow}
          style={{ width: '100%', marginTop: 18 }}
        />

        <SecondaryButton
          label="Maybe later"
          onPress={() => router.back()}
          style={{ width: '100%', marginTop: 12 }}
        />
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
    paddingTop: 22,
    paddingBottom: 32,
    alignItems: 'center',
  },
  milestonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF6DF',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  milestoneSparkle: {
    fontSize: 16,
  },
  milestonePillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 18,
  },
  stageCard: {
    width: '100%',
    height: 265,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  stageBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.55,
  },
  hatFloatBadge: {
    position: 'absolute',
    top: 16,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    zIndex: 5,
  },
  mascotImg: {
    width: 235,
    height: 235,
  },
  itemCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  itemTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 25,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  itemSub: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.textSecondary,
    marginTop: 4,
  },
});
