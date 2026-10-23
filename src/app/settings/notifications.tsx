import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MASCOT_IMAGES } from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const notifications = usePenguStore((s) => s.notifications);
  const updateNotifications = usePenguStore((s) => s.updateNotifications);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header with Mascot */}
        <View style={styles.topHeader}>
          <View style={{ flex: 1 }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={PenguColors.navyHeading}
              />
            </Pressable>
            <Text style={styles.pageTitle}>Notifications</Text>
            <Text style={styles.pageSubtitle}>15 Notifications</Text>
          </View>
          <Image
            source={MASCOT_IMAGES.celebrating}
            style={styles.heroMascot}
            contentFit="contain"
          />
        </View>

        {/* Master Toggle Card */}
        <View style={styles.masterCard}>
          <Text style={{ fontSize: 34 }}>🔔</Text>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowTitle}>Notifications</Text>
            <Text style={styles.rowSub}>
              Get notified about your habits, progress and more.
            </Text>
          </View>
          <Switch
            value={notifications.master}
            onValueChange={(v) => updateNotifications({ master: v })}
            trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Reminders</Text>

        <View style={styles.groupCard}>
          <View style={styles.groupRow}>
            <Text style={styles.groupEmoji}>📚</Text>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Habit reminders</Text>
              <Text style={styles.rowSub}>
                Get reminded to complete your habits.
              </Text>
            </View>
            <Switch
              value={notifications.habitReminders}
              onValueChange={(v) =>
                updateNotifications({ habitReminders: v })
              }
              trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.groupRow}>
            <Text style={styles.groupEmoji}>🔥</Text>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Streak updates</Text>
              <Text style={styles.rowSub}>
                Get notified when you keep your streak going.
              </Text>
            </View>
            <Switch
              value={notifications.streakUpdates}
              onValueChange={(v) => updateNotifications({ streakUpdates: v })}
              trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.groupRow}>
            <Text style={styles.groupEmoji}>🏆</Text>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Achievement alerts</Text>
              <Text style={styles.rowSub}>
                Get notified when you reach a new milestone.
              </Text>
            </View>
            <Switch
              value={notifications.achievementAlerts}
              onValueChange={(v) =>
                updateNotifications({ achievementAlerts: v })
              }
              trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.groupRow}>
            <Text style={styles.groupEmoji}>🗓️</Text>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Weekly summary</Text>
              <Text style={styles.rowSub}>
                Get a weekly recap of your progress.
              </Text>
            </View>
            <Switch
              value={notifications.weeklySummary}
              onValueChange={(v) =>
                updateNotifications({ weeklySummary: v })
              }
              trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quiet hours</Text>

        <View style={styles.groupCard}>
          <View style={styles.groupRow}>
            <Text style={styles.groupEmoji}>🌙</Text>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Quiet hours</Text>
              <Text style={styles.rowSub}>
                Pause notifications during this time.
              </Text>
            </View>
            <Switch
              value={notifications.quietHours}
              onValueChange={(v) => updateNotifications({ quietHours: v })}
              trackColor={{ false: '#CBD5E1', true: PenguColors.primaryGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Pressable
            onPress={() =>
              updateNotifications({
                quietHoursRange:
                  notifications.quietHoursRange === '10:00 PM – 7:00 AM'
                    ? '11:00 PM – 8:00 AM'
                    : '10:00 PM – 7:00 AM',
              })
            }
            style={styles.quietRangePill}>
            <Text style={styles.quietRangeText}>
              {notifications.quietHoursRange}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={PenguColors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.tipCard}>
          <Text style={{ fontSize: 22 }}>💡</Text>
          <Text style={styles.tipText}>
            Habit reminders use the times you set for each habit.
          </Text>
        </View>

        <Pressable
          onPress={() => Linking.openSettings()}
          style={styles.deviceSettingsBtn}>
          <Text style={styles.deviceSettingsText}>Open device settings</Text>
          <Ionicons name="open-outline" size={16} color="#2563EB" />
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
    fontSize: 32,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  pageSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  heroMascot: {
    width: 108,
    height: 108,
  },
  masterCard: {
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: PenguColors.primaryGreen,
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    marginBottom: 10,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 18,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  groupEmoji: {
    fontSize: 30,
    width: 38,
    textAlign: 'center',
  },
  rowTextCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  rowSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  quietRangePill: {
    marginTop: 10,
    marginLeft: 50,
    backgroundColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quietRangeText: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  tipCard: {
    backgroundColor: PenguColors.surfaceIce,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.iceBorder,
  },
  tipText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.navyHeading,
  },
  deviceSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
  },
  deviceSettingsText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
