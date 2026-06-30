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

// ─── generateUploadUrl ──────────────────────────────────────────────────────
// Returns a short-lived URL the client POSTs an image to for profile pictures.

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    return await ctx.storage.generateUploadUrl();
  },
});

// ─── saveProfilePicture ─────────────────────────────────────────────────────
// Stores the Convex storage ID after the client uploads the image blob.

export const saveProfilePicture = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;
    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) throw new ConvexError('No preferences found');
    await ctx.db.patch(existing._id, { profilePictureId: storageId });
  },
});

// ─── getProfilePictureUrl ───────────────────────────────────────────────────
// Resolves a storage ID to its public URL. Used by the profile screen.

export const getProfilePictureUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

// ─── patchPrefs ─────────────────────────────────────────────────────────────
// Lightweight partial update — only patches the fields that are provided.
// Used by the settings screen so we don't have to re-send the full payload.

export const patchPrefs = mutation({
  args: {
    waterGoalMl: v.optional(v.number()),
    weightKg: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) throw new ConvexError('No preferences found');

    const patch: Record<string, unknown> = {};
    if (args.waterGoalMl !== undefined) patch.waterGoalMl = args.waterGoalMl;
    if (args.weightKg !== undefined) patch.weightKg = args.weightKg;
    if (Object.keys(patch).length > 0) await ctx.db.patch(existing._id, patch);
  },
});

// ─── changeChallenge ────────────────────────────────────────────────────────
// Switches the user to a new challenge, resetting the start date to today.
// Historical daily_logs are kept intact — they just fall outside the new window.

export const changeChallenge = mutation({
  args: {
    challenge: v.string(),
    challengeLength: v.number(),
    challengeStartDate: v.string(), // YYYY-MM-DD (user's local today)
    customHabits: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) throw new ConvexError('No preferences found');

    // Archive the current challenge run before switching.
    if (existing.challengeStartDate) {
      const endedAt = args.challengeStartDate; // today (user-local)
      const daysPassed = Math.floor(
        (new Date(endedAt).getTime() - new Date(existing.challengeStartDate).getTime()) / 86400000,
      );
      const status = daysPassed >= existing.challengeLength ? 'completed' : 'abandoned';

      // Count daily_log entries within the old window.
      const allLogs = await ctx.db
        .query('daily_logs')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect();
      const daysLogged = allLogs.filter(
        (l) => l.date >= existing.challengeStartDate && l.date < endedAt,
      ).length;

      await ctx.db.insert('challenge_history', {
        userId,
        challenge: existing.challenge,
        challengeLength: existing.challengeLength,
        challengeStartDate: existing.challengeStartDate,
        endedAt,
        daysLogged,
        status,
      });
    }

    await ctx.db.patch(existing._id, {
      challenge: args.challenge,
      challengeLength: args.challengeLength,
      challengeStartDate: args.challengeStartDate,
      customHabits: args.customHabits,
    });
  },
});

// ─── addCustomHabit ─────────────────────────────────────────────────────────
// Appends one encoded custom habit string to the user's customHabits array.
// Called when the user adds a habit mid-challenge.

export const addCustomHabit = mutation({
  args: { encoded: v.string() },
  handler: async (ctx, { encoded }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) throw new ConvexError('No preferences found');

    await ctx.db.patch(existing._id, {
      customHabits: [...existing.customHabits, encoded],
    });
  },
});

// ─── updateCustomHabits ──────────────────────────────────────────────────────
// Replaces the entire customHabits array. Used for soft-delete (endDate stamped
// on an entry) and reordering.

export const updateCustomHabits = mutation({
  args: { customHabits: v.array(v.string()) },
  handler: async (ctx, { customHabits }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) throw new ConvexError('No preferences found');

    await ctx.db.patch(existing._id, { customHabits });
  },
});

// ─── getHistory ─────────────────────────────────────────────────────────────
// Returns all past challenge runs for the current user, newest first.

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    const rows = await ctx.db
      .query('challenge_history')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    return rows.sort((a, b) => b.challengeStartDate.localeCompare(a.challengeStartDate));
  },
});

// ─── subscriptionStatus ─────────────────────────────────────────────────────

const SUBSCRIPTION_STATUS = v.union(
  v.literal('weekly'),
  v.literal('monthly'),
  v.literal('yearly'),
  v.literal('expired'),
);

// Called by the RevenueCat webhook (server → server). The webhook's app_user_id
// is the BetterAuth userId we set via Purchases.logIn(userId) on the client.
export const updateSubscriptionStatus = internalMutation({
  args: { userId: v.string(), status: SUBSCRIPTION_STATUS },
  handler: async (ctx, { userId, status }) => {
    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) return; // user hasn't finished onboarding yet — webhook may arrive first
    await ctx.db.patch(existing._id, { subscriptionStatus: status });
  },
});

const SUBSCRIPTION_SOURCE = v.optional(v.union(
  v.literal('direct'),
  v.literal('restored'),
  v.literal('transferred'),
));

// Called by the mobile app immediately after a purchase so the DB stays in sync
// even before the webhook fires. Authenticated — only updates the calling user.
// source is optional — when omitted the existing subscriptionSource is preserved.
export const syncSubscriptionStatus = mutation({
  args: { status: SUBSCRIPTION_STATUS, source: SUBSCRIPTION_SOURCE },
  handler: async (ctx, { status, source }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;
    const existing = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (!existing) return;
    const patch: Record<string, unknown> = { subscriptionStatus: status };
    if (source !== undefined) patch.subscriptionSource = source;
    await ctx.db.patch(existing._id, patch);
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

    // challenge_history
    const history = await ctx.db
      .query('challenge_history')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const h of history) await ctx.db.delete(h._id);

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

    // meals
    const meals = await ctx.db
      .query('meals')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const m of meals) await ctx.db.delete(m._id);

    // day_notes
    const notes = await ctx.db
      .query('day_notes')
      .withIndex('by_user_date', (q) => q.eq('userId', userId))
      .collect();
    for (const n of notes) await ctx.db.delete(n._id);

    // water_logs
    const waterLogs = await ctx.db
      .query('water_logs')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const w of waterLogs) await ctx.db.delete(w._id);

    // reminders
    const reminders = await ctx.db
      .query('reminders')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const r of reminders) await ctx.db.delete(r._id);
  },
});
