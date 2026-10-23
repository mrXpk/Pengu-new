import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MASCOT_IMAGES,
  PrimaryButton,
  SecondaryButton,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function ProfileScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const companionName = usePenguStore((s) => s.companionName);
  const mainGoal = usePenguStore((s) => s.mainGoal);
  const memberSince = usePenguStore((s) => s.memberSince);
  const level = usePenguStore((s) => s.level);
  const isPremium = usePenguStore((s) => s.isPremium);
  const updateProfile = usePenguStore((s) => s.updateProfile);

  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(userName);
  const [draftCompanion, setDraftCompanion] = useState(companionName);
  const [draftGoal, setDraftGoal] = useState(mainGoal);

  const handleSave = () => {
    updateProfile({
      userName: draftName.trim() || 'Pratap Mukhiya',
      companionName: draftCompanion.trim() || 'Cozy Pingu',
      mainGoal: draftGoal.trim() || 'Study consistently',
    });
    setEditOpen(false);
  };

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

        <Text style={styles.pageTitle}>Your profile</Text>

        {/* Hero Avatar Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={MASCOT_IMAGES.arctic}
            style={styles.bannerBg}
            contentFit="cover"
          />
          <View style={styles.avatarRing}>
            <Image
              source={MASCOT_IMAGES.celebrating}
              style={styles.avatarMascot}
              contentFit="contain"
            />
          </View>
        </View>

        <Text style={styles.userName}>{userName}</Text>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={{ fontSize: 15 }}>👑</Text>
            <Text style={styles.premiumText}>Premium member</Text>
          </View>
        )}

        {/* 3 Stat Tiles */}
        <View style={styles.statsGrid}>
          <View style={[styles.statTile, { backgroundColor: '#EAF8EF' }]}>
            <Text style={{ fontSize: 34 }}>🗓️</Text>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statSub}>check-ins</Text>
          </View>
          <View style={[styles.statTile, { backgroundColor: '#F3F6FF' }]}>
            <Text style={{ fontSize: 34 }}>⭐</Text>
            <Text style={styles.statNumber}>Level {level}</Text>
          </View>
          <View style={[styles.statTile, { backgroundColor: '#FFF9EB' }]}>
            <Text style={{ fontSize: 34 }}>🏅</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statSub}>badges</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoList}>
          <Pressable
            onPress={() => setEditOpen(true)}
            style={[styles.infoCard, { backgroundColor: '#EAF8EF' }]}>
            <Text style={{ fontSize: 34 }}>📚</Text>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>My main goal</Text>
              <Text style={styles.infoValue}>{mainGoal}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/pingu' as any)}
            style={styles.infoCard}>
            <Image
              source={MASCOT_IMAGES.celebrating}
              style={{ width: 46, height: 46 }}
              contentFit="contain"
            />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>My companion</Text>
              <Text style={styles.infoValue}>{companionName}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <View style={styles.infoCard}>
            <Text style={{ fontSize: 34 }}>📅</Text>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Member since</Text>
              <Text style={styles.infoValue}>{memberSince}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </View>
        </View>

        <PrimaryButton
          label="Edit profile"
          icon="pencil"
          onPress={() => setEditOpen(true)}
          style={{ marginTop: 14 }}
        />

        <SecondaryButton
          label="View achievements"
          icon="trophy"
          variant="mint"
          onPress={() => router.push('/progress/achievements' as any)}
          style={{ marginTop: 10 }}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Edit profile</Text>

            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Companion Name</Text>
            <TextInput
              value={draftCompanion}
              onChangeText={setDraftCompanion}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Main Goal</Text>
            <TextInput
              value={draftGoal}
              onChangeText={setDraftGoal}
              style={styles.input}
            />

            <PrimaryButton
              label="Save changes"
              onPress={handleSave}
              style={{ marginTop: 8 }}
            />
            <SecondaryButton
              label="Cancel"
              onPress={() => setEditOpen(false)}
              style={{ marginTop: 10 }}
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
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroBanner: {
    height: 175,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#DDF2FF',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarMascot: {
    width: 135,
    height: 135,
  },
  userName: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    textAlign: 'center',
    marginTop: 8,
  },
  premiumBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF6DF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PenguColors.goldBorder,
    marginTop: 8,
    marginBottom: 16,
  },
  premiumText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statTile: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  statNumber: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginTop: 2,
  },
  statSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
  },
  infoList: {
    gap: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  infoValue: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 30, 66, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 24,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.navyHeading,
    marginBottom: 12,
  },
});
