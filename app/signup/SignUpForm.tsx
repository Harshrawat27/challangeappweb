'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? 'Could not create account.');
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
            Create account.
          </h1>
          <p className='text-sm text-dim leading-relaxed'>
            Start your 75 day journey. No skipping.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <Field
            label='Name'
            type='text'
            value={name}
            onChange={setName}
            placeholder='Your name'
            autoComplete='name'
            required
          />
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
            placeholder='At least 8 characters'
            autoComplete='new-password'
            minLength={8}
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
            {loading ? 'Creating account…' : 'Continue'}
          </button>
        </form>

        <p className='text-center text-sm text-dim mt-8'>
          Already have an account?{' '}
          <Link
            href='/signin'
            className='text-foreground font-semibold underline-offset-4 hover:underline'>
            Sign in
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
