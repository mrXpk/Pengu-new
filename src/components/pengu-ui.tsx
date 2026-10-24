import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Fonts, PenguColors } from '@/constants/theme';
import { HabitIconType, usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export const MASCOT_IMAGES = {
  waving: require('@/assets/mascot/waving.png'),
  celebrating: require('@/assets/mascot/celebrating.png'),
  checklist: require('@/assets/mascot/checklist.png'),
  encouraging: require('@/assets/mascot/encouraging.png'),
  sleeping: require('@/assets/mascot/sleeping.png'),
  writing: require('@/assets/mascot/writing.png'),
  arctic: require('@/assets/mascot/arctic.png'),
  icon: require('@/assets/mascot/icon.png'),
  wordmark: require('@/assets/mascot/wordmark.png'),
};

export function CoinBadge({ onPress }: { onPress?: () => void }) {
  const coins = usePenguStore((s) => s.coins);
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.push('/shop' as any))}
      style={({ pressed }) => [
        styles.coinPill,
        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
      ]}>
      <View style={styles.coinCircle}>
        <Ionicons name="star" size={13} color="#FFF8E1" />
      </View>
      <Text style={styles.coinText}>{coins}</Text>
    </Pressable>
  );
}

export function CircularProgressRing({
  completed,
  total,
  size = 112,
  strokeWidth = 11,
}: {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, percentage)) / 100;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#DCE9E2"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={PenguColors.primaryGreen}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.ringCenter}>
          <Text style={styles.ringFraction}>
            {completed}/{total}
          </Text>
          <Text style={styles.ringPercent}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
}

const ICON_CONFIG: Record<
  HabitIconType,
  { emoji: string; bg: string; border: string }
> = {
  books: { emoji: '📚', bg: '#E3F5EB', border: '#C5E8D5' },
  water: { emoji: '🥛', bg: '#E0F2FE', border: '#BAE6FD' },
  dumbbell: { emoji: '🏋️', bg: '#FFF1F0', border: '#FECACA' },
  book: { emoji: '📖', bg: '#EEF2FF', border: '#C7D2FE' },
  shoe: { emoji: '👟', bg: '#FFE4E6', border: '#FECDD3' },
  moon: { emoji: '🌙', bg: '#F3E8FF', border: '#DDD6FE' },
  heart: { emoji: '❤️', bg: '#FFE4E6', border: '#FECDD3' },
  bulb: { emoji: '💡', bg: '#FEF9C3', border: '#FDE047' },
  calendar: { emoji: '📅', bg: '#E0F2FE', border: '#BAE6FD' },
};

export function HabitIconBadge({
  icon,
  size = 54,
}: {
  icon: HabitIconType;
  size?: number;
}) {
  const cfg = ICON_CONFIG[icon] ?? ICON_CONFIG.books;
  return (
    <View
      style={[
        styles.habitIconBox,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
        },
      ]}>
      <Text style={{ fontSize: Math.round(size * 0.5) }}>{cfg.emoji}</Text>
    </View>
  );
}

export function ScreenHeader({
  title,
  onBack,
  rightElement,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerTopRow}>
        <Pressable
          onPress={onBack ?? (() => router.back())}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 },
          ]}>
          <Ionicons name="arrow-back" size={24} color={PenguColors.navyHeading} />
        </Pressable>
        {rightElement ? <View>{rightElement}</View> : <View style={{ width: 40 }} />}
      </View>
      <Text style={styles.headerLargeTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  trailingArrow = false,
  style,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  trailingArrow?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        playSound('tap');
        onPress();
      }}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && { opacity: 0.5 },
        pressed &&
          !disabled && {
            transform: [{ translateY: 3 }],
            borderBottomWidth: 2,
          },
        style,
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={styles.primaryButtonText}>{label}</Text>
      {trailingArrow && (
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#FFFFFF"
          style={{ marginLeft: 8 }}
        />
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  variant = 'outline',
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'outline' | 'mint';
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={() => {
        playSound('tap', 0.95);
        onPress();
      }}
      style={({ pressed }) => [
        styles.secondaryButton,
        variant === 'mint' && styles.secondaryButtonMint,
        pressed && {
          transform: [{ translateY: 2 }],
          borderBottomWidth: 1.5,
        },
        style,
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={
            variant === 'mint'
              ? PenguColors.primaryGreen
              : PenguColors.navyHeading
          }
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        style={[
          styles.secondaryButtonText,
          variant === 'mint' && { color: PenguColors.navyHeading },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ArcticFooter({
  mascot = 'celebrating',
  height = 120,
}: {
  mascot?: keyof typeof MASCOT_IMAGES;
  height?: number;
}) {
  return (
    <View style={[styles.arcticFooter, { height }]}>
      <Image
        source={MASCOT_IMAGES.arctic}
        style={styles.arcticBg}
        contentFit="cover"
      />
      <Image
        source={MASCOT_IMAGES[mascot]}
        style={{ width: height * 0.95, height: height * 0.95 }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PenguColors.surfaceGold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PenguColors.goldBorder,
    gap: 6,
  },
  coinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PenguColors.coinGold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD572',
  },
  coinText: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  ringCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringFraction: {
    fontFamily: Fonts?.rounded,
    fontSize: 22,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  ringPercent: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: PenguColors.textSecondary,
    marginTop: 1,
  },
  habitIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerWrap: {
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  headerLargeTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 32,
    fontWeight: '900',
    color: PenguColors.navyHeading,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: PenguColors.textSecondary,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: PenguColors.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderBottomWidth: 5,
    borderBottomColor: PenguColors.primaryGreenDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PenguColors.primaryGreenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: PenguColors.cardBorder,
    borderBottomColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonMint: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  secondaryButtonText: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  arcticFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 24,
    marginTop: 12,
  },
  arcticBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
});
