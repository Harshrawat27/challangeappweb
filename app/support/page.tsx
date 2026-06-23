import type { Metadata } from 'next';
import SupportPage from '@/components/SupportPage';

export const metadata: Metadata = {
  title: 'Support — Hardpact',
  description: 'Get help with Hardpact. FAQs, contact info, and everything you need.',
};

export default function Support() {
  return <SupportPage />;
}
