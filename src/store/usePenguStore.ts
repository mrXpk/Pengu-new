import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type HabitIconType =
  | 'books'
  | 'water'
  | 'dumbbell'
  | 'book'
  | 'shoe'
  | 'moon'
  | 'heart'
  | 'bulb'
  | 'calendar';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: HabitIconType;
  habitType?: 'build' | 'break';
  cleanHours?: number;
  minimumAction: string;
  repeatDays: DayOfWeek[];
  cue: string;
  reminderTime: string;
  reminderEnabled: boolean;
  notes: string;
  archived: boolean;
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  recent7Days: boolean[]; // Mon..Sun
}

export type MoodType = 'Great' | 'Good' | 'Okay' | 'Tired' | 'Sad';

export interface MoodCheckIn {
  date: string;
  mood: MoodType;
  reflection: string;
}

export type ShopCategory = 'Outfits' | 'Accessories' | 'Scenery';

export interface ShopItem {
  id: string;
  name: string;
  subtitle: string;
  category: ShopCategory;
  cost: number;
  emoji: string;
  accentColor: string;
  badgeText?: string;
}

export interface NotificationSettings {
  master: boolean;
  habitReminders: boolean;
  streakUpdates: boolean;
  achievementAlerts: boolean;
  weeklySummary: boolean;
  quietHours: boolean;
  quietHoursRange: string;
}

export interface OnboardingPlan {
  userName: string;
  goals: string[];
  priorityGoal: string;
  progressVision: string;
  routineStatus: string;
  biggestChallenge: string;
  slippingMoment: string;
  dailyMinutes: string;
  timeOfDay: string;
  reminderCue: string;
  firstHabitName: string;
  badHabitToBreak?: string;
  habitMode?: 'build' | 'break' | 'both';
  repeatDays: DayOfWeek[];
  supportPrefs: string[];
  buddyName: string;
  themePreference?: 'light' | 'dark';
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  companionName: string;
  avatarEmoji: string;
  outfitEmoji: string;
  actionText: string;
  habitName: string;
  streakDays: number;
  timeAgo: string;
  cheersCount: number;
  cheeredByMe: boolean;
}

export interface CoopHabit {
  id: string;
  title: string;
  partnerName: string;
  partnerAvatar: string;
  sharedStreak: number;
  myCompletedToday: boolean;
  partnerCompletedToday: boolean;
  nudgedToday: boolean;
  rewardCoins: number;
}

export interface ReferredFriend {
  id: string;
  name: string;
  avatar: string;
  joinedAgo: string;
  streak: number;
}

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'cozy-scarf',
    name: 'Cozy scarf',
    subtitle: 'A warm knit scarf for chilly arctic mornings.',
    category: 'Outfits',
    cost: 120,
    emoji: '🧣',
    accentColor: '#FF6B6B',
  },
  {
    id: 'explorer-backpack',
    name: 'Explorer backpack',
    subtitle: 'An outfit for your next small adventure.',
    category: 'Outfits',
    cost: 250,
    emoji: '🎒',
    accentColor: '#F97316',
  },
  {
    id: 'winter-hat',
    name: 'Winter hat',
    subtitle: 'Soft snowflake beanie for snowy study sessions.',
    category: 'Outfits',
    cost: 150,
    emoji: '🧶',
    accentColor: '#3B82F6',
  },
  {
    id: 'star-crown',
    name: 'Emperor crown',
    subtitle: 'Royal gold crown for master habit builders.',
    category: 'Outfits',
    cost: 400,
    emoji: '👑',
    accentColor: '#F59E0B',
  },
  {
    id: 'royal-tuxedo',
    name: 'Obsidian bowtie',
    subtitle: 'Sleek velvet penguin tuxedo bowtie.',
    category: 'Outfits',
    cost: 320,
    emoji: '🎩',
    accentColor: '#1E293B',
  },
  {
    id: 'blue-backpack',
    name: 'Glacier pack',
    subtitle: 'Icy blue daypack for daily check-ins.',
    category: 'Accessories',
    cost: 250,
    emoji: '🎒',
    accentColor: '#2563EB',
  },
  {
    id: 'cool-glasses',
    name: 'Snow goggles',
    subtitle: 'Keep the arctic glare away in style.',
    category: 'Accessories',
    cost: 180,
    emoji: '🕶️',
    accentColor: '#475569',
  },
  {
    id: 'study-lantern',
    name: 'Focus lantern',
    subtitle: 'Warm amber glow for deep ADHD focus timers.',
    category: 'Accessories',
    cost: 220,
    emoji: '🏮',
    accentColor: '#F59E0B',
  },
  {
    id: 'arctic-blue',
    name: 'Arctic Iceberg',
    subtitle: 'Crisp sunlit glacier overlooking crystal waters.',
    category: 'Scenery',
    cost: 0,
    emoji: '🏔️',
    accentColor: '#38BDF8',
  },
  {
    id: 'penguin-obsidian',
    name: 'Penguin Obsidian',
    subtitle: 'Velvet emperor-penguin plumage & midnight aurora.',
    category: 'Scenery',
    cost: 0,
    emoji: '🐧',
    accentColor: '#0F172A',
  },
];

