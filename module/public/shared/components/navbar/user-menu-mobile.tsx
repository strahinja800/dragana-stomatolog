'use client';

import { useState } from 'react';
import Link from 'next/link';

import { LogOut, User } from 'lucide-react';

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

type UserMenuMobileProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  onSignOut: () => void;
};

export function UserMenuMobile({ user, onSignOut }: UserMenuMobileProps) {
  const [open, setOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = () => {
    setOpen(false);
    onSignOut();
  };

  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar>
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback>{initials}</AvatarFallback>
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
                <Link href="/profil">
                  <User className="mr-2 h-4 w-4" />
                  Profil
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
              Odjavi se
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
