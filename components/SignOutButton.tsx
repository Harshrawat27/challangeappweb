'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await authClient.signOut();
        router.push('/signup');
        router.refresh();
      }}
      disabled={loading}
      className='inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-card px-5 h-11 text-sm font-medium hover:opacity-80 disabled:opacity-50 transition'
      style={{ fontFamily: 'var(--font-manrope)' }}>
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
