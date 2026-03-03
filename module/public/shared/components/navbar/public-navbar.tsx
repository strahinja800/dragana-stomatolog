'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { PublicNavbarDesktop } from './public-navbar-desktop';
import { PublicNavbarMobile } from './public-navbar-mobile';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-strong/70 bg-primary/96 shadow-[0_14px_34px_-20px_rgba(1,111,126,0.95)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent/55" />
      <div className="container mx-auto px-4 max-lg:m-0 max-lg:max-w-full">
        <nav className="flex h-20 items-center justify-between">
          <PublicNavbarDesktop pathname={pathname} />
          <PublicNavbarMobile
            pathname={pathname}
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
