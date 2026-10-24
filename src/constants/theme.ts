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

/**
 * Authentic Emperor Penguin Plumage Dark Theme ("Penguin Obsidian")
 * Deep velvet-navy/obsidian feather coat, pearlescent tuxedo-belly highlights,
 * warm emperor-beak amber gold, and glacier-ice cyan accents.
 */
export const PenguinObsidianTheme = {
  background: '#09111E',
  backgroundElevated: '#0F1B2E',
  card: '#132238',
  cardSelected: '#15342B',
  featherTextureOverlay: 'rgba(56, 189, 248, 0.04)',
  bellyHighlightBorder: 'rgba(226, 232, 240, 0.13)',
  mintBorder: '#227A4D',
  beakGold: '#F59E0B',
  beakOrange: '#FB923C',
  glacierCyan: '#38BDF8',
  auroraEmerald: '#10B981',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
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
    text: PenguinObsidianTheme.textPrimary,
    textSecondary: PenguinObsidianTheme.textSecondary,
    background: PenguinObsidianTheme.background,
    backgroundElement: PenguinObsidianTheme.card,
    backgroundSelected: PenguinObsidianTheme.cardSelected,
    tint: PenguinObsidianTheme.auroraEmerald,
    icon: PenguinObsidianTheme.textSecondary,
    tabIconDefault: '#64748B',
    tabIconSelected: PenguinObsidianTheme.auroraEmerald,
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
