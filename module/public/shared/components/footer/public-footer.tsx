import Link from 'next/link';

import {
  FOOTER_BRAND,
  FOOTER_CONTACT,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
  FOOTER_SOCIAL_LINKS,
} from '@/constants/footer';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">
                  D
                </span>
              </div>
              <span className="font-heading text-2xl font-semibold">
                {FOOTER_BRAND.name}
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              {FOOTER_BRAND.description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {FOOTER_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors"
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">
              Brzi linkovi
            </h3>
            <ul className="space-y-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Usluge</h3>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li key={service}>
                  <span className="text-background/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Kontakt</h3>
            <ul className="space-y-4">
              {FOOTER_CONTACT.map((item) => (
                <li key={item.type} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-background/70 hover:text-primary transition-colors text-sm"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-background/70 text-sm">
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

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} {FOOTER_BRAND.name}. Sva prava
            zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
