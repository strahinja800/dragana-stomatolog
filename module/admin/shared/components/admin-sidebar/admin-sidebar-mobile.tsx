'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogOut, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  ADMIN_ACTIONS,
  ADMIN_BRAND,
  ADMIN_NAV_ITEMS,
} from '@/constants/admin-navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

interface AdminSidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebarMobile({
  isOpen,
  onClose,
}: AdminSidebarMobileProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-64 flex-col p-0">
        {/* Header */}
        <SheetHeader className="flex h-16 flex-row items-center gap-3 space-y-0 border-b border-border/50 px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <Stethoscope className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-0">
            <SheetTitle className="text-sm font-semibold">
              {ADMIN_BRAND.name}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {ADMIN_BRAND.subtitle}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'size-5 transition-transform duration-200 group-hover:scale-110',
                    isActive && 'text-primary-foreground'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="size-5" />
            {ADMIN_ACTIONS.signOut}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
