import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Calendar } from '@/constants/icons';
import { NAV_LINKS } from '@/constants/navigations';
import { logoIcon, logoText } from '@/data/data';
import { cn } from '@/lib/utils';

type PublicNavbarDesktopProps = {
  pathname: string;
};

export function PublicNavbarDesktop({ pathname }: PublicNavbarDesktopProps) {
  const t = useTranslations('nav');

  return (
    <>
      <Link href="/" className="group flex min-w-0 items-center gap-2">
        <Image
          src={logoIcon}
          alt="DENTALHOLIST"
          width={294}
          height={309}
          className="h-10 w-auto object-contain drop-shadow-[0_7px_18px_rgba(0,0,0,0.34)] transition-smooth group-hover:scale-[1.01] sm:h-12"
          priority
        />
        <Image
          src={logoText}
          alt="DENTALHOLIST"
          width={935}
          height={96}
          className="hidden h-5 w-auto object-contain sm:block sm:h-6"
        />
      </Link>

      <div className="hidden items-center lg:flex lg:gap-3 xl:gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'relative text-sm font-semibold tracking-wide transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300',
              pathname === link.href
                ? 'text-accent after:scale-x-100'
                : 'text-primary-foreground/85 hover:text-accent hover:after:scale-x-100'
            )}
          >
            {t(link.key)}
          </Link>
        ))}
      </div>

      <div className="hidden items-center lg:flex">
        <Link
          href="/kontakt"
          className="flex items-center gap-2 rounded-full border border-white/28 bg-white/12 px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_20px_-14px_rgba(0,0,0,0.5)] transition-smooth hover:border-accent/60 hover:bg-white/18 hover:text-white"
        >
          <Calendar className="size-4" />
          <span>{t('bookOnline')}</span>
        </Link>
      </div>
    </>
  );
}
