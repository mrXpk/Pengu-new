import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ArcticFooter,
  MASCOT_IMAGES,
  PrimaryButton,
  ScreenHeader,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function AppearanceSettingsScreen() {
  const router = useRouter();
  const themeMode = usePenguStore((s) => s.themeMode);
  const reduceMotion = usePenguStore((s) => s.reduceMotion);
  const celebrationAnimations = usePenguStore((s) => s.celebrationAnimations);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);
  const ownedItemIds = usePenguStore((s) => s.ownedItemIds);
  const updateAppearance = usePenguStore((s) => s.updateAppearance);

  const [selectedTheme, setSelectedTheme] = useState(themeMode);
  const [selectedScenery, setSelectedScenery] = useState(equippedSceneryId);
  const [motionOff, setMotionOff] = useState(reduceMotion);
  const [celebrationsOn, setCelebrationsOn] = useState(celebrationAnimations);

  const handleSave = () => {
    updateAppearance({
      themeMode: selectedTheme,
      equippedSceneryId: selectedScenery,
      reduceMotion: motionOff,
      celebrationAnimations: celebrationsOn,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Appearance" />

        {/* Theme Section */}
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeRow}>
          {(
            [
              { id: 'light', label: 'Light', emoji: '☀️' },
              { id: 'dark', label: 'Dark', emoji: '🌙' },
              { id: 'system', label: 'System', emoji: '🖥️' },
            ] as const
          ).map((t) => {
            const active = selectedTheme === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setSelectedTheme(t.id)}
                style={[styles.themeCard, active && styles.themeCardActive]}>
                {active && (
                  <View style={styles.cornerCheck}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
                <Text style={{ fontSize: 38 }}>{t.emoji}</Text>
                <Text style={styles.themeLabel}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Habitat Scenery */}
        <Text style={styles.sectionTitle}>Habitat scenery</Text>
        <View style={styles.sceneryRow}>
          <Pressable
            onPress={() => setSelectedScenery('arctic-blue')}
            style={[
              styles.sceneryCard,
              selectedScenery === 'arctic-blue' && styles.sceneryCardActive,
            ]}>
            <View style={styles.sceneryThumb}>
              <Image
                source={MASCOT_IMAGES.arctic}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              {selectedScenery === 'arctic-blue' && (
                <View style={styles.cornerCheck}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={styles.sceneryTitle}>Arctic Blue</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSelectedScenery('penguin-obsidian');
              setSelectedTheme('dark');
            }}
            style={[
              styles.sceneryCard,
              selectedScenery === 'penguin-obsidian' &&
                styles.sceneryCardActive,
            ]}>
            <View
              style={[
                styles.sceneryThumb,
                {
                  backgroundColor: '#09111E',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={{ fontSize: 44 }}>🐧🌌</Text>
              {selectedScenery === 'penguin-obsidian' && (
                <View style={styles.cornerCheck}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={styles.sceneryTitle}>Penguin Obsidian</Text>
          </Pressable>
        </View>

        {/* Motion & Celebration Toggles */}
        <View style={styles.toggleCard}>
          <Text style={{ fontSize: 28 }}>🏃</Text>
          <View style={styles.toggleCol}>
            <Text style={styles.toggleTitle}>Reduce motion</Text>
            <Text style={styles.toggleSub}>
              Minimize animations throughout the app.
            </Text>
          </View>
          <Switch
            value={motionOff}
            onValueChange={setMotionOff}
            trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.toggleCard}>
          <Text style={{ fontSize: 28 }}>🎉</Text>
          <View style={styles.toggleCol}>
            <Text style={styles.toggleTitle}>Celebration animations</Text>
            <Text style={styles.toggleSub}>
              Show fun animations when you complete tasks and reach milestones.
            </Text>
          </View>
          <Switch
            value={celebrationsOn}
            onValueChange={setCelebrationsOn}
            trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        <ArcticFooter mascot="celebrating" height={110} />

        <PrimaryButton
          label="Save appearance"
          onPress={handleSave}
          style={{ marginTop: 10 }}
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
    marginTop: 6,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  themeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  themeCardActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  cornerCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  themeLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  sceneryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sceneryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    paddingBottom: 14,
  },
  sceneryCardActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  sceneryThumb: {
    width: '100%',
    height: 112,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  sceneryTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  unlockShopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 6,
  },
  unlockShopText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 10,
  },
  toggleCol: {
    flex: 1,
    gap: 3,
  },
  toggleTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  toggleSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    lineHeight: 18,
  },
});
