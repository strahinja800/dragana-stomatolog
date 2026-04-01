'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { LayoutDashboard, LogOut, User } from '@/constants/icons';

type UserMenuMobileProps = {
  user: {
    name: string;
    initials: string;
    email: string;
    image?: string | null;
    role?: string;
  };
  onSignOut: () => void;
};

export function UserMenuMobile({ user, onSignOut }: UserMenuMobileProps) {
  const t = useTranslations('userMenu');
  const [open, setOpen] = useState(false);

  const initials = user.initials;
  const isAdmin = user.role === 'admin';
  const dashboardHref = isAdmin ? '/admin' : '/profile';
  const dashboardLabel = isAdmin ? t('adminPanel') : t('profile');

  const handleSignOut = () => {
    setOpen(false);
    onSignOut();
  };

  return (
    <div className="lg:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="rounded-full focus:outline-none focus:ring-1 focus:ring-accent">
            <Avatar size="sm" className="ring-1 ring-white/30">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-accent text-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="ring-2 ring-primary/20">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <DrawerTitle>{user.name}</DrawerTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4">
            <DrawerClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href={dashboardHref}>
                  {isAdmin ? (
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  {dashboardLabel}
                </Link>
              </Button>
            </DrawerClose>
            <div className="my-2 h-px bg-border" />
            <Button
              variant="ghost"
              className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
