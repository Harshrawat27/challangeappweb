import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Hardpact',
  description: 'How Hardpact collects, uses, and protects your personal information.',
};

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: `Hardpact ("we," "our," or "us") is the developer and operator of the Hardpact mobile application ("App"). This Privacy Policy explains how we collect, use, disclose, and protect information when you use our App.

By downloading or using the App, you agree to the practices described in this policy. If you do not agree, please do not use the App.`,
  },
  {
    title: '2. Information We Collect',
    body: `**Account information.** When you create an account, we collect your name, email address, and password (stored securely in hashed form).

**Profile data.** You may optionally provide a username and profile photo.

**Challenge and activity data.** We collect data you enter while using the App — daily task completions, challenge progress, water intake logs, meal photos, journal entries, and progress photos.

**Usage data.** We automatically collect information about how you interact with the App, including features used, session duration, and crash reports.

**Device information.** We collect device type, operating system version, and a device identifier to provide and improve the App.

**Purchase data.** Subscription purchases are processed by Apple (App Store) or Google (Google Play). We receive confirmation of your subscription status but do not store your payment card details.`,
  },
  {
    title: '3. How We Use Your Information',
    body: `We use the information we collect to:

- Provide, maintain, and improve the App and its features
- Authenticate your account and keep it secure
- Sync your data across devices
- Process and verify your active subscription
- Send you account-related notifications (e.g., reminders you configure)
- Respond to support requests
- Analyze usage patterns to improve the product
- Comply with legal obligations`,
  },
  {
    title: '4. How We Share Your Information',
    body: `We do not sell your personal data. We share information only in limited circumstances:

**Service providers.** We use trusted third-party providers to operate the App (database hosting, cloud storage, analytics). These providers are contractually bound to handle your data securely and only for the purposes we specify.

**Friends and accountability partners.** If you use the social features and connect with friends inside the App, your username, profile photo, and daily check-in status (tasks completed for the day) will be visible to your connected friends. No other data is shared with other users.

**Legal compliance.** We may disclose information if required by law, court order, or to protect the rights, property, or safety of Hardpact, our users, or the public.

**Business transfers.** If Hardpact is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction. We will notify you before your data becomes subject to a materially different privacy policy.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your data for as long as your account is active or as needed to provide the App. If you delete your account, we will delete your personal data within 30 days, except where we are required by law to retain it longer.

Progress photos, journal entries, and activity logs are deleted along with your account. Aggregated, anonymized analytics data (which cannot identify you) may be retained indefinitely.`,
  },
  {
    title: '6. Security',
    body: `We use industry-standard security measures including encryption in transit (TLS) and at rest, access controls, and secure credential storage. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, and you use the App at your own risk.

If you suspect unauthorized access to your account, contact us immediately at hello@hardpact.com.`,
  },
  {
    title: '7. Children\'s Privacy',
    body: `The App is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will delete it promptly.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us at hello@hardpact.com.`,
  },
  {
    title: '8. Your Rights and Choices',
    body: `**Access and correction.** You can view and update your profile information at any time within the App.

**Account deletion.** You can permanently delete your account and all associated data from the Profile screen in the App. Deletion is irreversible.

**Data portability.** You may request a copy of your personal data by contacting hello@hardpact.com.

**Notification preferences.** You can manage or disable push notifications through the App's reminder settings or your device's system settings.

Depending on your location, you may have additional rights under applicable privacy laws (such as GDPR or CCPA). Please contact us to exercise any such rights.`,
  },
  {
    title: '9. Third-Party Links and Services',
    body: `The App may contain links to third-party websites (such as our Privacy Policy or Terms pages hosted externally). We are not responsible for the privacy practices of those websites. We encourage you to review their privacy policies before providing any information.`,
  },
  {
    title: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by updating the "Last updated" date at the top of this page and, where required, by sending a notification through the App or by email.

Your continued use of the App after changes take effect constitutes your acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    body: `If you have questions or concerns about this Privacy Policy or how we handle your data, please contact us at:

**Email:** hello@hardpact.com
**Website:** hardpact.com`,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      label="PRIVACY POLICY"
      title="Your data. Your rules."
      subtitle="We collect what we need, protect what you share, and never sell your information. Here's exactly how it works."
      lastUpdated="June 22, 2026"
      sections={SECTIONS}
    />
  );
}
