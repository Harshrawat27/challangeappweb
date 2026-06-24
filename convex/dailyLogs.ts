import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

// ─── tapTask ─────────────────────────────────────────────────────────────────
// Adds or removes one tap for a task on a given date.
// action='add'    → push a timestamp into completions[taskId]
// action='remove' → pop the last timestamp from completions[taskId]
// Only TODAY is allowed to be mutated. Server enforces this so past days
// can't be edited even if a client tries.

export const tapTask = mutation({
  args: {
    date: v.string(),                                        // YYYY-MM-DD (must equal user-local today)
    taskId: v.string(),
    allTaskIds: v.array(v.string()),                         // snapshot of the full task list
    taskCounts: v.optional(v.record(v.string(), v.number())), // required taps per task
    todayLocal: v.string(),                                  // YYYY-MM-DD — what the client thinks "today" is
    action: v.union(v.literal('add'), v.literal('remove')), // add one tap or remove last tap
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    if (args.date !== args.todayLocal) {
      throw new ConvexError('Only today can be mutated.');
    }

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
      const completions: Record<string, string[]> = {};
      if (args.action === 'add') completions[args.taskId] = [now];
      return await ctx.db.insert('daily_logs', {
        userId,
        date: args.date,
        challengeDay,
        allTaskIds: args.allTaskIds,
        taskCounts: args.taskCounts,
        completions,
      });
    }

    const nextCompletions: Record<string, string[]> = { ...existing.completions };
    const current = nextCompletions[args.taskId] ?? [];

    if (args.action === 'add') {
      nextCompletions[args.taskId] = [...current, now];
    } else {
      if (current.length > 0) {
        nextCompletions[args.taskId] = current.slice(0, -1);
      }
    }

    await ctx.db.patch(existing._id, {
      allTaskIds: args.allTaskIds,
      taskCounts: args.taskCounts,
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