export const getTodayKey = (): string => {
  return '2026-10-16';
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Review one page of notes',
    category: 'Study',
    icon: 'books',
    habitType: 'build',
    minimumAction: 'One page',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    cue: 'After school or work',
    reminderTime: '9:00 AM',
    reminderEnabled: true,
    notes: 'Focus on key concepts from class.',
    archived: false,
    streak: 8,
    bestStreak: 12,
    totalCompletions: 24,
    recent7Days: [true, true, false, true, true, false, true],
  },
  {
    id: 'habit-2',
    name: 'Drink a glass of water',
    category: 'Water',
    icon: 'water',
    habitType: 'build',
    minimumAction: '1 glass (250ml)',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cue: 'Midday refresh',
    reminderTime: '12:00 PM',
    reminderEnabled: true,
    notes: 'Keep a water bottle on the desk.',
    archived: false,
    streak: 4,
    bestStreak: 9,
    totalCompletions: 19,
    recent7Days: [true, true, true, false, true, true, false],
  },
  {
    id: 'habit-3',
    name: 'Move for 5 minutes',
    category: 'Movement',
    icon: 'dumbbell',
    habitType: 'build',
    minimumAction: '5 minutes stretch or walk',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cue: 'After afternoon study',
    reminderTime: '6:00 PM',
    reminderEnabled: true,
    notes: 'Light stretching or a quick walk.',
    archived: false,
    streak: 3,
    bestStreak: 7,
    totalCompletions: 15,
    recent7Days: [true, false, true, true, false, true, false],
  },
  {
    id: 'habit-4',
    name: 'Read one page',
    category: 'Reading',
    icon: 'book',
    habitType: 'build',
    minimumAction: 'One page before sleep',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cue: 'Before bed',
    reminderTime: '9:00 PM',
    reminderEnabled: true,
    notes: 'Wind down without screens.',
    archived: false,
    streak: 2,
    bestStreak: 6,
    totalCompletions: 14,
    recent7Days: [true, true, true, true, true, false, false],
  },
  {
    id: 'habit-break-1',
    name: 'No doomscrolling in bed',
    category: 'Focus',
    icon: 'moon',
    habitType: 'break',
    cleanHours: 38,
    minimumAction: 'Put phone on desk 30m before sleep',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cue: 'When getting into bed',
    reminderTime: '10:00 PM',
    reminderEnabled: true,
    notes: 'Replace phone scrolling with 1 page of reading.',
    archived: false,
    streak: 5,
    bestStreak: 9,
    totalCompletions: 16,
    recent7Days: [true, true, true, true, true, false, false],
  },
  {
    id: 'habit-break-2',
    name: 'No sugary soda during study',
    category: 'Wellbeing',
    icon: 'heart',
    habitType: 'break',
    cleanHours: 64,
    minimumAction: 'Swap with sparkling water or tea',
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cue: 'Afternoon study block',
    reminderTime: '3:00 PM',
    reminderEnabled: true,
    notes: 'Keep cold water ready on desk.',
    archived: false,
    streak: 7,
    bestStreak: 11,
    totalCompletions: 21,
    recent7Days: [true, true, true, true, true, true, false],
  },
];

