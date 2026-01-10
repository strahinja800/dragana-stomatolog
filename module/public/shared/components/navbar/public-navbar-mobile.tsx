import Link from 'next/link';

import { Calendar, Mail, MapPin, Menu, Phone, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { NAV_LINKS } from '@/constants/navigations';
import { cn } from '@/lib/utils';

import UserMenu from './user-menu';

type PublicNavbarMobileProps = {
  pathname: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function PublicNavbarMobile({
  pathname,
  isOpen,
  onOpen,
  onClose,
}: PublicNavbarMobileProps) {
  return (
    <>
      {/* Mobile Menu Button + User Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <UserMenu />
        <button
          onClick={onOpen}
          className="text-foreground hover:bg-primary/10 rounded-xl p-2.5 transition-colors"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="flex w-[85vw] max-w-sm flex-col gap-0 overflow-hidden border-l-0 p-0"
        >
          {/* Decorative background gradient */}
          <div className="from-primary/5 via-primary/3 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />

          {/* Header */}
          <SheetHeader className="relative border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="shadow-soft flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold tracking-tight">
                  DentalCare
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Stomatološka ordinacija
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="relative flex-1 px-4 py-6">
            <div className="space-y-1.5">
              {NAV_LINKS.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200',
                      isActive
                        ? 'shadow-soft bg-primary text-white'
                        : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-white/20'
                          : 'bg-primary/10 group-hover:bg-primary/20'
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-5 transition-transform duration-200 group-hover:scale-110',
                          isActive ? 'text-white' : 'text-primary'
                        )}
                      />
                    </div>
                    <span className="text-[15px] font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="mt-8 px-1">
              <Button
                size="lg"
                className="shadow-soft hover:shadow-hover group w-full gap-2.5 rounded-2xl py-6 text-[15px] font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/kontakt" onClick={onClose}>
                  <Calendar className="size-5 transition-transform duration-200 group-hover:scale-110" />
                  Zakaži pregled
                </Link>
              </Button>
            </div>
          </nav>

          {/* Footer with contact info */}
          <SheetFooter className="relative mt-auto border-t border-border/40 bg-muted/30 px-6 py-5">
            <div className="w-full space-y-3">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Kontakt informacije
              </p>
              <div className="space-y-2.5">
                <a
                  href="tel:+381601234567"
                  className="text-foreground/70 hover:text-primary flex items-center gap-3 text-sm transition-colors"
                >
                  <Phone className="text-primary/60 size-4" />
                  <span>+381 60 123 4567</span>
                </a>
                <a
                  href="mailto:info@dentalcare.rs"
                  className="text-foreground/70 hover:text-primary flex items-center gap-3 text-sm transition-colors"
                >
                  <Mail className="text-primary/60 size-4" />
                  <span>info@dentalcare.rs</span>
                </a>
                <div className="text-foreground/70 flex items-center gap-3 text-sm">
                  <MapPin className="text-primary/60 size-4" />
                  <span>Beograd, Srbija</span>
                </div>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
