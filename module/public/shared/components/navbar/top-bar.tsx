'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, Mail, Phone } from '@/constants/icons';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import { UserMenuDesktop } from './user-menu-desktop';
import { UserMenuMobile } from './user-menu-mobile';

export function TopBar() {
  const t = useTranslations('userMenu');
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="bg-[#0a2e33]">
      <div className="container mx-auto flex items-center justify-between px-4 py-1.5 max-lg:mx-0 max-lg:max-w-full">
        <div className="flex items-center gap-4">
          <a
            href="tel:+381111234567"
            className="flex items-center gap-1.5 text-xs text-white/90 transition-colors hover:text-white"
          >
            <Phone className="size-3" />
            <span>+381 11 123 4567</span>
          </a>
          <a
            href="mailto:info@dentalholist.rs"
            className="hidden items-center gap-1.5 text-xs text-white/90 transition-colors hover:text-white sm:flex"
          >
            <Mail className="size-3" />
            <span>info@dentalholist.rs</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact className="lg:hidden" />
          <LanguageSwitcher className="hidden lg:flex" />

          {isPending ? (
            <Skeleton className="h-5 w-5 rounded-full bg-white/20 lg:h-6 lg:w-16" />
          ) : session?.user ? (
            <AuthenticatedMenu session={session} onSignOut={handleSignOut} />
          ) : (
            <UnauthenticatedLogin label={t('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

function AuthenticatedMenu({
  session,
  onSignOut,
}: {
  session: {
    user: {
      name: string;
      email: string;
      image?: string | null;
      role?: string | null;
    };
  };
  onSignOut: () => void;
}) {
  const t = useTranslations('userMenu');
  const initials = session.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const user = {
    name: session.user.name || t('defaultUser'),
    initials,
    email: session.user.email || '',
    image: session.user.image,
    role: session.user.role as string | undefined,
  };

  return (
    <>
      <UserMenuDesktop user={user} onSignOut={onSignOut} />
      <UserMenuMobile user={user} onSignOut={onSignOut} />
    </>
  );
}

function UnauthenticatedLogin({ label }: { label: string }) {
  return (
    <>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
          'hidden gap-1.5 text-xs text-white/90 hover:text-white lg:flex',
          'hover:bg-white/8'
        )}
      >
        <Link href="/login">
          <LogIn className="size-3.5" />
          {label}
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="size-6 text-white/90 hover:bg-white/8 hover:text-white lg:hidden"
      >
        <Link href="/login">
          <LogIn className="size-3.5" />
        </Link>
      </Button>
    </>
  );
}
