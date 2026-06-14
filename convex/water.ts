import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

const DEFAULT_GOAL_ML = 2500;

// ─── getWaterForDay ──────────────────────────────────────────────────────────

export const getWaterForDay = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return await ctx.db
      .query('water_logs')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
      .order('asc')
      .collect();
  },
});

// ─── logWater ────────────────────────────────────────────────────────────────

export const logWater = mutation({
  args: { date: v.string(), amountMl: v.number() },
  handler: async (ctx, { date, amountMl }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    await ctx.db.insert('water_logs', {
      userId,
      date,
      amountMl,
      loggedAt: new Date().toISOString(),
    });

    // Compute new total for the day.
    const allEntries = await ctx.db
      .query('water_logs')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
      .collect();
    const total = allEntries.reduce((s, e) => s + e.amountMl, 0);

    // Auto-mark the water task done in daily_logs if goal is reached.
    const prefs = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    const goal = prefs?.waterGoalMl ?? DEFAULT_GOAL_ML;

    if (total >= goal) {
      const log = await ctx.db
        .query('daily_logs')
        .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
        .first();
      if (log && !log.completions['water']) {
        await ctx.db.patch(log._id, {
          completions: { ...log.completions, water: new Date().toISOString() },
        });
      }
    }

    return total;
  },
});

// ─── deleteWaterEntry ────────────────────────────────────────────────────────

export const deleteWaterEntry = mutation({
  args: { entryId: v.id('water_logs') },
  handler: async (ctx, { entryId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const userId = identity.subject;

    const entry = await ctx.db.get(entryId);
    if (!entry || entry.userId !== userId) throw new ConvexError('Not found');

    const date = entry.date;
    await ctx.db.delete(entryId);

    // Compute remaining total.
    const remaining = await ctx.db
      .query('water_logs')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
      .collect();
    const total = remaining.reduce((s, e) => s + e.amountMl, 0);

    const prefs = await ctx.db
      .query('user_preferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    const goal = prefs?.waterGoalMl ?? DEFAULT_GOAL_ML;

    // Remove water from completions if total dropped below goal.
    if (total < goal) {
      const log = await ctx.db
        .query('daily_logs')
        .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
        .first();
      if (log && 'water' in log.completions) {
        const completions = { ...log.completions };
        delete completions['water'];
        await ctx.db.patch(log._id, { completions });
      }
    }

    return total;
  },
});
