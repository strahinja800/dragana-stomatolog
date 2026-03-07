'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Clock, Heart, Users } from '@/constants/icons';
import { cn } from '@/lib/utils';

const ABOUT_TABS = [
  {
    href: '/admin/o-nama/vrednosti',
    label: 'Vrednosti',
    shortLabel: 'Vrednosti',
    icon: Heart,
  },
  {
    href: '/admin/o-nama/istorija',
    label: 'Istorija',
    shortLabel: 'Istorija',
    icon: Clock,
  },
  {
    href: '/admin/o-nama/tim',
    label: 'Tim',
    shortLabel: 'Tim',
    icon: Users,
  },
] as const;

export function AboutNav() {
  const pathname = usePathname();

  return (
    <nav className="grid w-full max-w-xl grid-cols-3 gap-1 rounded-lg bg-muted/50 p-1">
      {ABOUT_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
