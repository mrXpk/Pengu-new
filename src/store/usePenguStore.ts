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
  repeatDays: DayOfWeek[];
  supportPrefs: string[];
  buddyName: string;
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
    name: 'Star crown',
    subtitle: 'Shine bright after building steady habits.',
    category: 'Outfits',
    cost: 400,
    emoji: '👑',
    accentColor: '#F59E0B',
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
    id: 'green-backpack',
    name: 'Pine trail pack',
    subtitle: 'Forest-ready pack for steady explorers.',
    category: 'Accessories',
    cost: 250,
    emoji: '🎒',
    accentColor: '#16A34A',
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
    id: 'arctic-blue',
    name: 'Arctic Blue',
    subtitle: 'Cozy igloo overlooking crystal glaciers.',
    category: 'Scenery',
    cost: 0,
    emoji: '🏔️',
    accentColor: '#38BDF8',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    subtitle: 'Peaceful pine valley by the mountain lake.',
    category: 'Scenery',
    cost: 350,
    emoji: '🌲',
    accentColor: '#22C55E',
  },
  {
    id: 'aurora-night',
    name: 'Aurora Sky',
    subtitle: 'Northern lights glowing over Pingu’s home.',
    category: 'Scenery',
    cost: 450,
    emoji: '🌌',
    accentColor: '#8B5CF6',
  },
];

export const getTodayKey = (): string => {
  return '2026-10-16'; // Matches Friday, 16 October from UI reference by default
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Review one page of notes',
    category: 'Study',
    icon: 'books',
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

  // Inventory & Customization
  ownedItemIds: string[];
  equippedOutfitId: string;
  equippedAccessoryId: string | null;
  equippedSceneryId: string;

  // Habits & History
  habits: Habit[];
  completedByDate: Record<string, string[]>;
  moodCheckIns: Record<string, MoodCheckIn>;

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
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'recent7Days' | 'archived'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleArchiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  dismissCelebration: () => void;
  dismissMilestoneModal: () => void;

  saveMoodCheckIn: (mood: MoodType, reflection: string) => void;
  buyItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;

  updateProfile: (updates: { userName?: string; companionName?: string; mainGoal?: string }) => void;
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

      ownedItemIds: ['cozy-scarf', 'arctic-blue'],
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

        if (isAlreadyCompleted) {
          nextCompleted = currentCompleted.filter((id) => id !== habitId);
          nextCoins = Math.max(0, state.coins - 5);
          nextXp = state.xp - 10;
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
          newRecent[4] = !isAlreadyCompleted; // Friday index
          return {
            ...h,
            streak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
            totalCompletions: newTotal,
            recent7Days: newRecent,
          };
        });

        const activeHabits = updatedHabits.filter((h) => !h.archived);
        const allDone =
          !isAlreadyCompleted &&
          activeHabits.length > 0 &&
          activeHabits.every((h) => nextCompleted.includes(h.id));

        set({
          habits: updatedHabits,
          completedByDate: {
            ...state.completedByDate,
            [today]: nextCompleted,
          },
          coins: nextCoins,
          xp: nextXp,
          level: nextLevel,
          celebrationHabitId:
            !isAlreadyCompleted && state.celebrationAnimations ? habitId : null,
        });

        return { completed: !isAlreadyCompleted, allDone };
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
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
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
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
          set({ equippedSceneryId: itemId });
        }
      },

      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),

      updateAppearance: (updates) => set((state) => ({ ...state, ...updates })),

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

        const exists = state.habits.some(
          (h) => h.name.toLowerCase() === starterHabit.name.toLowerCase()
        );

        set({
          userName: plan.userName.trim() || state.userName || 'Pratap Mukhiya',
          companionName: plan.buddyName || 'Cozy Pingu',
          mainGoal: plan.progressVision || 'Study consistently',
          habits: exists ? state.habits : [starterHabit, ...state.habits],
        });
      },

      resetToEmptyFreshStart: () =>
        set({
          coins: 0,
          xp: 0,
          level: 1,
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
          ownedItemIds: ['cozy-scarf', 'arctic-blue'],
          equippedOutfitId: 'cozy-scarf',
          equippedAccessoryId: null,
          equippedSceneryId: 'arctic-blue',
          habits: INITIAL_HABITS,
          completedByDate: INITIAL_HISTORY,
          celebrationHabitId: null,
        }),
    }),
    {
      name: 'pengutask-local-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
