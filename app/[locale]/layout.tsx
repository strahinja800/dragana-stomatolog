import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
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

export const metadata: Metadata = {
  title: 'DENTALHOLIST KONCEPT | Premium Stomatološka Ordinacija',
  description:
    'Premium holistički pristup stomatologiji. Online zakazivanje, podsetnici i savremena nega osmeha.',
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
