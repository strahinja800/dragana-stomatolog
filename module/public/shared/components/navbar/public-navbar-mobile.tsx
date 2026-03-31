import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Calendar, Mail, MapPin, Menu, Phone } from '@/constants/icons';
import { NAV_LINKS } from '@/constants/navigations';
import { logoIcon } from '@/data/data';
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
  const t = useTranslations('nav');

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <UserMenu />
        <button
          type="button"
          onClick={onOpen}
          className="rounded-xl border border-white/30 bg-white/10 p-2.5 text-primary-foreground shadow-[0_8px_20px_-14px_rgba(0,0,0,0.48)] transition-smooth hover:border-accent/60 hover:bg-white/16 hover:text-white"
          aria-label={t('bookOnline')}
        >
          <Menu className="size-6" />
        </button>
      </div>

      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="flex w-[86vw] max-w-sm flex-col gap-0 overflow-hidden border-0 data-[side=right]:border-l-0 p-0"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

          <SheetHeader className="relative border-b border-primary-strong/70 bg-primary/96 px-6 py-5 shadow-[0_14px_34px_-20px_rgba(1,111,126,0.95)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Image
                src={logoIcon}
                alt="DENTALHOLIST"
                width={294}
                height={309}
                className="h-10 w-auto object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.24)]"
              />
              <div className="sr-only">
                <SheetTitle>DENTALHOLIST</SheetTitle>
                <SheetDescription>Navigation</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="relative flex-1 px-4 py-6">
            <div className="space-y-2">
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
                    <span className="text-[15px] font-semibold">
                      {t(item.key)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 px-1">
              <Button
                size="lg"
                className="btn-shimmer shadow-soft hover:shadow-hover group w-full gap-2.5 rounded-2xl py-6 text-[15px] font-semibold"
                asChild
              >
                <Link href="/kontakt" onClick={onClose}>
                  <Calendar className="size-5 transition-transform duration-200 group-hover:scale-110" />
                  {t('bookOnline')}
                </Link>
              </Button>
            </div>
          </nav>

          <SheetFooter className="relative mt-auto border-t border-border/40 bg-muted/40 px-6 py-5">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {t('contact')}
                </p>
                <LanguageSwitcher variant="light" />
              </div>
              <div className="space-y-2.5 text-sm">
                <a
                  href="tel:+381111234567"
                  className="flex items-center gap-3 text-foreground/75 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 text-primary/70" />
                  <span>+381 11 123 4567</span>
                </a>
                <a
                  href="mailto:info@dentalholist.rs"
                  className="flex items-center gap-3 text-foreground/75 transition-colors hover:text-primary"
                >
                  <Mail className="size-4 text-primary/70" />
                  <span>info@dentalholist.rs</span>
                </a>
                <div className="flex items-center gap-3 text-foreground/75">
                  <MapPin className="size-4 text-primary/70" />
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
