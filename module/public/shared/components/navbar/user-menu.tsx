'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/module/auth/lib/auth-client';

import { UserMenuDesktop } from './user-menu-desktop';
import { UserMenuMobile } from './user-menu-mobile';

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">Prijavi se</Link>
      </Button>
    );
  }
  const initials = session.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const user = {
    name: session.user.name || 'Korisnik',
    initials: initials,
    email: session.user.email || '',
    image: session.user.image,
    role: session.user.role as string | undefined,
  };

  return (
    <>
      <UserMenuDesktop user={user} onSignOut={handleSignOut} />
      <UserMenuMobile user={user} onSignOut={handleSignOut} />
    </>
  );
}
