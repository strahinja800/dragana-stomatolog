'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ExternalLink, LogOut, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ADMIN_ACTIONS,
  ADMIN_BRAND,
  ADMIN_NAV_ITEMS,
} from '@/constants/admin-navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border/50 bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Stethoscope className="size-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{ADMIN_BRAND.name}</span>
          <span className="text-xs text-muted-foreground">
            {ADMIN_BRAND.subtitle}
          </span>
        </div>
      </div>

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
      <div className="border-t border-border/50 p-4 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <ExternalLink className="size-5" />
            {ADMIN_ACTIONS.backToSite}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="size-5" />
          {ADMIN_ACTIONS.signOut}
        </Button>
      </div>
    </aside>
  );
}
