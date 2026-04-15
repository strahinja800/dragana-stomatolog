'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from '@/constants/icons';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LOCALE_META: Record<string, { flag: string; label: string }> = {
  sr: { flag: '🇷🇸', label: 'Srpski' },
  en: { flag: '🇬🇧', label: 'English' },
};

type LanguageSwitcherProps = {
  compact?: boolean;
  fullLabel?: boolean;
  className?: string;
};

export function LanguageSwitcher({
  compact,
  fullLabel,
  className,
}: LanguageSwitcherProps) {
  const t = useTranslations('languageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (nextLocale: string) => {
    if (nextLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    startTransition(() => {
      router.replace(segments.join('/'));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(
          'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs transition-colors',
          'text-white/90 hover:text-white',
          'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent',
          className
        )}
        aria-label={t('ariaLabel')}
      >
        <Globe className="size-3.5" />
        {!compact && (
          <span className="font-medium">
            {fullLabel ? (LOCALE_META[locale]?.label ?? locale.toUpperCase()) : locale.toUpperCase()}
          </span>
        )}
        <ChevronDown className={cn('size-3 opacity-60', fullLabel && 'ml-auto')} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6} className="min-w-32.5">
        {routing.locales.map((loc) => {
          const meta = LOCALE_META[loc];
          const isActive = loc === locale;

          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleSwitch(loc)}
              className={cn(
                'gap-2.5 cursor-pointer',
                isActive && 'bg-primary/10 text-primary font-semibold'
              )}
            >
              <span className="text-base">{meta?.flag}</span>
              <span className="text-sm">{meta?.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
