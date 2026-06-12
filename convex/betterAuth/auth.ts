import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import type { GenericCtx } from '@convex-dev/better-auth/utils';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import type { GenericActionCtx } from 'convex/server';
import { components, internal } from '../_generated/api';
import type { DataModel } from '../_generated/dataModel';
import authConfig from '../auth.config';
import schema from './schema';

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  }
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    appName: 'Habit Tracker',
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    user: {
      deleteUser: {
        enabled: true,
        // Cascade-delete app data tied to this user before Better Auth
        // removes the user row itself. If this throws, the user is NOT
        // deleted (Better Auth's transactional behavior) — that's the
        // safer failure mode than orphaned prefs.
        beforeDelete: async (user) => {
          // The auth ctx is widened to GenericCtx for the adapter — but at the
          // moment this hook fires, we're inside an HTTP action (Better Auth's
          // delete-user route), so runMutation is available at runtime.
          await (ctx as GenericActionCtx<DataModel>).runMutation(
            internal.userPreferences.deleteByUserId,
            { userId: user.id },
          );
        },
      },
    },
    trustedOrigins: [
      'habittracker://',
      'exp://',
      'exp://*',
    ],
    plugins: [expo(), convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

// For `@better-auth/cli`
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
