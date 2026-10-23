import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArcticFooter, ScreenHeader } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { SHOP_CATALOG, usePenguStore } from '@/store/usePenguStore';

export default function AchievementsScreen() {
  const habits = usePenguStore((s) => s.habits);
  const ownedItemIds = usePenguStore((s) => s.ownedItemIds);

  const totalCheckIns = Math.max(
    24,
    habits.reduce((sum, h) => sum + h.totalCompletions, 0)
  );
  const ownedOutfits = SHOP_CATALOG.filter(
    (i) => i.category === 'Outfits' && ownedItemIds.includes(i.id)
  ).length;

  const badges = [
    {
      id: 'first-step',
      title: 'First step',
      emoji: '🌱',
      unlocked: true,
    },
    {
      id: '10-checkins',
      title: '10 check-ins',
      emoji: '🗓️',
      unlocked: true,
    },
    {
      id: 'steady-learner',
      title: 'Steady learner',
      emoji: '📚',
      unlocked: true,
    },
    {
      id: '25-checkins',
      title: '25 check-ins',
      emoji: '🏔️',
      unlocked: totalCheckIns >= 25,
      progress: Math.min(25, 24),
      target: 25,
      progressLabel: '24 / 25',
    },
    {
      id: 'seven-day-rhythm',
      title: 'Seven-day rhythm',
      emoji: '⭐',
      unlocked: false,
      progress: 5,
      target: 7,
      progressLabel: '5 / 7',
    },
    {
      id: 'cozy-collector',
      title: 'Cozy collector',
      emoji: '🧥',
      unlocked: ownedOutfits >= 3,
      progress: Math.min(3, ownedOutfits),
      target: 3,
      progressLabel: `${ownedOutfits} / 3 outfits`,
    },
  ];

  const earnedCount = badges.filter((b) => b.unlocked).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Your achievements"
          subtitle="Small efforts worth celebrating."
        />

        <Text style={styles.counterText}>
          {earnedCount} earned • {badges.length} to discover
        </Text>

        <View style={styles.grid}>
          {badges.map((b) => {
            const pct =
              b.progress && b.target
                ? Math.round((b.progress / b.target) * 100)
                : 0;
            return (
              <View
                key={b.id}
                style={[
                  styles.badgeCard,
                  b.unlocked && styles.badgeCardUnlocked,
                ]}>
                <View
                  style={[
                    styles.statusCorner,
                    b.unlocked
                      ? styles.statusCornerUnlocked
                      : styles.statusCornerLocked,
                  ]}>
                  <Ionicons
                    name={b.unlocked ? 'checkmark' : 'lock-closed'}
                    size={16}
                    color={b.unlocked ? '#FFFFFF' : '#475569'}
                  />
                </View>

                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                <Text style={styles.badgeTitle}>{b.title}</Text>

                {!b.unlocked && b.progressLabel && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[styles.progressFill, { width: `${pct}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{b.progressLabel}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

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
  counterText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    minHeight: 175,
    gap: 8,
  },
  badgeCardUnlocked: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  statusCorner: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCornerUnlocked: {
    backgroundColor: PenguColors.primaryGreen,
  },
  statusCornerLocked: {
    backgroundColor: '#E2E8F0',
  },
  badgeEmoji: {
    fontSize: 54,
    marginTop: 6,
  },
  badgeTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
    gap: 4,
    marginTop: 2,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: PenguColors.primaryGreen,
  },
  progressText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600',
    color: PenguColors.textSecondary,
    textAlign: 'center',
  },
});
