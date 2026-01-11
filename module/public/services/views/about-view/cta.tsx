import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AboutCta() {
  return (
    <section className="py-24 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
            Pridružite se našoj porodici pacijenata
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Zakažite vaš prvi pregled i otkrijte zašto nas pacijenti vole.
          </p>
          <Button
            size="xl"
            variant="outline"
            className="px-18 py-7 rounded-3xl text-lg bg-white text-[rgb(13,162,231)] hover:bg-card/90 font-semibold shadow-soft "
            asChild
          >
            <Link href="/kontakt">
              Zakaži pregled
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
