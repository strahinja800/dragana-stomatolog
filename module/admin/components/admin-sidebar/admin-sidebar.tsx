'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CalendarClock,
  FileText,
  FolderHeart,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authClient } from '@/module/auth/lib/auth-client';

const navItems = [
  {
    label: 'Kontrolna tabla',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Termini',
    href: '/admin/termini',
    icon: CalendarClock,
  },
  {
    label: 'Korisnici',
    href: '/admin/korisnici',
    icon: Users,
  },
  {
    label: 'Kartoni',
    href: '/admin/kartoni',
    icon: FolderHeart,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Podešavanja',
    href: '/admin/podesavanja',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="bg-card border-border/50 fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r lg:flex">
      {/* Logo */}
      <div className="border-border/50 flex h-16 items-center gap-3 border-b px-6">
        <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
          <Stethoscope className="text-primary size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">DentalCare</span>
          <span className="text-muted-foreground text-xs">Admin Panel</span>
        </div>
      </div>

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
    </aside>
  );
}
