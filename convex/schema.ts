import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  user_preferences: defineTable({
    userId: v.string(),                  // Better Auth subject

    // Identity
    name: v.string(),                    // captured in onboarding S2

    // Challenge selection
    challenge: v.string(),               // ChallengeId: '75-hard' | '75-medium' | '75-soft' | 'monk-mode' | 'custom'
    challengeLength: v.number(),         // total days (7..180)
    challengeStartDate: v.string(),      // YYYY-MM-DD (user's local date at onboarding completion)
    customHabits: v.array(v.string()),   // free-form habits the user added on S5

    // Psychographics
    whyMotivations: v.array(v.string()), // S6 selections
    pastFailures: v.array(v.string()),   // S7 selections
    seriousness: v.number(),             // S8: 1-10

    // Social + reminders
    partnerInvited: v.boolean(),         // S12
    reminderTimes: v.object({            // S13
      morning: v.string(),               // HH:MM
      afternoon: v.string(),
      evening: v.string(),
    }),

    // Water tracking
    weightKg: v.optional(v.number()),    // used to pre-calculate water goal
    waterGoalMl: v.optional(v.number()), // daily water target in ml (default 2500)

    // Subscription — mirrored from RevenueCat via webhook. Source of truth is RC.
    subscriptionStatus: v.optional(v.union(
      v.literal('weekly'),
      v.literal('monthly'),
      v.literal('yearly'),
      v.literal('expired'),
    )),
    // How the subscription was acquired on this account.
    // 'direct'      → purchased on this account
    // 'restored'    → restored by the same Apple ID on a new device
    // 'transferred' → restored by a different account (shared/transferred purchase)
    subscriptionSource: v.optional(v.union(
      v.literal('direct'),
      v.literal('restored'),
      v.literal('transferred'),
    )),

    // Profile picture — Convex storage ID
    profilePictureId: v.optional(v.id('_storage')),

    // Meta
    onboardingCompletedAt: v.string(),   // ISO timestamp
  }).index('by_user', ['userId']),

  // One row per (user, date). Records which tasks were checked off that day
  // and when. Past rows are immutable from a UI standpoint — only today's row
  // is ever mutated.
  daily_logs: defineTable({
    userId: v.string(),                                   // Better Auth subject
    date: v.string(),                                     // YYYY-MM-DD (user-local)
    challengeDay: v.number(),                             // day 1..N of the user's challenge
    allTaskIds: v.array(v.string()),                      // snapshot of the day's task list
    completions: v.record(v.string(), v.string()),        // taskId → ISO timestamp of latest check
  })
    .index('by_user_date', ['userId', 'date'])
    .index('by_user', ['userId']),

  // Username claim — one row per user. Claimed once during onboarding.
  // Lookup key is lowercased; original casing kept for display.
  usernames: defineTable({
    userId: v.string(),
    username: v.string(),       // lowercase, the lookup key
    displayName: v.string(),    // case-preserved (what the user typed)
    setAt: v.string(),          // ISO timestamp
  })
    .index('by_user', ['userId'])
    .index('by_username', ['username']),

  // Accepted friendship — denormalized: when A & B become friends, TWO rows
  // are written, (A, B) and (B, A). Makes "list my friends" a single lookup.
  friendships: defineTable({
    userId: v.string(),
    friendId: v.string(),
    createdAt: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_pair', ['userId', 'friendId']),

  // One row per meal scanned by the user on a given day.
  meals: defineTable({
    userId: v.string(),
    date: v.string(),           // YYYY-MM-DD (user-local)
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    scannedAt: v.string(),      // ISO timestamp
  })
    .index('by_user_date', ['userId', 'date'])
    .index('by_user', ['userId']),

  // One note per user per day. Written from the day-journal modal.
  day_notes: defineTable({
    userId: v.string(),
    date: v.string(),           // YYYY-MM-DD (user-local)
    note: v.string(),
    updatedAt: v.string(),      // ISO timestamp
  })
    .index('by_user_date', ['userId', 'date']),

  // One entry per drink logged by the user on a given day.
  water_logs: defineTable({
    userId: v.string(),
    date: v.string(),       // YYYY-MM-DD (user-local)
    amountMl: v.number(),
    loggedAt: v.string(),   // ISO timestamp
  })
    .index('by_user_date', ['userId', 'date'])
    .index('by_user', ['userId']),

  // One row per challenge run the user has completed or abandoned.
  // Written when the user switches to a new challenge.
  challenge_history: defineTable({
    userId: v.string(),
    challenge: v.string(),          // ChallengeId
    challengeLength: v.number(),    // intended length in days
    challengeStartDate: v.string(), // YYYY-MM-DD
    endedAt: v.string(),            // YYYY-MM-DD (day they switched away)
    daysLogged: v.number(),         // daily_logs entries within the window
    status: v.union(v.literal('completed'), v.literal('abandoned')),
  }).index('by_user', ['userId']),

  // Custom reminders created by the user after onboarding.
  reminders: defineTable({
    userId: v.string(),
    label: v.string(),
    type: v.union(
      v.literal('daily'),        // once a day
      v.literal('twice_daily'),  // two fixed times
      v.literal('thrice_daily'), // three fixed times
      v.literal('every_x_hours'),// interval between start and end
      v.literal('weekly'),       // specific days of week
    ),
    times: v.array(v.string()),            // HH:MM strings
    intervalHours: v.optional(v.number()), // 1|2|3|4|6|8|12
    intervalStart: v.optional(v.string()), // HH:MM
    intervalEnd: v.optional(v.string()),   // HH:MM
    daysOfWeek: v.optional(v.array(v.number())), // 0=Sun..6=Sat
    isActive: v.boolean(),
    createdAt: v.string(),
  }).index('by_user', ['userId']),

  // Pending requests. Removed on accept/decline.
  friend_requests: defineTable({
    fromUserId: v.string(),
    toUserId: v.string(),
    createdAt: v.string(),
  })
    .index('by_to', ['toUserId'])
    .index('by_from', ['fromUserId'])
    .index('by_pair', ['fromUserId', 'toUserId']),
});
