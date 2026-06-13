import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getNoteForDay = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('day_notes')
      .withIndex('by_user_date', (q) =>
        q.eq('userId', identity.subject).eq('date', date),
      )
      .first();
  },
});

export const setNote = mutation({
  args: { date: v.string(), note: v.string() },
  handler: async (ctx, { date, note }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const existing = await ctx.db
      .query('day_notes')
      .withIndex('by_user_date', (q) =>
        q.eq('userId', identity.subject).eq('date', date),
      )
      .first();
    const updatedAt = new Date().toISOString();
    if (existing) {
      await ctx.db.patch(existing._id, { note, updatedAt });
    } else {
      await ctx.db.insert('day_notes', {
        userId: identity.subject,
        date,
        note,
        updatedAt,
      });
    }
  },
});
