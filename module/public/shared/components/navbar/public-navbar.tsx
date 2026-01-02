'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { PublicNavbarDesktop } from './public-navbar-desktop';
import { PublicNavbarMobile } from './public-navbar-mobile';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 max-lg:m-0 max-lg:max-w-full">
        <nav className="flex items-center justify-between h-16">
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
