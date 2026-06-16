import LandingPage from '@/components/LandingPage';
import { isAuthenticated } from '@/lib/auth-server';

export default async function Home() {
  const authed = await isAuthenticated();
  return <LandingPage authed={authed} />;
}
