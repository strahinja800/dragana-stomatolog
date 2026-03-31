'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function LanguageSwitcher({
  className,
  variant = 'dark',
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
    <div
      className={cn('flex items-center gap-1', className)}
      aria-label={t('ariaLabel')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleSwitch(loc)}
          disabled={isPending}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold tracking-wider transition-colors',
            variant === 'dark'
              ? locale === loc
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
              : locale === loc
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
