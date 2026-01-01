import Image from 'next/image';
import Link from 'next/link';

import { Phone } from 'lucide-react';

import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/constants/navigations';
import { cn } from '@/lib/utils';

import UserMenu from './user-menu';

type PublicNavbarDesktopProps = {
  pathname: string;
};

export function PublicNavbarDesktop({ pathname }: PublicNavbarDesktopProps) {
  return (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center justify-center">
          <div className="rounded-xl flex items-center justify-center">
            <Image src={logo} alt="DentalCare" height={100} />
          </div>
          <span className="font-heading text-2xl font-semibold text-foreground max-[900px]:hidden">
            DentalCare
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors',
              pathname === link.href ? 'text-[rgb(13,162,231)]' : 'text-black'
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA Button + User Menu */}
      <div className="hidden md:flex items-center gap-4">
        <a
          href="tel:+381111234567"
          className="flex items-center gap-2 text-black hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">+381 11 123 4567</span>
        </a>
        <Button asChild>
          <Link href="/kontakt">Zakaži pregled</Link>
        </Button>
        <UserMenu />
      </div>
    </>
  );
}
