import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section className="py-24 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
            Spremni za savršen osmeh?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
            Zakažite besplatnu konsultaciju danas i napravite prvi korak ka
            osmehu iz snova.
          </p>
          <div className="flex flex-col sm:flex-row justify-center">
            <Button
              variant="outline"
              size="lg"
              className="px-18 py-7 rounded-3xl text-lg bg-white text-[rgb(13,162,231)]! hover:bg-card/90 font-semibold shadow-soft "
              asChild
            >
              <Link href="/kontakt">
                Zakaži pregled
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
