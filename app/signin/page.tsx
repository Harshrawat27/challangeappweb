import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import { SignInForm } from './SignInForm';

export default async function SignInPage() {
  const authed = await isAuthenticated();
  if (authed) redirect('/');
  return <SignInForm />;
}
