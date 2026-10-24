import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoinBadge, PrimaryButton } from '@/components/pengu-ui';
import { Fonts, PenguColors, PenguinObsidianTheme } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export default function SocialCommunityScreen() {
  const router = useRouter();
  const themeMode = usePenguStore((s) => s.themeMode);
  const equippedSceneryId = usePenguStore((s) => s.equippedSceneryId);
  const socialFeed = usePenguStore((s) => s.socialFeed);
  const coopHabits = usePenguStore((s) => s.coopHabits);
  const followingIds = usePenguStore((s) => s.followingIds);
  const cheerFeedPost = usePenguStore((s) => s.cheerFeedPost);
  const toggleFollowUser = usePenguStore((s) => s.toggleFollowUser);
  const checkInCoopHabit = usePenguStore((s) => s.checkInCoopHabit);
  const nudgeCoopPartner = usePenguStore((s) => s.nudgeCoopPartner);

  const [activeTab, setActiveTab] = useState<'feed' | 'coop' | 'squad'>('feed');

  const isObsidian =
    themeMode === 'dark' || equippedSceneryId === 'penguin-obsidian';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isObsidian && { backgroundColor: PenguinObsidianTheme.background },
      ]}
      edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text
              style={[
                styles.pageTitle,
                isObsidian && { color: PenguinObsidianTheme.textPrimary },
              ]}>
              Iceberg Squad
            </Text>
            <Text
              style={[
                styles.pageSub,
                isObsidian && { color: PenguinObsidianTheme.textSecondary },
              ]}>
              Build habits together & cheer friends on
            </Text>
          </View>
          <CoinBadge />
        </View>

        {/* Invite Friends Hero Banner */}
        <Pressable
          onPress={() => {
            playSound('tap');
            router.push('/referrals' as any);
          }}
          style={styles.referralBanner}>
          <View style={styles.referralGiftCircle}>
            <Text style={{ fontSize: 28 }}>🎁</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.referralTitle}>
              Invite Friends • Get Free Pro & 1,500 🪙
            </Text>
            <Text style={styles.referralSub}>
              Earn +250 coins & 1x Ice Shield for every friend who joins!
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </Pressable>

        {/* Mode Switcher */}
        <View
          style={[
            styles.segmentBar,
            isObsidian && {
              backgroundColor: PenguinObsidianTheme.card,
              borderColor: PenguinObsidianTheme.bellyHighlightBorder,
            },
          ]}>
          {[
            { id: 'feed', label: '🔥 Live Feed' },
            { id: 'coop', label: '🤝 Buddy Streaks' },
            { id: 'squad', label: '🏆 Leaderboard' },
          ].map((t) => {
            const active = activeTab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  playSound('tap');
                  setActiveTab(t.id as 'feed' | 'coop' | 'squad');
                }}
                style={[
                  styles.segmentItem,
                  active && styles.segmentItemActive,
                ]}>
                <Text
                  style={[
                    styles.segmentText,
                    isObsidian && { color: PenguinObsidianTheme.textSecondary },
                    active && styles.segmentTextActive,
                  ]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* TAB 1: LIVE COMMUNITY FEED */}
        {activeTab === 'feed' && (
          <View style={styles.listCol}>
            {socialFeed.map((post) => {
              const isFollowing = followingIds.includes(post.userId);
              return (
                <View
                  key={post.id}
                  style={[
                    styles.feedCard,
                    isObsidian && {
                      backgroundColor: PenguinObsidianTheme.card,
                      borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                    },
                  ]}>
                  <View style={styles.feedHeader}>
                    <View style={styles.avatarWrap}>
                      <Text style={{ fontSize: 24 }}>{post.avatarEmoji}</Text>
                      <View style={styles.outfitMiniBadge}>
                        <Text style={{ fontSize: 12 }}>{post.outfitEmoji}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.nameAndStreakRow}>
                        <Text
                          style={[
                            styles.userName,
                            isObsidian && {
                              color: PenguinObsidianTheme.textPrimary,
                            },
                          ]}>
                          {post.userName}
                        </Text>
                        <View style={styles.streakPill}>
                          <Text style={styles.streakPillText}>
                            🔥 {post.streakDays}d
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.companionSub}>
                        with {post.companionName} • {post.timeAgo}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        playSound('tap');
                        toggleFollowUser(post.userId);
                      }}
                      style={[
                        styles.followBtn,
                        isFollowing && styles.followBtnActive,
                      ]}>
                      <Text
                        style={[
                          styles.followBtnText,
                          isFollowing && styles.followBtnTextActive,
                        ]}>
                        {isFollowing ? 'Following' : '+ Follow'}
                      </Text>
                    </Pressable>
                  </View>

                  <Text
                    style={[
                      styles.actionCopy,
                      isObsidian && { color: PenguinObsidianTheme.textPrimary },
                    ]}>
                    {post.actionText}
                  </Text>

                  <View
                    style={[
                      styles.habitTagBox,
                      isObsidian && { backgroundColor: '#0F1B2E' },
                    ]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={PenguColors.primaryGreen}
                    />
                    <Text
                      style={[
                        styles.habitTagText,
                        isObsidian && {
                          color: PenguinObsidianTheme.textPrimary,
                        },
                      ]}>
                      {post.habitName}
                    </Text>
                  </View>

                  <View style={styles.feedFooter}>
                    <Pressable
                      onPress={() => {
                        playSound('cheer');
                        cheerFeedPost(post.id);
                      }}
                      style={[
                        styles.cheerBtn,
                        post.cheeredByMe && styles.cheerBtnActive,
                      ]}>
                      <Text style={{ fontSize: 16 }}>👏</Text>
                      <Text
                        style={[
                          styles.cheerBtnText,
                          post.cheeredByMe && styles.cheerBtnTextActive,
                        ]}>
                        {post.cheeredByMe ? 'Cheered!' : 'Cheer (+2 🪙)'} •{' '}
                        {post.cheersCount}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: CO-OP SHARED BUDDY STREAKS */}
        {activeTab === 'coop' && (
          <View style={styles.listCol}>
            <View style={styles.coopIntroBox}>
              <Text style={{ fontSize: 28 }}>🤝</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.coopIntroTitle}>
                  Shared Co-Op Habit Streaks
                </Text>
                <Text style={styles.coopIntroSub}>
                  Both you and your buddy check in daily to keep your Shared
                  Flame alive!
                </Text>
              </View>
            </View>

            {coopHabits.map((coop) => {
              const bothDone =
                coop.myCompletedToday && coop.partnerCompletedToday;
              return (
                <View
                  key={coop.id}
                  style={[
                    styles.feedCard,
                    isObsidian && {
                      backgroundColor: PenguinObsidianTheme.card,
                      borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                    },
                    bothDone && { borderColor: PenguColors.primaryGreen },
                  ]}>
                  <View style={styles.coopTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.coopHabitTitle,
                          isObsidian && {
                            color: PenguinObsidianTheme.textPrimary,
                          },
                        ]}>
                        {coop.title}
                      </Text>
                      <Text style={styles.companionSub}>
                        Partner: {coop.partnerAvatar} {coop.partnerName} • +
                        {coop.rewardCoins} 🪙 bonus
                      </Text>
                    </View>
                    <View style={styles.sharedFlameBadge}>
                      <Text style={styles.sharedFlameText}>
                        🔥 {coop.sharedStreak}d
                      </Text>
                    </View>
                  </View>

                  {/* Dual Partner Progress Pills */}
                  <View style={styles.dualStatusRow}>
                    <View
                      style={[
                        styles.partnerStatusPill,
                        coop.myCompletedToday && styles.partnerStatusDone,
                      ]}>
                      <Ionicons
                        name={
                          coop.myCompletedToday
                            ? 'checkmark-circle'
                            : 'ellipse-outline'
                        }
                        size={18}
                        color={coop.myCompletedToday ? '#16A34A' : '#64748B'}
                      />
                      <Text style={styles.partnerStatusText}>
                        You: {coop.myCompletedToday ? 'Done' : 'Pending'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.partnerStatusPill,
                        coop.partnerCompletedToday && styles.partnerStatusDone,
                      ]}>
                      <Ionicons
                        name={
                          coop.partnerCompletedToday
                            ? 'checkmark-circle'
                            : 'ellipse-outline'
                        }
                        size={18}
                        color={
                          coop.partnerCompletedToday ? '#16A34A' : '#64748B'
                        }
                      />
                      <Text style={styles.partnerStatusText}>
                        {coop.partnerName.split(' ')[0]}:{' '}
                        {coop.partnerCompletedToday ? 'Done' : 'Pending'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.coopActionsRow}>
                    {!coop.myCompletedToday ? (
                      <PrimaryButton
                        label={`Check In (+${coop.rewardCoins} 🪙)`}
                        onPress={() => {
                          playSound('checkin');
                          checkInCoopHabit(coop.id);
                        }}
                        style={{ flex: 1, paddingVertical: 11 }}
                      />
                    ) : (
                      <View style={styles.completedTag}>
                        <Text style={styles.completedTagText}>
                          ✅ You checked in today!
                        </Text>
                      </View>
                    )}

                    {!coop.partnerCompletedToday && (
                      <Pressable
                        onPress={() => {
                          playSound('cheer');
                          nudgeCoopPartner(coop.id);
                        }}
                        style={styles.nudgeBtn}>
                        <Text style={styles.nudgeBtnText}>
                          👋 Nudge {coop.partnerName.split(' ')[0]}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: SQUAD LEADERBOARD */}
        {activeTab === 'squad' && (
          <View style={styles.listCol}>
            {[
              {
                rank: 1,
                name: 'Liam O’Connor',
                avatar: '🏃',
                streak: 21,
                xp: '1,420 XP',
                isMe: false,
              },
              {
                rank: 2,
                name: 'Aarav Sharma',
                avatar: '🧑‍🎓',
                streak: 14,
                xp: '1,180 XP',
                isMe: false,
              },
              {
                rank: 3,
                name: 'Pratap Mukhiya (You)',
                avatar: '🐧',
                streak: 8,
                xp: '960 XP',
                isMe: true,
              },
              {
                rank: 4,
                name: 'Sophia Chen',
                avatar: '🎨',
                streak: 11,
                xp: '890 XP',
                isMe: false,
              },
              {
                rank: 5,
                name: 'Maya Lin',
                avatar: '👩‍💻',
                streak: 9,
                xp: '840 XP',
                isMe: false,
              },
            ].map((row) => (
              <View
                key={row.rank}
                style={[
                  styles.leaderRow,
                  isObsidian && {
                    backgroundColor: PenguinObsidianTheme.card,
                    borderColor: PenguinObsidianTheme.bellyHighlightBorder,
                  },
                  row.isMe && styles.leaderRowMe,
                ]}>
                <Text style={styles.rankBadge}>
                  {row.rank === 1
                    ? '🥇'
                    : row.rank === 2
                    ? '🥈'
                    : row.rank === 3
                    ? '🥉'
                    : `#${row.rank}`}
                </Text>
                <Text style={{ fontSize: 26 }}>{row.avatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.userName,
                      isObsidian &&
                        !row.isMe && {
                          color: PenguinObsidianTheme.textPrimary,
                        },
                    ]}>
                    {row.name}
                  </Text>
                  <Text style={styles.companionSub}>
                    🔥 {row.streak} day streak
                  </Text>
                </View>
                <Text style={styles.leaderXp}>{row.xp}</Text>
              </View>
            ))}
          </View>
        )}
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
    paddingTop: 12,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 28,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  pageSub: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  referralBanner: {
    backgroundColor: '#1D8348',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#145A32',
    marginBottom: 16,
  },
  referralGiftCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  referralSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: '#DCFCE7',
    marginTop: 2,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: PenguColors.cardBorder,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: PenguColors.primaryGreen,
  },
  segmentText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  listCol: {
    gap: 14,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
    gap: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outfitMiniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  nameAndStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  streakPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  streakPillText: {
    fontFamily: Fonts?.rounded,
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  companionSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: PenguColors.primaryGreen,
  },
  followBtnActive: {
    backgroundColor: PenguColors.surfaceMint,
  },
  followBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '800',
    color: PenguColors.primaryGreen,
  },
  followBtnTextActive: {
    color: PenguColors.primaryGreenDark,
  },
  actionCopy: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: PenguColors.navyHeading,
    lineHeight: 20,
  },
  habitTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PenguColors.surfaceMint,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  habitTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cheerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cheerBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  cheerBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  cheerBtnTextActive: {
    color: '#B45309',
  },
  coopIntroBox: {
    backgroundColor: '#EAF6FF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  coopIntroTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  coopIntroSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  coopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  coopHabitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 17,
    fontWeight: '900',
    color: PenguColors.navyHeading,
  },
  sharedFlameBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FB923C',
  },
  sharedFlameText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
  },
  dualStatusRow: {
    flexDirection: 'row',
    gap: 10,
  },
  partnerStatusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partnerStatusDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  partnerStatusText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  coopActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedTag: {
    flex: 1,
    backgroundColor: PenguColors.surfaceMint,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
  },
  completedTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
  nudgeBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
  },
  nudgeBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  leaderRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: PenguColors.cardBorder,
  },
  leaderRowMe: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.primaryGreen,
  },
  rankBadge: {
    fontFamily: Fonts?.rounded,
    fontSize: 20,
    fontWeight: '900',
    width: 32,
    textAlign: 'center',
  },
  leaderXp: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '900',
    color: PenguColors.primaryGreen,
  },
});
