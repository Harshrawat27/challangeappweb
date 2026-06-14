import { ConvexError, v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';

const reminderTimes = v.object({
  morning: v.string(),
  afternoon: v.string(),
  evening: v.string(),
});

// ─── save / upsert ──────────────────────────────────────────────────────────
// Called once at the end of onboarding (from the paywall's "Start free trial").
// Idempotent: re-running updates the existing row for this user.

export const save = mutation({
  args: {
    name: v.string(),
    challenge: v.string(),
    challengeLength: v.number(),
    challengeStartDate: v.string(),    // YYYY-MM-DD passed from client (user's local)
    customHabits: v.array(v.string()),
    whyMotivations: v.array(v.string()),
    pastFailures: v.array(v.string()),
    seriousness: v.number(),
    partnerInvited: v.boolean(),
    reminderTimes,
    weightKg: v.optional(v.number()),
    waterGoalMl: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    const onboardingCompletedAt = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        // Don't overwrite the original start date on re-save
        challengeStartDate: existing.challengeStartDate || args.challengeStartDate,
        onboardingCompletedAt,
      });
      return existing._id;
    }

    return await ctx.db.insert('user_preferences', {
      userId,
      ...args,
      onboardingCompletedAt,
    });
  },
});

// ─── get (current user's preferences) ──────────────────────────────────────
// Returns null if the user hasn't completed onboarding yet.

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    return await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
  },
});

// ─── deleteByUserId (internal) ─────────────────────────────────────────────
// Cascading delete for the Better Auth user-delete flow. Called from the
// `beforeDelete` hook in convex/betterAuth/auth.ts.
// Wipes everything the user produced: preferences, daily logs, username,
// friendships in both directions, and pending friend requests.

export const deleteByUserId = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // user_preferences
    const prefs = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (prefs) await ctx.db.delete(prefs._id);

    // daily_logs
    const logs = await ctx.db
      .query('daily_logs')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const log of logs) await ctx.db.delete(log._id);

    // usernames
    const username = await ctx.db
      .query('usernames')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (username) await ctx.db.delete(username._id);

    // friendships — both sides
    const myFriends = await ctx.db
      .query('friendships')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const f of myFriends) {
      await ctx.db.delete(f._id);
      const reverse = await ctx.db
        .query('friendships')
        .withIndex('by_pair', (q) => q.eq('userId', f.friendId).eq('friendId', userId))
        .first();
      if (reverse) await ctx.db.delete(reverse._id);
    }

    // friend_requests — both directions
    const outgoing = await ctx.db
      .query('friend_requests')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .collect();
    for (const r of outgoing) await ctx.db.delete(r._id);
    const incoming = await ctx.db
      .query('friend_requests')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .collect();
    for (const r of incoming) await ctx.db.delete(r._id);
  },
});
