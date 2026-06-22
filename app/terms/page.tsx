import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Use — Hardpact',
  description: 'The terms and conditions governing your use of the Hardpact app.',
};

const SECTIONS = [
  {
    title: '1. Agreement to Terms',
    body: `These Terms of Use ("Terms") are a legal agreement between you and Hardpact governing your access to and use of the Hardpact mobile application and any related services ("App").

By creating an account or using the App, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, do not use the App.`,
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 13 years old to use the App. By using the App, you represent that you meet this requirement.

If you are between 13 and 18 years old, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.

You must also comply with all applicable laws in your jurisdiction and with Apple App Store or Google Play terms, as applicable to how you downloaded the App.`,
  },
  {
    title: '3. Account Registration',
    body: `You must create an account to use the App. You are responsible for:

- Providing accurate and complete registration information
- Keeping your credentials confidential
- All activity that occurs under your account

You must notify us immediately at hello@hardpact.com if you suspect unauthorized access to your account. We are not liable for any loss arising from unauthorized use of your account.

You may not create more than one account, share your account, or use another user's account without permission.`,
  },
  {
    title: '4. Subscriptions and Access',
    body: `**Hardpact is a fully paid application.** There is no free version, no free tier, and no free trial period. Access to all features requires an active paid subscription.

Available plans:
- **Weekly** — $5.99 per week
- **Monthly** — $12.99 per month
- **Yearly** — $39.99 per year

Subscriptions are managed and billed through Apple App Store or Google Play. Charges are applied to your payment method on file with the respective store at the beginning of each billing period and automatically renew until cancelled.

By subscribing, you authorize the applicable store to charge your payment method on a recurring basis. Prices are in USD and may vary by region based on store exchange rates.

We reserve the right to change subscription pricing at any time. Price changes will be communicated in advance and will take effect at your next renewal.`,
  },
  {
    title: '5. Cancellation and Refunds',
    body: `You may cancel your subscription at any time through your Apple ID account settings or Google Play account settings. Cancellation takes effect at the end of the current billing period — you retain access until that date.

**Refund policy.** All purchases are final and processed by Apple or Google. We do not issue refunds directly. Refund requests must be submitted to the relevant store:

- Apple: support.apple.com/billing
- Google: play.google.com/store

We have no control over refund decisions made by Apple or Google.`,
  },
  {
    title: '6. Acceptable Use',
    body: `You agree not to use the App to:

- Violate any applicable law or regulation
- Impersonate any person or misrepresent your identity
- Upload content that is harmful, offensive, defamatory, or infringes on anyone's rights
- Attempt to gain unauthorized access to any part of the App or its infrastructure
- Reverse-engineer, decompile, or disassemble the App
- Use automated means (bots, scrapers) to access or interact with the App
- Interfere with or disrupt the App's servers or networks

We reserve the right to suspend or terminate your account for any violation of these terms.`,
  },
  {
    title: '7. User-Generated Content',
    body: `The App allows you to create and store content including journal entries, progress photos, and profile information ("User Content"). You retain ownership of your User Content.

By submitting User Content, you grant Hardpact a limited, non-exclusive, royalty-free license to store, display, and process your content solely to provide the App's features to you.

You are solely responsible for any User Content you submit. You represent that you have all necessary rights to submit it and that it does not violate any law or third-party rights.

We do not review User Content. If you encounter content from another user that you believe violates these Terms, contact us at hello@hardpact.com.`,
  },
  {
    title: '8. Intellectual Property',
    body: `The App, including its design, code, trademarks, logos, and all other content created by Hardpact, is our exclusive property and is protected by applicable intellectual property laws.

These Terms do not grant you any right, title, or interest in the App or its content beyond the limited license to use it as described. You may not reproduce, distribute, modify, create derivative works of, or commercially exploit any part of the App without our prior written consent.`,
  },
  {
    title: '9. Third-Party Services',
    body: `The App integrates with third-party services including Apple App Store, Google Play, and backend infrastructure providers. Your use of those services is subject to their own terms and privacy policies. We are not responsible for the practices of any third-party services.`,
  },
  {
    title: '10. Disclaimer of Warranties',
    body: `THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the App will be uninterrupted, error-free, or free of viruses. We do not warrant the accuracy or reliability of any content in the App.

Hardpact is a productivity and habit-tracking tool, not a medical, nutritional, or fitness advice platform. Nothing in the App constitutes professional medical or health advice. Consult a qualified professional before beginning any new fitness or diet program.`,
  },
  {
    title: '11. Limitation of Liability',
    body: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, HARDPACT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP.

OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID FOR YOUR MOST RECENT SUBSCRIPTION PERIOD.

Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.`,
  },
  {
    title: '12. Termination',
    body: `Either party may terminate these Terms at any time. You may terminate by deleting your account through the App. We may terminate or suspend your account immediately if you breach these Terms.

Upon termination, your license to use the App ceases. Any provisions of these Terms that by their nature should survive termination (including IP rights, disclaimers, limitations of liability) will do so.`,
  },
  {
    title: '13. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Hardpact is registered, without regard to its conflict of law provisions.

Any disputes arising from these Terms shall be resolved through binding arbitration or in the courts of that jurisdiction, as permitted by applicable law.`,
  },
  {
    title: '14. Changes to These Terms',
    body: `We may update these Terms at any time. When we make material changes, we will update the "Last updated" date and notify you through the App or by email where required. Your continued use of the App after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    title: '15. Contact Us',
    body: `For questions about these Terms, contact us at:

**Email:** hello@hardpact.com
**Website:** hardpact.com`,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      label="TERMS OF USE"
      title="The rules of the game."
      subtitle="Plain language about what you can expect from us and what we expect from you. Read it — it matters."
      lastUpdated="June 22, 2026"
      sections={SECTIONS}
    />
  );
}
