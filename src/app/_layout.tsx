import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CelebrationModal } from '@/components/celebration-modal';
import { PenguColors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: PenguColors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="habits/all" />
        <Stack.Screen
          name="habits/form"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="habits/[id]" />
        <Stack.Screen
          name="habits/celebration"
          options={{ presentation: 'modal', animation: 'fade' }}
        />
        <Stack.Screen
          name="checkin/mood"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="progress/calendar" />
        <Stack.Screen name="progress/achievements" />
        <Stack.Screen name="shop/index" />
        <Stack.Screen
          name="shop/[itemId]"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="settings/profile" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/appearance" />
        <Stack.Screen name="settings/membership" />
        <Stack.Screen name="settings/account" />
        <Stack.Screen name="settings/help" />
      </Stack>
      <CelebrationModal />
    </SafeAreaProvider>
  );
}
