'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn } from '@/constants/icons';
import { authClient } from '@/lib/auth-client';

import { UserMenuDesktop } from './user-menu-desktop';
import { UserMenuMobile } from './user-menu-mobile';

export default function UserMenu() {
  const t = useTranslations('userMenu');
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full bg-white/25" />;
  }

  if (!session?.user) {
    return (
      <Button
        asChild
        variant="outline"
        className="gap-2 border-white/30 bg-white/10 text-primary-foreground shadow-[0_8px_20px_-14px_rgba(0,0,0,0.48)] hover:border-accent/60 hover:bg-white/16 hover:text-white"
      >
        <Link href="/login">
          <LogIn className="size-4" />
          {t('login')}
        </Link>
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
    name: session.user.name || t('defaultUser'),
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
