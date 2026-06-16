import { httpAction, httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { authComponent, createAuth } from './betterAuth/auth';

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// ─── RevenueCat webhook ──────────────────────────────────────────────────────
// RevenueCat sends this on every subscription lifecycle event.
// Set Authorization header in RC dashboard → Platform Settings → Webhooks.
// Store the same secret as REVENUECAT_WEBHOOK_SECRET in Convex env.

type RCStatus = 'weekly' | 'monthly' | 'yearly' | 'expired';

const ACTIVE_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
]);
const INACTIVE_EVENTS = new Set(['EXPIRATION', 'CANCELLATION', 'BILLING_ISSUE']);

function productToStatus(productId: string): RCStatus {
  const id = productId.toLowerCase();
  if (id.includes('weekly')) return 'weekly';
  if (id.includes('monthly')) return 'monthly';
  if (id.includes('yearly') || id.includes('annual')) return 'yearly';
  return 'monthly'; // safe fallback for unrecognised product ids
}

http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify shared secret
    const auth = request.headers.get('Authorization');
    if (!auth || auth !== process.env.REVENUECAT_WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    const event = body.event as Record<string, unknown> | undefined;
    if (!event) return new Response('OK', { status: 200 });

    const eventType = event.type as string;
    const userId = event.app_user_id as string;
    const productId = (event.product_id as string | undefined) ?? '';

    let status: RCStatus | null = null;

    if (ACTIVE_EVENTS.has(eventType)) {
      status = productToStatus(productId);
    } else if (INACTIVE_EVENTS.has(eventType)) {
      status = 'expired';
    }

    if (status && userId) {
      await ctx.runMutation(internal.userPreferences.updateSubscriptionStatus, {
        userId,
        status,
      });
    }

    return new Response('OK', { status: 200 });
  }),
});

export default http;
