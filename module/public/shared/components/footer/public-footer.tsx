import Link from "next/link";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { SERVICES } from "@/constants/footer";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/constants/icons";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">D</span>
              </div>
              <span className="font-heading text-2xl font-semibold">DentalCare</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Vaš osmeh je naša misija. Pružamo vrhunsku stomatološku negu u modernom i opuštajućem okruženju.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Brzi linkovi</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Početna" },
                { href: "/usluge", label: "Usluge" },
                { href: "/o-nama", label: "O nama" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
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
              {SERVICES.map((service) => (
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
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  Bulevar Kralja Aleksandra 123<br />Beograd, Srbija
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+381111234567" className="text-background/70 hover:text-primary transition-colors text-sm">
                  +381 11 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@dentalcare.rs" className="text-background/70 hover:text-primary transition-colors text-sm">
                  info@dentalcare.rs
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  Pon - Pet: 08:00 - 20:00<br />Sub: 09:00 - 14:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} DentalCare. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
