import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, PenguColors } from '@/constants/theme';

function CustomPenguTabBar({
  state,
  navigateToTab,
}: {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab?: (routeKey: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabItems = [
    { routeName: 'index', label: 'Home', icon: 'home' as const },
    { routeName: 'progress', label: 'Progress', icon: 'stats-chart' as const },
    { routeName: 'fab', label: 'Add', icon: 'add' as const },
    { routeName: 'pingu', label: 'Pingu', icon: 'happy' as const },
    { routeName: 'settings', label: 'Settings', icon: 'settings-sharp' as const },
  ];

  const currentRouteName = state.routes[state.index]?.name ?? 'index';

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}>
      {tabItems.map((item) => {
        if (item.routeName === 'fab') {
          return (
            <View key="fab" style={styles.fabWrapper}>
              <Pressable
                onPress={() => router.push('/habits/form' as any)}
                style={({ pressed }) => [
                  styles.fabButton,
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}>
                <Ionicons name="add" size={34} color="#FFFFFF" />
              </Pressable>
            </View>
          );
        }

        const isFocused = currentRouteName === item.routeName;

        const onPress = () => {
          const route = state.routes.find(
            (r: { key: string; name: string }) => r.name === item.routeName
          );
          if (!route || isFocused) return;
          if (navigateToTab) {
            navigateToTab(route.key);
          } else {
            router.navigate(
              (item.routeName === 'index'
                ? '/(tabs)'
                : `/(tabs)/${item.routeName}`) as any
            );
          }
        };

        return (
          <Pressable
            key={item.routeName}
            onPress={onPress}
            style={styles.tabItem}>
            {item.routeName === 'pingu' ? (
              <View
                style={[
                  styles.pinguIconBubble,
                  isFocused && styles.pinguIconBubbleActive,
                ]}>
                <Text style={{ fontSize: 17 }}>🐧</Text>
              </View>
            ) : (
              <Ionicons
                name={item.icon}
                size={24}
                color={isFocused ? PenguColors.primaryGreen : '#64748B'}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive,
              ]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomPenguTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="pingu" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#E8EEF2',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: PenguColors.primaryGreen,
    fontWeight: '800',
  },
  pinguIconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinguIconBubbleActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderWidth: 1.5,
    borderColor: PenguColors.primaryGreen,
  },
  fabWrapper: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.select({ ios: -28, default: -24 }),
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: PenguColors.primaryGreenDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
