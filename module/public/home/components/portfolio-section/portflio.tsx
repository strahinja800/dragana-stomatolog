import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { portfolioItems } from '@/data/data';

import Services from './services';

export default function PortfolioSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-kicker">Terapije i Tehnologija</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
              Usluge vođene preciznošću i iskustvom
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground lg:text-right">
            Savremena dijagnostika, individualni pristup i premium komfor u
            svakom koraku tretmana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Services props={portfolioItems} />
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="btn-shimmer rounded-full px-7">
            <Link href="/usluge">
              Pogledaj sve usluge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
