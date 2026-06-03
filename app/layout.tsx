import type { Metadata } from 'next';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { getToken } from '@/lib/auth-server';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '75 Hard — Habit Tracker',
  description: 'Build discipline. One day at a time.',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = await getToken();
  return (
    <html lang='en' className={`${bricolage.variable} ${manrope.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <ConvexClientProvider initialToken={token}>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
