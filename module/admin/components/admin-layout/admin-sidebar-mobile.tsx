'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  FileText,
  FolderHeart,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Kontrolna tabla',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Korisnici',
    href: '/admin/korisnici',
    icon: Users,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Kartoni',
    href: '/admin/kartoni',
    icon: FolderHeart,
  },
];

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
        <SheetHeader className="border-border/50 flex h-16 flex-row items-center gap-3 space-y-0 border-b px-6">
          <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
            <Stethoscope className="text-primary size-5" />
          </div>
          <div className="flex flex-col gap-0">
            <SheetTitle className="text-sm font-semibold">
              DentalCare
            </SheetTitle>
            <SheetDescription className="text-xs">Admin Panel</SheetDescription>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
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
        <div className="border-border/50 border-t p-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="size-5" />
            Odjavi se
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
