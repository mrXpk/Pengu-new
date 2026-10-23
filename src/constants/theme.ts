import { Platform } from 'react-native';

export const PenguColors = {
  background: '#F9FBFA',
  card: '#FFFFFF',
  surfaceMint: '#EAF8EF',
  surfaceMintLight: '#F2FBF5',
  surfaceIce: '#EAF6FF',
  surfaceGold: '#FFF6DF',
  surfacePurple: '#F3F0FF',
  surfaceRed: '#FFF0F0',
  surfaceGray: '#F2F4F7',

  primaryGreen: '#208B46',
  primaryGreenDark: '#186B35',
  primaryGreenLight: '#33A85C',
  mintBorder: '#BCE6CA',
  iceBorder: '#C6E4FF',
  cardBorder: '#E8EEF2',
  goldBorder: '#F7D98C',
  dangerRed: '#D92D20',
  dangerBorder: '#FECDCA',

  navyHeading: '#091E42',
  textPrimary: '#10243E',
  textSecondary: '#4A5B75',
  textMuted: '#7A8B9E',
  white: '#FFFFFF',

  coinGold: '#F5A623',
  starYellow: '#FFB800',
  streakOrange: '#FF7A00',
  partialOrange: '#F59E0B',
  inactiveDot: '#CBD5E1',
};

export const Colors = {
  light: {
    text: PenguColors.navyHeading,
    textSecondary: PenguColors.textSecondary,
    background: PenguColors.background,
    backgroundElement: PenguColors.card,
    backgroundSelected: PenguColors.surfaceMint,
    tint: PenguColors.primaryGreen,
    icon: PenguColors.textSecondary,
    tabIconDefault: '#6E7F96',
    tabIconSelected: PenguColors.primaryGreen,
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0B1528',
    backgroundElement: '#152238',
    backgroundSelected: '#163828',
    tint: '#33A85C',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#33A85C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    rounded: '"Nunito", "Fredoka", "SF Pro Rounded", system-ui, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 80, android: 76 }) ?? 76;
export const MaxContentWidth = 600;
