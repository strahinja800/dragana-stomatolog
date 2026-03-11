import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from '@/constants/icons';
import { SERVICES } from '@/constants/services';

const REMAINING_INDICES = [0, 4, 5, 6, 7]; // Preventivna, Endodoncija, Parodontologija, Decja, Hitna

export default function ServicesGrid() {
  const remaining = REMAINING_INDICES.map((i) => SERVICES[i]);

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">Kompletna ponuda</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Sve stomatološke usluge
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Pored premium tretmana, pružamo kompletan spektar stomatoloških
            usluga za celu porodicu.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((service, index) => (
            <article
              key={service.title}
              className={`group section-shell overflow-hidden p-6 transition-smooth hover:-translate-y-1 hover:shadow-hover ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-accent">
                  <service.icon className="h-6 w-6 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>

              <ul
                className={`mt-5 gap-2 ${
                  index === 0 ? 'grid grid-cols-2' : 'space-y-2'
                }`}
              >
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="link"
                className="mt-4 h-auto p-0 text-sm font-semibold text-primary"
              >
                <Link href="#zakazivanje-usluge">
                  Zakaži ovu uslugu
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
