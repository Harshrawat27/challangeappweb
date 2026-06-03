'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? 'Invalid email or password.');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <main className='flex flex-1 items-center justify-center px-6 py-12'>
      <div className='w-full max-w-sm'>
        <div className='mb-10'>
          <p
            className='text-[11px] tracking-[0.25em] text-dim mb-3'
            style={{ fontFamily: 'var(--font-manrope)' }}>
            75 / HARD
          </p>
          <h1
            className='text-4xl font-extrabold tracking-tight leading-none mb-3'
            style={{ fontFamily: 'var(--font-bricolage)' }}>
            Welcome back.
          </h1>
          <p className='text-sm text-dim leading-relaxed'>
            Pick up where you left off.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <Field
            label='Email'
            type='email'
            value={email}
            onChange={setEmail}
            placeholder='you@email.com'
            autoComplete='email'
            required
          />
          <Field
            label='Password'
            type='password'
            value={password}
            onChange={setPassword}
            placeholder='Your password'
            autoComplete='current-password'
            required
          />

          {error && (
            <div className='rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-[13px] text-red-600 dark:text-red-400'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full h-12 rounded-full bg-foreground text-background font-semibold text-[15px] hover:opacity-90 active:opacity-80 disabled:opacity-50 transition'
            style={{ fontFamily: 'var(--font-manrope)' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className='text-center text-sm text-dim mt-8'>
          New here?{' '}
          <Link
            href='/signup'
            className='text-foreground font-semibold underline-offset-4 hover:underline'>
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className='block'>
      <span
        className='block text-[11px] tracking-[0.18em] uppercase text-dim mb-2 font-medium'
        style={{ fontFamily: 'var(--font-manrope)' }}>
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full h-12 rounded-xl bg-card border border-[color:var(--border)] px-4 text-[15px] text-foreground placeholder:text-dim focus:outline-none focus:border-foreground transition'
        style={{ fontFamily: 'var(--font-manrope)' }}
      />
    </label>
  );
}
