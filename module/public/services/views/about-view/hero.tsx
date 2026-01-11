import Image from 'next/image';

import { dentist1, dentist2 } from '@/data/data';

export default function AboutHero() {
  return (
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium">
              O nama
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Vaš osmeh je naša misija
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Od 2009. godine, DentalCare je sinonim za kvalitetnu stomatološku
              negu u Beogradu. Naš tim posvećenih stručnjaka kombinuje
              stručnost, empatiju i najmoderniju tehnologiju kako bi svakom
              pacijentu pružio osmeh iz snova.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-[rgb(13,162,231)]">
                  15+
                </p>
                <p className="text-sm text-muted-foreground">Godina iskustva</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-[rgb(13,162,231)]">
                  10,000+
                </p>
                <p className="text-sm text-muted-foreground">Pacijenata</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-[rgb(13,162,231)]">
                  7
                </p>
                <p className="text-sm text-muted-foreground">Specijalista</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image
              src={dentist1}
              alt="Tim DentalCare"
              className="rounded-2xl shadow-card w-full h-80 object-cover"
            />
            <Image
              src={dentist2}
              alt="Ordinacija"
              className="rounded-2xl shadow-card w-full h-80 object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
