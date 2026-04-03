import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LayoutDashboard, LogOut, User } from '@/constants/icons';
import { cn } from '@/lib/utils';

type UserMenuDesktopProps = {
  user: {
    name: string;
    initials: string;
    email: string;
    image?: string | null;
    role?: string;
  };
  onSignOut: () => void;
};

export function UserMenuDesktop({ user, onSignOut }: UserMenuDesktopProps) {
  const t = useTranslations('userMenu');
  const firstName = user.name.split(' ')[0];
  const initials = user.initials;
  const isAdmin = user.role === 'admin';
  const dashboardHref = isAdmin ? '/admin' : '/profile';
  const dashboardLabel = isAdmin ? t('adminPanel') : t('myProfile');
  const dashboardDescription = isAdmin
    ? t('adminDescription')
    : t('profileDescription');

  return (
    <div className="hidden lg:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'group flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2',
              'bg-white/8 hover:bg-white/14',
              'text-white/90',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent'
            )}
          >
            <Avatar size="sm" className="ring-1 ring-white/30">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-accent text-foreground text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-20 truncate text-xs font-medium">
              {firstName}
            </span>
            <ChevronDown className="size-3 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-52 p-1">
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar size="sm" className="ring-1 ring-primary/20">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 rounded-md px-2 py-1.5"
          >
            <Link href={dashboardHref}>
              {isAdmin ? (
                <LayoutDashboard className="size-4 text-primary" />
              ) : (
                <User className="size-4 text-primary" />
              )}
              <span className="text-sm">{dashboardLabel}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={onSignOut}
            className="cursor-pointer gap-2 rounded-md px-2 py-1.5"
          >
            <LogOut className="size-4 text-muted-foreground" />
            <span className="text-sm">{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
