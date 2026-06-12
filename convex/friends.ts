import { ConvexError, v } from 'convex/values';

import { mutation, query, type QueryCtx } from './_generated/server';

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalize(username: string): string {
  return username.trim().toLowerCase();
}

async function requireAuth(ctx: QueryCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthenticated');
  return identity.subject;
}

// ─── sendRequest ────────────────────────────────────────────────────────────
// User A types user B's username and taps "Send invite". This inserts a
// pending row keyed (fromUserId=A, toUserId=B). Idempotent — re-running with
// an existing pending request is a no-op.

export const sendRequest = mutation({
  args: { toUsername: v.string() },
  handler: async (ctx, { toUsername }) => {
    const fromUserId = await requireAuth(ctx);
    const u = normalize(toUsername);

    const target = await ctx.db
      .query('usernames')
      .withIndex('by_username', (q) => q.eq('username', u))
      .first();
    if (!target) throw new ConvexError('User not found');

    const toUserId = target.userId;
    if (toUserId === fromUserId) throw new ConvexError('Cannot invite yourself');

    // Already friends? Done.
    const existingFriendship = await ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) => q.eq('userId', fromUserId).eq('friendId', toUserId))
      .first();
    if (existingFriendship) return { status: 'already_friends' as const };

    // Pending request already? No-op.
    const existing = await ctx.db
      .query('friend_requests')
      .withIndex('by_pair', (q) => q.eq('fromUserId', fromUserId).eq('toUserId', toUserId))
      .first();
    if (existing) return { status: 'already_pending' as const };

    // Has the OTHER user already invited me? Auto-accept (mutual interest).
    const reverse = await ctx.db
      .query('friend_requests')
      .withIndex('by_pair', (q) => q.eq('fromUserId', toUserId).eq('toUserId', fromUserId))
      .first();
    if (reverse) {
      await ctx.db.delete(reverse._id);
      const now = new Date().toISOString();
      await ctx.db.insert('friendships', { userId: fromUserId, friendId: toUserId, createdAt: now });
      await ctx.db.insert('friendships', { userId: toUserId, friendId: fromUserId, createdAt: now });
      return { status: 'auto_accepted' as const };
    }

    await ctx.db.insert('friend_requests', {
      fromUserId,
      toUserId,
      createdAt: new Date().toISOString(),
    });
    return { status: 'sent' as const };
  },
});

// ─── accept / decline / remove ─────────────────────────────────────────────

export const acceptRequest = mutation({
  args: { fromUserId: v.string() },
  handler: async (ctx, { fromUserId }) => {
    const toUserId = await requireAuth(ctx);
    const req = await ctx.db
      .query('friend_requests')
      .withIndex('by_pair', (q) => q.eq('fromUserId', fromUserId).eq('toUserId', toUserId))
      .first();
    if (!req) throw new ConvexError('Request not found');

    await ctx.db.delete(req._id);
    const now = new Date().toISOString();
    await ctx.db.insert('friendships', { userId: toUserId, friendId: fromUserId, createdAt: now });
    await ctx.db.insert('friendships', { userId: fromUserId, friendId: toUserId, createdAt: now });
  },
});

export const declineRequest = mutation({
  args: { fromUserId: v.string() },
  handler: async (ctx, { fromUserId }) => {
    const toUserId = await requireAuth(ctx);
    const req = await ctx.db
      .query('friend_requests')
      .withIndex('by_pair', (q) => q.eq('fromUserId', fromUserId).eq('toUserId', toUserId))
      .first();
    if (req) await ctx.db.delete(req._id);
  },
});

export const removeFriend = mutation({
  args: { friendUserId: v.string() },
  handler: async (ctx, { friendUserId }) => {
    const me = await requireAuth(ctx);
    const a = await ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) => q.eq('userId', me).eq('friendId', friendUserId))
      .first();
    if (a) await ctx.db.delete(a._id);
    const b = await ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) => q.eq('userId', friendUserId).eq('friendId', me))
      .first();
    if (b) await ctx.db.delete(b._id);
  },
});

// ─── Lookups ────────────────────────────────────────────────────────────────
// Helper that pulls a friend's public profile + today's progress, used by
// both list and detail views.

async function fetchFriendCard(
  ctx: QueryCtx,
  friendUserId: string,
  today: string,
) {
  const username = await ctx.db
    .query('usernames')
    .withIndex('by_user', (q) => q.eq('userId', friendUserId))
    .first();
  const prefs = await ctx.db
    .query('user_preferences')
    .withIndex('by_user', (q) => q.eq('userId', friendUserId))
    .first();
  const todayLog = await ctx.db
    .query('daily_logs')
    .withIndex('by_user_date', (q) => q.eq('userId', friendUserId).eq('date', today))
    .first();

  let currentDay: number | null = null;
  if (prefs?.challengeStartDate) {
    const [sy, sm, sd] = prefs.challengeStartDate.split('-').map(Number);
    const [ty, tm, td] = today.split('-').map(Number);
    const startMs = Date.UTC(sy, (sm ?? 1) - 1, sd ?? 1);
    const todayMs = Date.UTC(ty, (tm ?? 1) - 1, td ?? 1);
    currentDay = Math.max(1, Math.floor((todayMs - startMs) / 86_400_000) + 1);
  }

  return {
    userId: friendUserId,
    username: username?.username ?? null,
    displayName: username?.displayName ?? prefs?.name ?? 'Friend',
    name: prefs?.name ?? null,
    challenge: prefs?.challenge ?? null,
    challengeLength: prefs?.challengeLength ?? null,
    currentDay,
    todayCompleted: todayLog ? Object.keys(todayLog.completions).length : 0,
    todayExpected: todayLog?.allTaskIds.length ?? 0,
  };
}

export const getMyFriends = query({
  args: { today: v.string() },
  handler: async (ctx, { today }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const me = identity.subject;

    const rows = await ctx.db
      .query('friendships')
      .withIndex('by_user', (q) => q.eq('userId', me))
      .collect();

    const cards = [];
    for (const row of rows) {
      cards.push(await fetchFriendCard(ctx, row.friendId, today));
    }
    return cards;
  },
});

export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { incoming: [], outgoing: [] };
    const me = identity.subject;

    const incomingRaw = await ctx.db
      .query('friend_requests')
      .withIndex('by_to', (q) => q.eq('toUserId', me))
      .collect();
    const outgoingRaw = await ctx.db
      .query('friend_requests')
      .withIndex('by_from', (q) => q.eq('fromUserId', me))
      .collect();

    const incoming = [];
    for (const r of incomingRaw) {
      const username = await ctx.db
        .query('usernames')
        .withIndex('by_user', (q) => q.eq('userId', r.fromUserId))
        .first();
      incoming.push({
        fromUserId: r.fromUserId,
        username: username?.username ?? null,
        displayName: username?.displayName ?? 'Someone',
        createdAt: r.createdAt,
      });
    }

    const outgoing = [];
    for (const r of outgoingRaw) {
      const username = await ctx.db
        .query('usernames')
        .withIndex('by_user', (q) => q.eq('userId', r.toUserId))
        .first();
      outgoing.push({
        toUserId: r.toUserId,
        username: username?.username ?? null,
        displayName: username?.displayName ?? 'Someone',
        createdAt: r.createdAt,
      });
    }

    return { incoming, outgoing };
  },
});
