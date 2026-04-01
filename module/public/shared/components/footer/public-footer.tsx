import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import {
  FOOTER_CONTACT,
  FOOTER_SERVICE_KEYS,
  FOOTER_SOCIAL_LINKS,
} from '@/constants/footer';
import { NAV_LINKS } from '@/constants/navigations';
import { logoGoldTransparent } from '@/data/data';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative overflow-hidden bg-[#0a2e33] text-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,181,107,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(3,144,159,0.15),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={logoGoldTransparent}
                alt="DENTALHOLIST"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-background/78">
              {t('footer.brandDescription')}
            </p>
            <div className="flex items-center gap-2 pt-2">
              {FOOTER_SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg bg-background/10 p-2 transition-colors hover:bg-accent/20 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={t(link.labelKey)}
                >
                  <link.icon className="h-5 w-5 md:h-6 md:w-6" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_SERVICE_KEYS.map((key) => (
                <li key={key}>
                  <span className="text-sm text-background/70">
                    {t(`services.items.${key}.title`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              {FOOTER_CONTACT.map((item) => (
                <li key={item.type} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-background/70 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-background/70">
                      {item.lines?.map((line, index) => (
                        <span key={line}>
                          {line}
                          {index < item.lines!.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} DENTALHOLIST KONCEPT.{' '}
            {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
