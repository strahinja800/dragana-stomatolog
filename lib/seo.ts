import type { Metadata } from 'next';

import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://dentalholist.rs';

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}/${locale}${path === '/' ? '' : path}`;
}

export function buildAlternates(
  locale: Locale,
  path: string
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(loc, path);
  }
  languages['x-default'] = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}
