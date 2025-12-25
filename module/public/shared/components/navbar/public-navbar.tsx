'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, Phone, X } from 'lucide-react';

import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/constants/navigations';
import { cn } from '@/lib/utils';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <div className="rounded-xl flex items-center justify-center">
                <Image src={logo} alt="DentalCare" height={100} />
              </div>
              <span className="font-heading text-2xl font-semibold text-foreground">
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
                  'text-sm font-medium transition-colors text-[rgb(13,162,231)]',
                  pathname === link.href
                    ? 'text-[rgb(13,162,231)]'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+381111234567"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+381 11 123 4567</span>
            </a>
            <Button
              variant="hero"
              className="px-9 py-6 rounded-3xl text-base"
              asChild
            >
              <Link href="/kontakt">Zakaži pregled</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-base font-medium transition-colors py-2',
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
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
        )}
      </div>
    </header>
  );
}
