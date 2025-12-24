import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LocationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-4">
            Lokacija
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Pronađite nas
          </h2>
          <p className="text-muted-foreground">
            Posetite nas u centru Beograda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card border border-border h-[400px]">
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

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Adresa</h3>
                  <p className="text-muted-foreground text-sm">
                    Knez Mihailova 25<br />
                    11000 Beograd, Srbija
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Telefon</h3>
                  <p className="text-muted-foreground text-sm">
                    +381 11 123 4567<br />
                    +381 63 123 4567
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Radno vreme</h3>
                  <p className="text-muted-foreground text-sm">
                    Pon - Pet: 08:00 - 20:00<br />
                    Sub: 09:00 - 15:00
                  </p>
                </div>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full rounded-3xl text-lg py-6" asChild>
              <a
                href="https://www.google.com/maps/dir//Belgrade,+Serbia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prikaži rutu
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
