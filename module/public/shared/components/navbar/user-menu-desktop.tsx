import Link from 'next/link';

import { ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const firstName = user.name.split(' ')[0];
  const initials = user.initials;
  const isAdmin = user.role === 'admin';
  const dashboardHref = isAdmin ? '/admin' : '/profile';
  const dashboardLabel = isAdmin ? 'Admin panel' : 'Moj profil';
  const dashboardDescription = isAdmin
    ? 'Upravljaj sajtom'
    : 'Pregledaj i uredi podatke';

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3',
              'bg-muted/50 hover:bg-muted',
              'border border-border/50 hover:border-border',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            )}
          >
            <Avatar className="ring-2 ring-background">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground max-w-24 truncate">
              {firstName}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            'w-72 p-2',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
          )}
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar size="lg" className="ring-2 ring-primary/20">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator className="my-2" />

          {/* Menu Items */}
          <DropdownMenuItem
            asChild
            className="group/item gap-3 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-accent"
          >
            <Link href={dashboardHref}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-focus/item:bg-primary/20">
                {isAdmin ? (
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{dashboardLabel}</span>
                <span className="text-xs text-muted-foreground group-focus/item:text-muted-foreground">
                  {dashboardDescription}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Sign Out */}
          <DropdownMenuItem
            onClick={onSignOut}
            className="group/logout gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted group-focus/logout:bg-primary/10">
              <LogOut className="h-4 w-4 text-muted-foreground group-focus/logout:text-primary" />
            </div>
            <span className="text-sm font-medium">Odjavi se</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
