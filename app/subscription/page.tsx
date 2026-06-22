import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Subscription Terms — Hardpact',
  description: 'Everything you need to know about Hardpact pricing, billing, and cancellation.',
};

const SECTIONS = [
  {
    title: '1. Overview',
    body: `Hardpact is a premium mobile application. Every feature in the App — task tracking, water logging, meal scanning, progress photos, journals, and social challenges — requires an active paid subscription.

There is no free version and no free trial. Access begins the moment your subscription payment is processed.

These Subscription Terms supplement the Hardpact Terms of Use. By subscribing, you agree to both.`,
  },
  {
    title: '2. Available Plans',
    body: `We offer three subscription plans:

**Weekly — $5.99/week**
Full access to all features. Renews automatically every 7 days. Best for trying the app before committing long-term.

**Monthly — $12.99/month**
Full access to all features. Renews automatically every 30 days. Equivalent to $3.00/week — a significant saving over weekly.

**Yearly — $39.99/year**
Full access to all features. Renews automatically every 12 months. The best value at under $0.80/week. Ideal for anyone doing a 75-day challenge and beyond.

All prices are listed in USD. Pricing in your local currency is determined by Apple App Store or Google Play and may vary.`,
  },
  {
    title: '3. No Free Trial',
    body: `Hardpact does not offer a free trial period. Your paid subscription begins immediately upon purchase confirmation from Apple or Google.

Before subscribing, you can learn about the App's features on our website at hardpact.com and read our full Terms of Use and Privacy Policy.`,
  },
  {
    title: '4. Billing and Automatic Renewal',
    body: `Subscriptions are purchased and billed through Apple App Store or Google Play — whichever platform you used to download the App. Your payment method on file with Apple or Google will be charged at the start of each billing period.

**Automatic renewal.** Subscriptions automatically renew at the end of each billing period unless cancelled at least 24 hours before the renewal date. Renewal charges are applied within 24 hours before the period ends.

You will not receive a separate renewal notification from Hardpact — renewal reminders, if any, are handled by Apple or Google according to their policies.

We do not have access to your payment card details. All payment processing is handled by Apple or Google.`,
  },
  {
    title: '5. Managing Your Subscription',
    body: `You can view and manage your subscription directly from the Hardpact app. Go to **Profile → Subscription → Manage Subscription**, which will open your Apple or Google subscription management page.

Alternatively:

- **Apple:** Open the App Store → tap your Apple ID → Subscriptions → Hardpact
- **Google:** Open the Play Store → tap your profile → Payments & subscriptions → Subscriptions → Hardpact

Changes to your subscription (plan upgrades, downgrades, or cancellations) take effect at the end of your current billing period. You will not be charged a prorated amount for mid-period changes.`,
  },
  {
    title: '6. Cancellation',
    body: `You may cancel your subscription at any time. Cancellation stops future renewals. You will continue to have full access to the App until the end of your current paid billing period.

**Cancelling does not delete your account.** Your challenge history, journal entries, and profile remain saved. If you resubscribe later, your data will still be there.

To cancel, go to Profile → Subscription → Manage Subscription in the App, or manage it directly through Apple or Google as described in Section 5.

If you delete your account, your subscription is not automatically cancelled. You must cancel through Apple or Google separately to avoid future charges.`,
  },
  {
    title: '7. Refunds',
    body: `All subscription purchases are final. We do not offer refunds from Hardpact directly.

Refund requests are handled entirely by Apple or Google:

- **Apple:** Visit reportaproblem.apple.com or contact Apple Support
- **Google:** Visit play.google.com/store → Orders → Request a refund

We have no authority to issue, approve, or deny refunds on behalf of Apple or Google. Refund eligibility is determined solely by their policies.

If you believe you were charged in error, contact us at hello@hardpact.com and we will do our best to help clarify or escalate the situation.`,
  },
  {
    title: '8. Access After Expiry',
    body: `If your subscription expires (due to a failed payment, cancellation, or non-renewal), you will immediately lose access to all features in the App. Your data is not deleted — it is retained for 90 days in case you resubscribe.

After 90 days without an active subscription, we reserve the right to delete your account and data in accordance with our Privacy Policy.`,
  },
  {
    title: '9. Price Changes',
    body: `We reserve the right to change subscription pricing at any time. If we change the price of your active plan, we will notify you in advance through the App or by email.

For existing subscribers, price changes will apply at your next renewal after the change takes effect. If you do not agree to the new pricing, you may cancel before your next renewal date.`,
  },
  {
    title: '10. Family Sharing',
    body: `Hardpact subscriptions do not currently support Apple Family Sharing or Google Play Family Library. Each user must purchase their own individual subscription.`,
  },
  {
    title: '11. Contact Us',
    body: `For subscription-related questions or billing issues, contact us at:

**Email:** hello@hardpact.com
**Website:** hardpact.com

We aim to respond within 1–2 business days.`,
  },
];

export default function SubscriptionPage() {
  return (
    <LegalPage
      label="SUBSCRIPTION TERMS"
      title="Pricing. Billing. No surprises."
      subtitle="Hardpact is a fully paid app — no free tier, no trial. Here's exactly what you get, what you pay, and how to cancel."
      lastUpdated="June 22, 2026"
      sections={SECTIONS}
    />
  );
}
