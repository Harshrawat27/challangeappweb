import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

// ─── toggleTask ─────────────────────────────────────────────────────────────
// Idempotent toggle of a single task on a given date.
// - The client passes its OWN local-date string so timezone math stays correct.
// - Only TODAY is allowed to be mutated. Server enforces this so past days
//   can't be edited even if a client tries.

export const toggleTask = mutation({
  args: {
    date: v.string(),                  // YYYY-MM-DD (must equal user-local today)
    taskId: v.string(),
    allTaskIds: v.array(v.string()),   // snapshot of the full task list for this day
    todayLocal: v.string(),            // YYYY-MM-DD — what the client thinks "today" is
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    if (args.date !== args.todayLocal) {
      // Past or future date — disallowed. The client should never trigger this.
      throw new ConvexError('Only today can be toggled.');
    }

    // Pull user prefs for the challenge start date so we can stamp challengeDay.
    const prefs = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    let challengeDay = 1;
    if (prefs?.challengeStartDate) {
      const [sy, sm, sd] = prefs.challengeStartDate.split('-').map(Number);
      const [ty, tm, td] = args.date.split('-').map(Number);
      const start = Date.UTC(sy, (sm ?? 1) - 1, sd ?? 1);
      const today = Date.UTC(ty, (tm ?? 1) - 1, td ?? 1);
      challengeDay = Math.max(1, Math.floor((today - start) / 86_400_000) + 1);
    }

    const existing = await ctx.db
      .query('daily_logs')
      .withIndex('by_user_date', (q) =>
        q.eq('userId', userId).eq('date', args.date),
      )
      .first();

    const now = new Date().toISOString();

    if (!existing) {
      return await ctx.db.insert('daily_logs', {
        userId,
        date: args.date,
        challengeDay,
        allTaskIds: args.allTaskIds,
        completions: { [args.taskId]: now },
      });
    }

    // Toggle the task in the existing completions map.
    const nextCompletions: Record<string, string> = { ...existing.completions };
    if (args.taskId in nextCompletions) {
      delete nextCompletions[args.taskId];
    } else {
      nextCompletions[args.taskId] = now;
    }

    await ctx.db.patch(existing._id, {
      allTaskIds: args.allTaskIds,
      completions: nextCompletions,
    });
    return existing._id;
  },
});

// ─── getDay ─────────────────────────────────────────────────────────────────

export const getDay = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;

    return await ctx.db
      .query('daily_logs')
      .withIndex('by_user_date', (q) =>
        q.eq('userId', userId).eq('date', args.date),
      )
      .first();
  },
});

// ─── getRange ───────────────────────────────────────────────────────────────
// Inclusive on both bounds. Used by the day strip + journey view.

export const getRange = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    return await ctx.db
      .query('daily_logs')
      .withIndex('by_user_date', (q) =>
        q.eq('userId', userId).gte('date', args.from).lte('date', args.to),
      )
      .collect();
  },
});
