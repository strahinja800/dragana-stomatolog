import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Phone } from '@/constants/icons';

export default function LocationSection() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">Lokacija</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            Posetite nas u centru Beograda
          </h2>
          <p className="mt-4 text-muted-foreground">
            Udoban prostor, moderna oprema i tim koji vas dočekuje bez žurbe.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="section-shell h-[420px] overflow-hidden border-border/70 lg:col-span-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.3890988073946!2d20.4565!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7ab4a0e4f4c9%3A0x5c4a4e4f4e4f4e4f!2sBelgrade%2C%20Serbia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokacija ordinacije"
            />
          </div>

          <div className="space-y-5">
            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Adresa</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bulevar Kralja Aleksandra 123
                    <br />
                    11000 Beograd, Srbija
                  </p>
                </div>
              </div>
            </article>

            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Telefon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    +381 11 123 4567
                    <br />
                    +381 63 123 4567
                  </p>
                </div>
              </div>
            </article>

            <article className="section-shell p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Radno vreme</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pon - Pet: 08:00 - 20:00
                    <br />
                    Sub: 09:00 - 14:00
                  </p>
                </div>
              </div>
            </article>

            <Button className="btn-shimmer w-full rounded-full" asChild>
              <a
                href="https://www.google.com/maps/dir//Belgrade,+Serbia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prikaži rutu
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
