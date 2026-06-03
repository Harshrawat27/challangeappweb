import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import { SignUpForm } from './SignUpForm';

export default async function SignUpPage() {
  const authed = await isAuthenticated();
  if (authed) redirect('/');
  return <SignUpForm />;
}