const INITIAL_HISTORY: Record<string, string[]> = {
  '2026-10-01': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-02': ['habit-1', 'habit-2'],
  '2026-10-03': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-05': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-06': ['habit-1', 'habit-4'],
  '2026-10-07': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-08': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-09': ['habit-2', 'habit-3'],
  '2026-10-10': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-12': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-13': ['habit-1', 'habit-2', 'habit-4'],
  '2026-10-14': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-15': ['habit-1', 'habit-2', 'habit-3', 'habit-4'],
  '2026-10-16': ['habit-1', 'habit-2'],
};

const INITIAL_SOCIAL_FEED: SocialPost[] = [
  {
    id: 'post-1',
    userId: 'user-aarav',
    userName: 'Aarav Sharma',
    companionName: 'Captain Pingu',
    avatarEmoji: '🧑‍🎓',
    outfitEmoji: '👑',
    actionText: 'completed a 25m ADHD Focus Sprint & hit a 14-day streak!',
    habitName: 'Solve 2 calculus problems',
    streakDays: 14,
    timeAgo: '4m ago',
    cheersCount: 18,
    cheeredByMe: false,
  },
  {
    id: 'post-2',
    userId: 'user-maya',
    userName: 'Maya Lin',
    companionName: 'Snowflake',
    avatarEmoji: '👩‍💻',
    outfitEmoji: '🧣',
    actionText: 'resisted doomscrolling for 72 hours straight!',
    habitName: 'No doomscrolling in bed',
    streakDays: 9,
    timeAgo: '19m ago',
    cheersCount: 24,
    cheeredByMe: true,
  },
  {
    id: 'post-3',
    userId: 'user-liam',
    userName: 'Liam O’Connor',
    companionName: 'Waddles',
    avatarEmoji: '🏃',
    outfitEmoji: '🧶',
    actionText: 'cracked open the Daily Mystery Ice Chest (+50 Coins)!',
    habitName: 'Morning 5-minute stretch',
    streakDays: 21,
    timeAgo: '1h ago',
    cheersCount: 31,
    cheeredByMe: false,
  },
  {
    id: 'post-4',
    userId: 'user-sophia',
    userName: 'Sophia Chen',
    companionName: 'Boba Pingu',
    avatarEmoji: '🎨',
    outfitEmoji: '🕶️',
    actionText: 'completed all 5 daily habits (100% Perfect Day)!',
    habitName: 'Read 2 pages before sleep',
    streakDays: 11,
    timeAgo: '2h ago',
    cheersCount: 42,
    cheeredByMe: false,
  },
];

const INITIAL_COOP_HABITS: CoopHabit[] = [
  {
    id: 'coop-1',
    title: 'Review 1 page of notes daily',
    partnerName: 'Aarav Sharma',
    partnerAvatar: '🧑‍🎓',
    sharedStreak: 8,
    myCompletedToday: true,
    partnerCompletedToday: true,
    nudgedToday: false,
    rewardCoins: 15,
  },
  {
    id: 'coop-2',
    title: '20-min evening focus timer',
    partnerName: 'Maya Lin',
    partnerAvatar: '👩‍💻',
    sharedStreak: 5,
    myCompletedToday: false,
    partnerCompletedToday: true,
    nudgedToday: false,
    rewardCoins: 20,
  },
  {
    id: 'coop-3',
    title: 'No phone 30m before sleep',
    partnerName: 'Liam O’Connor',
    partnerAvatar: '🏃',
    sharedStreak: 12,
    myCompletedToday: false,
    partnerCompletedToday: false,
    nudgedToday: false,
    rewardCoins: 25,
  },
];

const INITIAL_REFERRED_FRIENDS: ReferredFriend[] = [
  {
    id: 'ref-1',
    name: 'Aarav Sharma',
    avatar: '🧑‍🎓',
    joinedAgo: 'Joined 3 days ago',
    streak: 14,
  },
];

interface PenguState {
  // Profile & Gamification
  userName: string;
  companionName: string;
  mainGoal: string;
  memberSince: string;
  isPremium: boolean;
  coins: number;
  xp: number;
  level: number;
  pinguEnergy: number; // 0..100
  streakShields: number;
  focusSessionsCompleted: number;
  totalFocusMinutes: number;

