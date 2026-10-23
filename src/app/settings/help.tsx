import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MASCOT_IMAGES, PrimaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';

const HELP_TOPICS = [
  {
    emoji: '🌱',
    title: 'Creating your first habit',
    answer:
      'Tap the green + button in the bottom bar to create a small, manageable daily action with a cue and reminder time.',
  },
  {
    emoji: '🔥',
    title: 'How streaks work',
    answer:
      'Complete a habit on its scheduled days to grow your streak! Rest days do not break your streak.',
  },
  {
    emoji: '🪙',
    title: 'Earning coins and XP',
    answer:
      'Each scheduled check-in rewards +10 XP and +5 coins. Every 100 XP levels up Pingu!',
  },
  {
    emoji: '⚙️',
    title: 'Managing your subscription',
    answer:
      'You can view or restore your Penguin Task Premium membership anytime under Settings → Membership.',
  },
];

export default function HelpAndAboutScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = HELP_TOPICS.filter((t) =>
    t.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View style={{ flex: 1 }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={PenguColors.navyHeading}
              />
            </Pressable>
            <Text style={styles.pageTitle}>Help & about</Text>
          </View>
          <Image
            source={MASCOT_IMAGES.encouraging}
            style={styles.heroMascot}
            contentFit="contain"
          />
        </View>

        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={PenguColors.textSecondary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search help"
            placeholderTextColor={PenguColors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.topicsList}>
          {filtered.map((topic) => (
            <Pressable
              key={topic.title}
              onPress={() => Alert.alert(topic.title, topic.answer)}
              style={styles.topicCard}>
              <View style={styles.topicIconBox}>
                <Text style={{ fontSize: 24 }}>{topic.emoji}</Text>
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={PenguColors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          label="Contact support"
          icon="headset"
          onPress={() =>
            Alert.alert(
              'Contact Support',
              'Need a hand? Reach us anytime at support@pengutask.app'
            )
          }
          style={{ marginTop: 14 }}
        />

        {/* App Info Card */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutAvatar}>
            <Image
              source={MASCOT_IMAGES.celebrating}
              style={{ width: 64, height: 64 }}
              contentFit="contain"
            />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.aboutTitle}>Penguin Task</Text>
            <Text style={styles.aboutSub}>Small steps. Big dreams.</Text>
            <Text style={styles.aboutVersion}>Version 1.0</Text>
          </View>
        </View>

        <View style={styles.legalRow}>
          <Text style={styles.legalLink}>Privacy policy</Text>
          <Text style={styles.legalDivider}>|</Text>
          <Text style={styles.legalLink}>Terms of service</Text>
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
    paddingBottom: 32,
  },
  topHeader: {
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
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 32,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  heroMascot: {
    width: 108,
    height: 108,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.navyHeading,
    padding: 0,
  },
  topicsList: {
    gap: 10,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  topicIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: PenguColors.surfaceMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  aboutCard: {
    backgroundColor: PenguColors.surfaceMintLight,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginTop: 18,
  },
  aboutAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#DDF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  aboutTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  aboutSub: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.navyHeading,
  },
  aboutVersion: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 22,
  },
  legalLink: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  legalDivider: {
    color: '#CBD5E1',
  },
});
