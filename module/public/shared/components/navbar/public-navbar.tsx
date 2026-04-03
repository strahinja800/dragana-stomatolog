'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { PublicNavbarDesktop } from './public-navbar-desktop';
import { PublicNavbarMobile } from './public-navbar-mobile';
import { TopBar } from './top-bar';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <TopBar />
      <header className="border-b border-primary-strong/70 bg-primary/96 shadow-[0_14px_34px_-20px_rgba(1,111,126,0.95)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent/55" />
        <div className="container mx-auto px-4 max-lg:mx-0 max-lg:max-w-full">
          <nav className="flex h-16 items-center justify-between lg:h-18">
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
    </div>
  );
}