  // Inventory & Customization
  ownedItemIds: string[];
  equippedOutfitId: string;
  equippedAccessoryId: string | null;
  equippedSceneryId: string;

  // Habits & History
  habits: Habit[];
  completedByDate: Record<string, string[]>;
  moodCheckIns: Record<string, MoodCheckIn>;
  dailyChestOpenedByDate: Record<string, boolean>;

  // Social & Referrals
  socialFeed: SocialPost[];
  coopHabits: CoopHabit[];
  followingIds: string[];
  referralCode: string;
  referredFriends: ReferredFriend[];

  // Celebration Modal Trigger
  celebrationHabitId: string | null;
  milestoneUnlockedItemId: string | null;

  // Appearance & Notification Settings
  themeMode: 'light' | 'dark' | 'system';
  reduceMotion: boolean;
  celebrationAnimations: boolean;
  soundAndVibration: boolean;
  notifications: NotificationSettings;

  // Actions
  toggleHabitToday: (habitId: string) => { completed: boolean; allDone: boolean };
  resistBadHabit: (habitId: string) => void;
  addHabit: (
    habit: Omit<
      Habit,
      'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'recent7Days' | 'archived'
    >
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleArchiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  dismissCelebration: () => void;
  dismissMilestoneModal: () => void;

  openDailyMysteryChest: () => { coinsWon: number; xpWon: number; shieldWon: boolean };
  completeFocusSession: (minutes: number, linkedHabitId?: string | null) => void;

  cheerFeedPost: (postId: string) => void;
  toggleFollowUser: (userId: string) => void;
  checkInCoopHabit: (coopId: string) => void;
  nudgeCoopPartner: (coopId: string) => void;
  simulateFriendReferral: () => { newCount: number; rewardText: string };

  saveMoodCheckIn: (mood: MoodType, reflection: string) => void;
  buyItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;

  updateProfile: (updates: {
    userName?: string;
    companionName?: string;
    mainGoal?: string;
  }) => void;
  updateAppearance: (updates: {
    themeMode?: 'light' | 'dark' | 'system';
    reduceMotion?: boolean;
    celebrationAnimations?: boolean;
    equippedSceneryId?: string;
  }) => void;
  setSoundAndVibration: (enabled: boolean) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  setPremiumStatus: (isPremium: boolean) => void;
  unlockAndEquipMilestone: (itemId: string) => void;
  completeOnboarding: (plan: OnboardingPlan) => void;
  resetToEmptyFreshStart: () => void;
  resetToDemo: () => void;
}

export const usePenguStore = create<PenguState>()(
  persist(
    (set, get) => ({
      userName: 'Pratap Mukhiya',
      companionName: 'Cozy Pingu',
      mainGoal: 'Study consistently',
      memberSince: 'October 2026',
      isPremium: true,
      coins: 520,
      xp: 60,
      level: 3,
      pinguEnergy: 65,
      streakShields: 2,
      focusSessionsCompleted: 7,
      totalFocusMinutes: 145,

      ownedItemIds: ['cozy-scarf', 'arctic-blue', 'penguin-obsidian'],
      equippedOutfitId: 'cozy-scarf',
      equippedAccessoryId: null,
      equippedSceneryId: 'arctic-blue',

      habits: INITIAL_HABITS,
      completedByDate: INITIAL_HISTORY,
      moodCheckIns: {
        '2026-10-16': {
          date: '2026-10-16',
          mood: 'Good',
          reflection: 'Feeling steady and making progress one page at a time.',
        },
      },
      dailyChestOpenedByDate: {},

      socialFeed: INITIAL_SOCIAL_FEED,
      coopHabits: INITIAL_COOP_HABITS,
      followingIds: ['user-aarav', 'user-maya'],
      referralCode: 'PENGU-PRATAP',
      referredFriends: INITIAL_REFERRED_FRIENDS,

      celebrationHabitId: null,
      milestoneUnlockedItemId: null,

      themeMode: 'light',
      reduceMotion: false,
      celebrationAnimations: true,
      soundAndVibration: true,
      notifications: {
        master: true,
        habitReminders: true,
        streakUpdates: false,
        achievementAlerts: true,
        weeklySummary: true,
        quietHours: true,
        quietHoursRange: '10:00 PM – 7:00 AM',
      },

      toggleHabitToday: (habitId: string) => {
        const today = getTodayKey();
        const state = get();
        const currentCompleted = state.completedByDate[today] ?? [];
        const isAlreadyCompleted = currentCompleted.includes(habitId);

        let nextCompleted: string[];
        let nextCoins = state.coins;
        let nextXp = state.xp;
        let nextLevel = state.level;
        let nextEnergy = state.pinguEnergy;

        if (isAlreadyCompleted) {
          nextCompleted = currentCompleted.filter((id) => id !== habitId);
          nextCoins = Math.max(0, state.coins - 5);
          nextXp = state.xp - 10;
          nextEnergy = Math.max(20, state.pinguEnergy - 20);
          if (nextXp < 0) {
            if (nextLevel > 1) {
              nextLevel -= 1;
              nextXp = 100 + nextXp;
            } else {
              nextXp = 0;
            }
          }
        } else {
          nextCompleted = [...currentCompleted, habitId];
          nextCoins = state.coins + 5;
          nextXp = state.xp + 10;
          nextEnergy = Math.min(100, state.pinguEnergy + 20);
          if (nextXp >= 100) {
            nextLevel += 1;
            nextXp -= 100;
          }
        }

        const updatedHabits = state.habits.map((h) => {
          if (h.id !== habitId) return h;
          const delta = isAlreadyCompleted ? -1 : 1;
          const newStreak = Math.max(0, h.streak + delta);
          const newTotal = Math.max(0, h.totalCompletions + delta);
          const newRecent = [...h.recent7Days];
          newRecent[4] = !isAlreadyCompleted;
          return {
            ...h,
            streak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
            totalCompletions: newTotal,
            recent7Days: newRecent,
          };
        });

        const activeBuildHabits = updatedHabits.filter(
          (h) => !h.archived && (h.habitType ?? 'build') === 'build'
        );
        const allDone =
          !isAlreadyCompleted &&
          activeBuildHabits.length > 0 &&
          activeBuildHabits.every((h) => nextCompleted.includes(h.id));

        set({
          habits: updatedHabits,
          completedByDate: {
            ...state.completedByDate,
            [today]: nextCompleted,
          },
          coins: nextCoins,
          xp: nextXp,
          level: nextLevel,
          pinguEnergy: nextEnergy,
          celebrationHabitId:
            !isAlreadyCompleted && state.celebrationAnimations ? habitId : null,
        });

        return { completed: !isAlreadyCompleted, allDone };
      },

      resistBadHabit: (habitId: string) => {
        const state = get();
        let nextXp = state.xp + 10;
        let nextLevel = state.level;
        if (nextXp >= 100) {
          nextLevel += 1;
          nextXp -= 100;
        }
        set({
          coins: state.coins + 5,
          xp: nextXp,
          level: nextLevel,
          pinguEnergy: Math.min(100, state.pinguEnergy + 15),
          habits: state.habits.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  cleanHours: (h.cleanHours ?? 24) + 12,
                  streak: h.streak + 1,
                  bestStreak: Math.max(h.bestStreak, h.streak + 1),
                  totalCompletions: h.totalCompletions + 1,
                }
              : h
          ),
        });
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          habitType: habitData.habitType ?? 'build',
          cleanHours: habitData.habitType === 'break' ? 1 : undefined,
          id: `habit-${Date.now()}`,
          archived: false,
          streak: 0,
          bestStreak: 0,
          totalCompletions: 0,
          recent7Days: [false, false, false, false, false, false, false],
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      toggleArchiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: !h.archived } : h
          ),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      dismissCelebration: () => set({ celebrationHabitId: null }),
      dismissMilestoneModal: () => set({ milestoneUnlockedItemId: null }),

      openDailyMysteryChest: () => {
        const today = getTodayKey();
        const state = get();
        if (state.dailyChestOpenedByDate[today]) {
          return { coinsWon: 0, xpWon: 0, shieldWon: false };
        }
        const coinsWon = 50;
        const xpWon = 30;
        let nextXp = state.xp + xpWon;
        let nextLevel = state.level;
        if (nextXp >= 100) {
          nextLevel += 1;
          nextXp -= 100;
        }
        set({
          coins: state.coins + coinsWon,
          xp: nextXp,
          level: nextLevel,
          streakShields: state.streakShields + 1,
          pinguEnergy: 100,
          dailyChestOpenedByDate: {
            ...state.dailyChestOpenedByDate,
            [today]: true,
          },
        });
        return { coinsWon, xpWon, shieldWon: true };
      },

      completeFocusSession: (minutes, linkedHabitId) => {
        const state = get();
        if (linkedHabitId) {
          const today = getTodayKey();
          const doneToday = state.completedByDate[today] ?? [];
          if (!doneToday.includes(linkedHabitId)) {
            state.toggleHabitToday(linkedHabitId);
          }
        }
        const refreshed = get();
        let nextXp = refreshed.xp + 25;
        let nextLevel = refreshed.level;
        if (nextXp >= 100) {
          nextLevel += 1;
          nextXp -= 100;
        }
        set({
          coins: refreshed.coins + 20,
          xp: nextXp,
          level: nextLevel,
          pinguEnergy: Math.min(100, refreshed.pinguEnergy + 25),
          focusSessionsCompleted: refreshed.focusSessionsCompleted + 1,
          totalFocusMinutes: refreshed.totalFocusMinutes + minutes,
        });
      },

      cheerFeedPost: (postId) => {
        const state = get();
        const post = state.socialFeed.find((p) => p.id === postId);
        if (!post) return;
        const alreadyCheered = post.cheeredByMe;
        set({
          coins: alreadyCheered ? state.coins : state.coins + 2,
          socialFeed: state.socialFeed.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  cheeredByMe: !alreadyCheered,
                  cheersCount: alreadyCheered
                    ? p.cheersCount - 1
                    : p.cheersCount + 1,
                }
              : p
          ),
        });
      },

      toggleFollowUser: (userId) => {
        set((state) => ({
          followingIds: state.followingIds.includes(userId)
            ? state.followingIds.filter((id) => id !== userId)
            : [...state.followingIds, userId],
        }));
      },

      checkInCoopHabit: (coopId) => {
        const state = get();
        const item = state.coopHabits.find((c) => c.id === coopId);
        if (!item || item.myCompletedToday) return;
        set({
          coins: state.coins + item.rewardCoins,
          pinguEnergy: Math.min(100, state.pinguEnergy + 15),
          coopHabits: state.coopHabits.map((c) =>
            c.id === coopId
              ? {
                  ...c,
                  myCompletedToday: true,
                  sharedStreak: c.partnerCompletedToday
                    ? c.sharedStreak + 1
                    : c.sharedStreak,
                }
              : c
          ),
        });
      },

      nudgeCoopPartner: (coopId) => {
        set((state) => ({
          coopHabits: state.coopHabits.map((c) =>
            c.id === coopId
              ? {
                  ...c,
                  nudgedToday: true,
                  partnerCompletedToday: true,
                  sharedStreak: c.myCompletedToday
                    ? c.sharedStreak + 1
                    : c.sharedStreak,
                }
              : c
          ),
        }));
      },

      simulateFriendReferral: () => {
        const state = get();
        const samplePool: ReferredFriend[] = [
          {
            id: `ref-${Date.now()}`,
            name: 'Maya Lin',
            avatar: '👩‍💻',
            joinedAgo: 'Just now',
            streak: 1,
          },
          {
            id: `ref-${Date.now() + 1}`,
            name: 'Liam O’Connor',
            avatar: '🏃',
            joinedAgo: 'Just now',
            streak: 1,
          },
          {
            id: `ref-${Date.now() + 2}`,
            name: 'Sophia Chen',
            avatar: '🎨',
            joinedAgo: 'Just now',
            streak: 1,
          },
          {
            id: `ref-${Date.now() + 3}`,
            name: 'Noah Patel',
            avatar: '🎸',
            joinedAgo: 'Just now',
            streak: 1,
          },
          {
            id: `ref-${Date.now() + 4}`,
            name: 'Zoe Kim',
            avatar: '📚',
            joinedAgo: 'Just now',
            streak: 1,
          },
        ];
        const nextFriend =
          samplePool[state.referredFriends.length % samplePool.length];
        const nextList = [...state.referredFriends, nextFriend];
        const count = nextList.length;

        let bonusCoins = 250;
        let bonusShields = 1;
        let nextOwned = [...state.ownedItemIds];
        let rewardText = '+250 Coins & +1 Ice Shield unlocked!';

        if (count >= 3 && !nextOwned.includes('star-crown')) {
          bonusCoins = 750;
          nextOwned.push('star-crown');
          rewardText = '3 Friends Milestone! Unlocked Emperor Crown + 750 Coins!';
        } else if (count >= 5) {
          bonusCoins = 1500;
          rewardText =
            '5 Friends Milestone! Unlocked PenguTask Pro + 1,500 Coins!';
        }

        set({
          referredFriends: nextList,
          coins: state.coins + bonusCoins,
          streakShields: state.streakShields + bonusShields,
          ownedItemIds: nextOwned,
          isPremium: count >= 5 ? true : state.isPremium,
        });

        return { newCount: count, rewardText };
      },

      saveMoodCheckIn: (mood, reflection) => {
        const today = getTodayKey();
        set((state) => ({
          moodCheckIns: {
            ...state.moodCheckIns,
            [today]: { date: today, mood, reflection },
          },
        }));
      },

      buyItem: (itemId) => {
        const state = get();
        const item = SHOP_CATALOG.find((i) => i.id === itemId);
        if (!item) return false;
        if (state.ownedItemIds.includes(itemId)) return true;
        if (state.coins < item.cost) return false;

        const nextOwned = [...state.ownedItemIds, itemId];
        const updates: Partial<PenguState> = {
          coins: state.coins - item.cost,
          ownedItemIds: nextOwned,
        };
        if (item.category === 'Outfits') {
          updates.equippedOutfitId = itemId;
        } else if (item.category === 'Accessories') {
          updates.equippedAccessoryId = itemId;
        } else if (item.category === 'Scenery') {
          updates.equippedSceneryId = itemId;
          updates.themeMode =
            itemId === 'penguin-obsidian' ? 'dark' : state.themeMode;
        }
        set(updates);
        return true;
      },

      equipItem: (itemId) => {
        const state = get();
        const item = SHOP_CATALOG.find((i) => i.id === itemId);
        if (!item || !state.ownedItemIds.includes(itemId)) return;

        if (item.category === 'Outfits') {
          set({ equippedOutfitId: itemId });
        } else if (item.category === 'Accessories') {
          set({
            equippedAccessoryId:
              state.equippedAccessoryId === itemId ? null : itemId,
          });
        } else if (item.category === 'Scenery') {
          set({
            equippedSceneryId: itemId,
            themeMode:
              itemId === 'penguin-obsidian' ? 'dark' : 'light',
          });
        }
      },

      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),

      updateAppearance: (updates) =>
        set((state) => {
          const next = { ...state, ...updates };
          if (updates.equippedSceneryId === 'penguin-obsidian') {
            next.themeMode = 'dark';
          }
          if (updates.themeMode === 'dark') {
            next.equippedSceneryId = 'penguin-obsidian';
          } else if (
            updates.themeMode === 'light' &&
            state.equippedSceneryId === 'penguin-obsidian'
          ) {
            next.equippedSceneryId = 'arctic-blue';
          }
          return next;
        }),

      setSoundAndVibration: (enabled) => set({ soundAndVibration: enabled }),

      updateNotifications: (updates) =>
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        })),

      setPremiumStatus: (isPremium) => set({ isPremium }),

      unlockAndEquipMilestone: (itemId) => {
        const state = get();
        const item = SHOP_CATALOG.find((i) => i.id === itemId);
        const nextOwned = state.ownedItemIds.includes(itemId)
          ? state.ownedItemIds
          : [...state.ownedItemIds, itemId];
        const updates: Partial<PenguState> = {
          ownedItemIds: nextOwned,
          milestoneUnlockedItemId: null,
        };
        if (item?.category === 'Outfits') {
          updates.equippedOutfitId = itemId;
        } else if (item?.category === 'Accessories') {
          updates.equippedAccessoryId = itemId;
        } else if (item?.category === 'Scenery') {
          updates.equippedSceneryId = itemId;
        }
        set(updates);
      },

      completeOnboarding: (plan) => {
        const state = get();
        const iconMap: Record<string, HabitIconType> = {
          Study: 'books',
          Fitness: 'dumbbell',
          Sleep: 'moon',
          Focus: 'bulb',
          Wellbeing: 'heart',
          'Daily routine': 'calendar',
        };
        const chosenIcon = iconMap[plan.priorityGoal] ?? 'books';
        const starterHabit: Habit = {
          id: `habit-${Date.now()}`,
          name: plan.firstHabitName || 'Review one page of notes',
          category: plan.priorityGoal || 'Study',
          icon: chosenIcon,
          habitType: 'build',
          minimumAction: `About ${plan.dailyMinutes || '5 minutes'}`,
          repeatDays:
            plan.repeatDays.length > 0
              ? plan.repeatDays
              : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          cue: plan.reminderCue || 'After school or work',
          reminderTime:
            plan.timeOfDay === 'Morning'
              ? '9:00 AM'
              : plan.timeOfDay === 'Afternoon'
              ? '2:00 PM'
              : '6:00 PM',
          reminderEnabled: true,
          notes: `Goal: ${plan.progressVision}`,
          archived: false,
          streak: 1,
          bestStreak: 1,
          totalCompletions: 1,
          recent7Days: [false, false, false, false, true, false, false],
        };

        const newHabits = [...state.habits];
        const exists = newHabits.some(
          (h) => h.name.toLowerCase() === starterHabit.name.toLowerCase()
        );
        if (!exists) {
          newHabits.unshift(starterHabit);
        }

        if (plan.badHabitToBreak && plan.badHabitToBreak.trim()) {
          const breakExists = newHabits.some(
            (h) =>
              h.name.toLowerCase() === plan.badHabitToBreak!.trim().toLowerCase()
          );
          if (!breakExists) {
            newHabits.push({
              id: `habit-break-${Date.now()}`,
              name: plan.badHabitToBreak.trim(),
              category: 'Focus',
              icon: 'bulb',
              habitType: 'break',
              cleanHours: 1,
              minimumAction: 'Replace trigger with 3 deep breaths',
              repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              cue: plan.slippingMoment || 'On busy days',
              reminderTime: '8:00 PM',
              reminderEnabled: true,
              notes: 'Breaking bad habit with Pingu.',
              archived: false,
              streak: 1,
              bestStreak: 1,
              totalCompletions: 1,
              recent7Days: [false, false, false, false, true, false, false],
            });
          }
        }

        set({
          userName: plan.userName.trim() || state.userName || 'Pratap Mukhiya',
          companionName: plan.buddyName || 'Cozy Pingu',
          mainGoal: plan.progressVision || 'Study consistently',
          habits: newHabits,
          themeMode: plan.themePreference ?? state.themeMode,
          equippedSceneryId:
            plan.themePreference === 'dark'
              ? 'penguin-obsidian'
              : state.equippedSceneryId,
        });
      },

      resetToEmptyFreshStart: () =>
        set({
          coins: 0,
          xp: 0,
          level: 1,
          pinguEnergy: 30,
          habits: [],
          completedByDate: {},
          celebrationHabitId: null,
        }),

      resetToDemo: () =>
        set({
          userName: 'Pratap Mukhiya',
          companionName: 'Cozy Pingu',
          mainGoal: 'Study consistently',
          coins: 520,
          xp: 60,
          level: 3,
          pinguEnergy: 65,
          streakShields: 2,
          ownedItemIds: ['cozy-scarf', 'arctic-blue', 'penguin-obsidian'],
          equippedOutfitId: 'cozy-scarf',
          equippedAccessoryId: null,
          equippedSceneryId: 'arctic-blue',
          habits: INITIAL_HABITS,
          completedByDate: INITIAL_HISTORY,
          socialFeed: INITIAL_SOCIAL_FEED,
          coopHabits: INITIAL_COOP_HABITS,
          referredFriends: INITIAL_REFERRED_FRIENDS,
          celebrationHabitId: null,
        }),
    }),
    {
      name: 'pengutask-local-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
