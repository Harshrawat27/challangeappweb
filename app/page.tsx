import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import { SignOutButton } from '@/components/SignOutButton';

export default async function Home() {
  const authed = await isAuthenticated();
  if (!authed) redirect('/signup');

  return (
    <main className='flex flex-1 items-center justify-center px-6'>
      <div className='w-full max-w-md text-center'>
        <p
          className='text-[11px] tracking-[0.25em] text-dim mb-3'
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          WELCOME TO 75/HARD
        </p>
        <h1
          className='text-5xl font-extrabold tracking-tight text-foreground mb-4'
          style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          You&apos;re in.
        </h1>
        <p className='text-dim mb-10'>
          Open the mobile app to start logging today&apos;s tasks.
        </p>
        <SignOutButton />
      </div>
    </main>
  );
}
