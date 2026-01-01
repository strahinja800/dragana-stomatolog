import Link from 'next/link';

import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/constants/navigations';
import { cn } from '@/lib/utils';

import UserMenu from './user-menu';

type PublicNavbarMobileProps = {
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function PublicNavbarMobile({
  pathname,
  isOpen,
  onToggle,
}: PublicNavbarMobileProps) {
  return (
    <>
      {/* Mobile Menu Button + User Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <UserMenu />
        <button onClick={onToggle} className="p-2 text-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/50 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onToggle}
                  className={cn(
                    'text-base font-medium transition-colors',
                    pathname === link.href ? 'text-primary' : 'text-black'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="default" size="lg" className="mt-2" asChild>
                <Link href="/kontakt">Zakaži pregled</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
