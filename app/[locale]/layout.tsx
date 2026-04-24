import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { buildOgImages, OG_IMAGE, SITE_URL } from '@/lib/seo';
import { TRPCReactProvider } from '@/trpc/client';

import '@/app/globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('home.title'),
      template: `%s | ${t('siteTitle')}`,
    },
    description: t('home.description'),
    openGraph: {
      siteName: t('siteTitle'),
      images: buildOgImages(),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: [OG_IMAGE],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        suppressHydrationWarning
        className={`${manrope.variable} ${playfairDisplay.variable} bg-background text-foreground font-sans antialiased`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <NextIntlClientProvider messages={messages}>
              <Toaster />
              {children}
            </NextIntlClientProvider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
