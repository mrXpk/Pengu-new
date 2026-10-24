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

import { MASCOT_IMAGES, SecondaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function AccountAndDataScreen() {
  const router = useRouter();
  const userName = usePenguStore((s) => s.userName);
  const habits = usePenguStore((s) => s.habits);
  const coins = usePenguStore((s) => s.coins);
  const resetToDemo = usePenguStore((s) => s.resetToDemo);
  const resetToEmptyFreshStart = usePenguStore(
    (s) => s.resetToEmptyFreshStart
  );

  const handleExport = () => {
    Alert.alert(
      'Local Data Summary',
      `User: ${userName}\nActive Habits: ${habits.length}\nCoins: ${coins}\nStorage: Local-first (AsyncStorage)`
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to demo data?',
      'This will restore the default habits, 520 coins, and Level 3 progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset data',
          style: 'destructive',
          onPress: () => {
            resetToDemo();
            Alert.alert('Restored', 'Default demo state has been restored!');
          },
        },
      ]
    );
  };

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
            <Text style={styles.pageTitle}>Account{'\n'}& data</Text>
          </View>
          <Image
            source={MASCOT_IMAGES.encouraging}
            style={styles.heroMascot}
            contentFit="contain"
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable
          onPress={() => router.push('/settings/profile' as any)}
          style={styles.accountCard}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 28 }}>🧑</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.accountName}>{userName}</Text>
            <Text style={styles.accountSub}>Signed in (Local profile)</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={PenguColors.textSecondary}
          />
        </Pressable>

        <Text style={styles.sectionTitle}>Backup</Text>
        <View style={styles.backupCard}>
          <View style={styles.backupRow}>
            <Text style={{ fontSize: 42 }}>☁️</Text>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.backupTitle}>Cloud backup not enabled</Text>
              <Text style={styles.backupSub}>
                Your habits are stored on this device.
              </Text>
            </View>
          </View>
          <SecondaryButton
            label="Set up backup"
            variant="mint"
            onPress={() =>
              Alert.alert(
                'Local-First Mode',
                'All habits, check-ins, and Pingu rewards are automatically saved on your device.'
              )
            }
            style={{ marginTop: 14 }}
          />
        </View>

        <View style={styles.actionsGroup}>
          <Pressable onPress={handleExport} style={styles.actionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="document-text" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.actionLabel}>Export my data</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable onPress={handleReset} style={styles.actionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF1F0' }]}>
              <Ionicons name="refresh" size={20} color="#E11D48" />
            </View>
            <Text style={styles.actionLabel}>Reset demo data</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            onPress={() => {
              resetToEmptyFreshStart();
              router.replace('/(tabs)' as any);
            }}
            style={styles.actionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons
                name="sparkles"
                size={20}
                color={PenguColors.primaryGreen}
              />
            </View>
            <Text style={styles.actionLabel}>
              Start fresh (Empty Home state)
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={PenguColors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Danger Zone Card */}
        <Pressable onPress={handleReset} style={styles.deleteCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons
              name="trash-outline"
              size={22}
              color={PenguColors.dangerRed}
            />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.deleteTitle}>Delete account</Text>
            <Text style={styles.deleteSub}>
              You will review this before anything is deleted.
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={PenguColors.dangerRed}
          />
        </Pressable>
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
    fontSize: 34,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    lineHeight: 38,
  },
  heroMascot: {
    width: 112,
    height: 112,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
    marginTop: 6,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontFamily: Fonts?.rounded,
    fontSize: 19,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  accountSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  backupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  backupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backupTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 18,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  backupSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  actionsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  deleteCard: {
    backgroundColor: PenguColors.surfaceRed,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: PenguColors.dangerBorder,
  },
  deleteTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: PenguColors.dangerRed,
  },
  deleteSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    lineHeight: 18,
  },
});
