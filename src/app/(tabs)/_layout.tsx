import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, PenguColors } from '@/constants/theme';
import { playSound } from '@/utils/sound';

function CustomPenguTabBar({
  state,
}: {
  state: { index: number; routes: { key: string; name: string }[] };
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabItems = [
    {
      routeName: 'index',
      label: 'Home',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
    },
    {
      routeName: 'progress',
      label: 'Progress',
      icon: 'stats-chart-outline' as const,
      activeIcon: 'stats-chart' as const,
    },
    {
      routeName: 'fab',
      label: 'Add',
      icon: 'add' as const,
      activeIcon: 'add' as const,
    },
    {
      routeName: 'social',
      label: 'Social',
      icon: 'people-outline' as const,
      activeIcon: 'people' as const,
    },
    {
      routeName: 'settings',
      label: 'Settings',
      icon: 'settings-outline' as const,
      activeIcon: 'settings' as const,
    },
  ];

  const currentRouteName = state.routes[state.index]?.name ?? 'index';

  return (
    <View
      style={[
        styles.outerDockWrap,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
      pointerEvents="box-none">
      <View
        style={[
          styles.liquidGlassBar,
          Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(22px) saturate(180%)',
                WebkitBackdropFilter: 'blur(22px) saturate(180%)',
              } as any)
            : null,
        ]}>
        {/* Specular Top Liquid Highlight Line */}
        <View style={styles.specularTopSheen} pointerEvents="none" />

        {tabItems.map((item) => {
          if (item.routeName === 'fab') {
            return (
              <View key="fab" style={styles.fabWrapper}>
                <Pressable
                  onPress={() => {
                    playSound('tap', 1.15);
                    router.push('/habits/form' as any);
                  }}
                  style={({ pressed }) => [
                    styles.fabButton,
                    pressed && { transform: [{ scale: 0.92 }] },
                  ]}>
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </Pressable>
              </View>
            );
          }

          const isFocused = currentRouteName === item.routeName;

          const onPress = () => {
            playSound('tap');
            if (isFocused) return;
            router.navigate(
              (item.routeName === 'index'
                ? '/(tabs)'
                : `/(tabs)/${item.routeName}`) as any
            );
          };

          return (
            <Pressable
              key={item.routeName}
              onPress={onPress}
              style={styles.tabItem}>
              <View
                style={[
                  styles.tabPillInner,
                  isFocused && styles.tabPillInnerActive,
                ]}>
                <Ionicons
                  name={isFocused ? item.activeIcon : item.icon}
                  size={22}
                  color={isFocused ? PenguColors.primaryGreen : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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
      <Tabs.Screen name="social" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="focus" />
      <Tabs.Screen name="pingu" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  outerDockWrap: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  liquidGlassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  specularTopSheen: {
    position: 'absolute',
    top: 1,
    left: 20,
    right: 20,
    height: 1.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 2,
  },
  tabPillInnerActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.12)',
  },
  tabLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: PenguColors.primaryGreenDark,
    fontWeight: '800',
  },
  fabWrapper: {
    width: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.select({ ios: -22, default: -18 }),
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PenguColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: 'rgba(255, 255, 255, 0.96)',
    shadowColor: PenguColors.primaryGreenDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
});
