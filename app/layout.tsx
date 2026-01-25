import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { TRPCClientProvider } from '@/components/providers/trpc-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stomatološka ordinacija',
  description: 'Stomatološka ordinacija',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${geistSans}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCClientProvider>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </TRPCClientProvider>
      </body>
    </html>
  );
}
