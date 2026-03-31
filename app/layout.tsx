import type { ReactNode } from 'react';

// Root layout is required for Next.js, but html/body are in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
