import Link from 'next/link';

import { ArrowRight, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AboutCta() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="section-shell gradient-primary relative overflow-hidden px-6 py-14 md:px-12 md:py-16">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Postanite deo DENTALHOLIST priče
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/88">
              Zakažite prvi pregled i dobijte jasan plan terapije koji poštuje
              vaše vreme i ciljeve. Radujemo se susretu.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="xl"
                variant="outline"
                className="btn-shimmer rounded-full border-white/40 bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/kontakt">
                  Zakaži pregled
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-primary-foreground backdrop-blur hover:bg-white/15 hover:text-primary-foreground"
                asChild
              >
                <a href="tel:+381111234567">
                  <Phone className="mr-2 h-5 w-5" />
                  Pozovi odmah
                </a>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
              <MapPin className="h-4 w-4" />
              <span>Beograd, Srbija</span>
              <span className="mx-2 text-primary-foreground/30">|</span>
              <span>Pon-Pet 08:00 - 20:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
