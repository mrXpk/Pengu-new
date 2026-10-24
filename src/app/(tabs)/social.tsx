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
import { Fonts, PenguColors } from '@/constants/theme';
import { usePenguStore } from '@/store/usePenguStore';
import { playSound } from '@/utils/sound';

export default function SocialCommunityScreen() {
  const router = useRouter();
  const socialFeed = usePenguStore((s) => s.socialFeed);
  const coopHabits = usePenguStore((s) => s.coopHabits);
  const followingIds = usePenguStore((s) => s.followingIds);
  const cheerFeedPost = usePenguStore((s) => s.cheerFeedPost);
  const toggleFollowUser = usePenguStore((s) => s.toggleFollowUser);
  const checkInCoopHabit = usePenguStore((s) => s.checkInCoopHabit);
  const nudgeCoopPartner = usePenguStore((s) => s.nudgeCoopPartner);

  const [activeTab, setActiveTab] = useState<'feed' | 'coop' | 'squad'>('feed');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Minimalist Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Community</Text>
            <Text style={styles.pageSub}>
              Build habits together & stay accountable
            </Text>
          </View>
          <CoinBadge />
        </View>

        {/* Minimalist Soft-Mint Invite Friends Card */}
        <Pressable
          onPress={() => {
            playSound('tap');
            router.push('/referrals' as any);
          }}
          style={({ pressed }) => [
            styles.referralBanner,
            pressed && { opacity: 0.88 },
          ]}>
          <View style={styles.referralGiftCircle}>
            <Text style={{ fontSize: 22 }}>🎁</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.referralTitle}>Invite friends & earn rewards</Text>
            <Text style={styles.referralSub}>
              Get +250 coins & 1 streak shield when a friend joins
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={PenguColors.navyHeading}
          />
        </Pressable>

        {/* Minimalist Segmented Switcher */}
        <View style={styles.segmentBar}>
          {[
            { id: 'feed', label: 'Feed' },
            { id: 'coop', label: 'Buddy Streaks' },
            { id: 'squad', label: 'Leaderboard' },
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
                    active && styles.segmentTextActive,
                  ]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* TAB 1: HIGH-READABILITY MINIMALIST FEED */}
        {activeTab === 'feed' && (
          <View style={styles.listCol}>
            {socialFeed.map((post) => {
              const isFollowing = followingIds.includes(post.userId);
              return (
                <View key={post.id} style={styles.feedCard}>
                  <View style={styles.feedHeader}>
                    <View style={styles.avatarWrap}>
                      <Text style={{ fontSize: 20 }}>{post.avatarEmoji}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.nameAndStreakRow}>
                        <Text style={styles.userName}>{post.userName}</Text>
                        <Text style={styles.streakMeta}>
                          • 🔥 {post.streakDays}d
                        </Text>
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
                        {isFollowing ? 'Following' : 'Follow'}
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={styles.actionCopy}>
                    <Text style={{ fontWeight: '700' }}>
                      {post.userName.split(' ')[0]}
                    </Text>{' '}
                    {post.actionText}
                  </Text>

                  <View style={styles.habitTagBox}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={PenguColors.primaryGreen}
                    />
                    <Text style={styles.habitTagText}>{post.habitName}</Text>
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
                      <Ionicons
                        name={post.cheeredByMe ? 'heart' : 'heart-outline'}
                        size={16}
                        color={
                          post.cheeredByMe
                            ? PenguColors.primaryGreenDark
                            : '#64748B'
                        }
                      />
                      <Text
                        style={[
                          styles.cheerBtnText,
                          post.cheeredByMe && styles.cheerBtnTextActive,
                        ]}>
                        {post.cheeredByMe ? 'Cheered' : 'Cheer'} •{' '}
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
            {coopHabits.map((coop) => {
              const bothDone =
                coop.myCompletedToday && coop.partnerCompletedToday;
              return (
                <View
                  key={coop.id}
                  style={[
                    styles.feedCard,
                    bothDone && { borderColor: PenguColors.mintBorder },
                  ]}>
                  <View style={styles.coopTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.coopHabitTitle}>{coop.title}</Text>
                      <Text style={styles.companionSub}>
                        Partner: {coop.partnerName} • +{coop.rewardCoins} coins
                      </Text>
                    </View>
                    <View style={styles.sharedFlameBadge}>
                      <Text style={styles.sharedFlameText}>
                        🔥 {coop.sharedStreak}d
                      </Text>
                    </View>
                  </View>

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
                        size={16}
                        color={
                          coop.myCompletedToday
                            ? PenguColors.primaryGreen
                            : '#94A3B8'
                        }
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
                        size={16}
                        color={
                          coop.partnerCompletedToday
                            ? PenguColors.primaryGreen
                            : '#94A3B8'
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
                        label={`Check in (+${coop.rewardCoins} 🪙)`}
                        onPress={() => {
                          playSound('checkin');
                          checkInCoopHabit(coop.id);
                        }}
                        style={{ flex: 1, paddingVertical: 11 }}
                      />
                    ) : (
                      <View style={styles.completedTag}>
                        <Text style={styles.completedTagText}>
                          Checked in today
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
                          Nudge {coop.partnerName.split(' ')[0]}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: MINIMALIST LEADERBOARD */}
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
                style={[styles.leaderRow, row.isMe && styles.leaderRowMe]}>
                <Text style={styles.rankBadge}>{row.rank}</Text>
                <View style={styles.avatarWrap}>
                  <Text style={{ fontSize: 18 }}>{row.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{row.name}</Text>
                  <Text style={styles.companionSub}>
                    {row.streak} day streak
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
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 30,
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
    backgroundColor: PenguColors.surfaceMint,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: PenguColors.mintBorder,
    marginBottom: 16,
  },
  referralGiftCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  referralSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: PenguColors.textSecondary,
    marginTop: 2,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '700',
    color: PenguColors.textSecondary,
  },
  segmentTextActive: {
    color: PenguColors.navyHeading,
    fontWeight: '800',
  },
  listCol: {
    gap: 12,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAECEF',
    gap: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameAndStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  streakMeta: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
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
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  followBtnActive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  followBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 12,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  followBtnTextActive: {
    color: '#64748B',
  },
  actionCopy: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  habitTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  habitTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  cheerBtnActive: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  cheerBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  cheerBtnTextActive: {
    color: PenguColors.primaryGreenDark,
  },
  coopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  coopHabitTitle: {
    fontFamily: Fonts?.rounded,
    fontSize: 16,
    fontWeight: '800',
    color: PenguColors.navyHeading,
  },
  sharedFlameBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sharedFlameText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '800',
    color: PenguColors.navyHeading,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  partnerStatusDone: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  partnerStatusText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  coopActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedTag: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedTagText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  nudgeBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
  },
  nudgeBtnText: {
    fontFamily: Fonts?.rounded,
    fontSize: 13,
    fontWeight: '700',
    color: PenguColors.navyHeading,
  },
  leaderRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  leaderRowMe: {
    backgroundColor: PenguColors.surfaceMint,
    borderColor: PenguColors.mintBorder,
  },
  rankBadge: {
    width: 24,
    textAlign: 'center',
    fontFamily: Fonts?.rounded,
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  leaderXp: {
    fontFamily: Fonts?.rounded,
    fontSize: 14,
    fontWeight: '800',
    color: PenguColors.primaryGreenDark,
  },
});
