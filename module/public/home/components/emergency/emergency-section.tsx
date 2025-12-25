import Link from 'next/link';

import { AlertCircle, Phone } from 'lucide-react';

export default function EmergencySection() {
  return (
    <section className="py-8 gradient-primary from-primary to-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-primary-foreground">
                Hitna stomatološka pomoć 24/7
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                Dostupni smo non-stop za sve hitne slučajeve
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="tel:+381111234567"
              className="flex items-center gap-3 px-5 py-3 rounded-3xl bg-card text-foreground hover:bg-card/90 transition-colors shadow-soft"
            >
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Hitna linija</p>
                <p className="font-semibold">+381 11 123 4567</p>
              </div>
            </Link>
            <Link
              href="tel:+381631234567"
              className="flex items-center gap-3 px-5 py-3 rounded-3xl bg-card/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/20 hover:bg-card/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <div>
                <p className="text-xs text-primary-foreground/70">Mobilni</p>
                <p className="font-semibold">+381 63 123 4567</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
