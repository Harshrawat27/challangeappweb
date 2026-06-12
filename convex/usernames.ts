import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

// ─── Validation ─────────────────────────────────────────────────────────────

const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/;

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function isValid(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

// ─── isAvailable (public — used by the live-check on the username screen) ──

export const isAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const u = normalize(username);
    if (!isValid(u)) return { ok: false, reason: 'invalid' as const };

    const existing = await ctx.db
      .query('usernames')
      .withIndex('by_username', (q) => q.eq('username', u))
      .first();
    if (existing) return { ok: false, reason: 'taken' as const };

    return { ok: true as const };
  },
});

// ─── getMine ────────────────────────────────────────────────────────────────

export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('usernames')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();
  },
});

// ─── claim ──────────────────────────────────────────────────────────────────
// Called once after Better Auth signup. Inserts the username row keyed to the
// just-created user. Throws on race condition so the client can retry with a
// different username.

export const claim = mutation({
  args: { username: v.string(), displayName: v.string() },
  handler: async (ctx, { username, displayName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const u = normalize(username);
    if (!isValid(u)) throw new ConvexError('Invalid username');

    // If this user already claimed one, no-op (returns existing).
    const existingForUser = await ctx.db
      .query('usernames')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (existingForUser) return existingForUser._id;

    // Race-check
    const taken = await ctx.db
      .query('usernames')
      .withIndex('by_username', (q) => q.eq('username', u))
      .first();
    if (taken) throw new ConvexError('Username was just taken');

    return await ctx.db.insert('usernames', {
      userId,
      username: u,
      displayName: displayName.trim() || u,
      setAt: new Date().toISOString(),
    });
  },
});

// ─── searchByUsername (public lite-profile lookup) ─────────────────────────
// Returns a minimal profile suitable for the friend-search screen. Does NOT
// expose userId for unauth'd callers — only for signed-in users.

export const searchByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const u = normalize(username);
    if (!isValid(u)) return null;

    const identity = await ctx.auth.getUserIdentity();
    const callerId = identity?.subject ?? null;

    const row = await ctx.db
      .query('usernames')
      .withIndex('by_username', (q) => q.eq('username', u))
      .first();
    if (!row) return null;

    if (callerId && row.userId === callerId) {
      return { self: true as const, username: row.username, displayName: row.displayName };
    }

    const prefs = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', row.userId))
      .first();

    return {
      self: false as const,
      userId: row.userId,
      username: row.username,
      displayName: row.displayName,
      name: prefs?.name ?? row.displayName,
      challenge: prefs?.challenge ?? null,
      challengeLength: prefs?.challengeLength ?? null,
      challengeStartDate: prefs?.challengeStartDate ?? null,
    };
  },
});
