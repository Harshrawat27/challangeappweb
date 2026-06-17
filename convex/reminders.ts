import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

const REMINDER_TYPE = v.union(
  v.literal('daily'),
  v.literal('twice_daily'),
  v.literal('thrice_daily'),
  v.literal('every_x_hours'),
  v.literal('weekly'),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query('reminders')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();
  },
});

export const create = mutation({
  args: {
    label: v.string(),
    type: REMINDER_TYPE,
    times: v.array(v.string()),
    intervalHours: v.optional(v.number()),
    intervalStart: v.optional(v.string()),
    intervalEnd: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    return ctx.db.insert('reminders', {
      userId: identity.subject,
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('reminders'),
    label: v.optional(v.string()),
    type: v.optional(REMINDER_TYPE),
    times: v.optional(v.array(v.string())),
    intervalHours: v.optional(v.number()),
    intervalStart: v.optional(v.string()),
    intervalEnd: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const row = await ctx.db.get(id);
    if (!row || row.userId !== identity.subject) throw new ConvexError('Not found');
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v;
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id('reminders') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthenticated');
    const row = await ctx.db.get(id);
    if (!row || row.userId !== identity.subject) throw new ConvexError('Not found');
    await ctx.db.delete(id);
  },
});
