import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ArcticFooter,
  HabitIconBadge,
  PrimaryButton,
  ScreenHeader,
} from '@/components/pengu-ui';
import { Fonts, PenguColors } from '@/constants/theme';
import { Habit, usePenguStore } from '@/store/usePenguStore';

export default function AllHabitsScreen() {
  const router = useRouter();
  const habits = usePenguStore((s) => s.habits);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'Active' | 'Archived'>('Active');

  const filtered = habits.filter((h) => {
    const matchesTab = tab === 'Active' ? !h.archived : h.archived;
    const matchesSearch = h.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatSchedule = (h: Habit) => {
    if (h.repeatDays.length === 7) return 'Daily';
    if (
      h.repeatDays.length === 5 &&
      !h.repeatDays.includes('Sat') &&
      !h.repeatDays.includes('Sun')
    ) {
      return 'Weekdays';
    }
    return h.repeatDays.join(', ');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="All habits" />

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={PenguColors.textSecondary}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search habits..."
            placeholderTextColor={PenguColors.textMuted}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={PenguColors.textMuted}
              />
            </Pressable>
          )}
        </View>

        {/* Active / Archived Tabs */}
        <View style={styles.tabsRow}>
          {(['Active', 'Archived'] as const).map((item) => {
            const active = tab === item;
            return (
              <Pressable
                key={item}
                onPress={() => setTab(item)}
                style={[styles.tabPill, active && styles.tabPillActive]}>
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.countText}>
          {filtered.length} {tab.toLowerCase()}{' '}
          {filtered.length === 1 ? 'habit' : 'habits'}
        </Text>

        {/* Habits List */}
        <View style={styles.list}>
          {filtered.map((habit) => (
            <Pressable
              key={habit.id}
              onPress={() => router.push(`/habits/${habit.id}` as any)}
              style={({ pressed }) => [
                styles.habitCard,
                pressed && { opacity: 0.88 },
              ]}>
              <HabitIconBadge icon={habit.icon} size={62} />
              <View style={styles.habitCol}>
                <Text style={styles.habitTitle}>{habit.name}</Text>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={PenguColors.textSecondary}
                  />
                  <Text style={styles.metaText}>{formatSchedule(habit)}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={{ fontSize: 14 }}>🔥</Text>
                  <Text style={styles.streakText}>
                    {habit.streak}-day streak
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={PenguColors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          label="Add a habit"
          icon="add"
          onPress={() => router.push('/habits/form' as any)}
          style={{ marginTop: 8 }}
        />

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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabPillActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  tabText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  tabTextActive: {
    color: PenguColors.primaryGreen,
  },
  countText: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: '600',
    color: PenguColors.textSecondary,
    marginBottom: 10,
  },
  list: {
    gap: 12,
    marginBottom: 12,
  },
  habitCard: {
    backgroundColor: PenguColors.surfaceMintLight,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
  },
  habitCol: {
    flex: 1,
    gap: 4,
  },
  habitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
  },
  streakText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
});
