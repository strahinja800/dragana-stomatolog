import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/client';

import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${manrope.variable} ${playfairDisplay.variable} bg-background text-foreground font-sans antialiased`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
