import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function CtaServices() {
  return (
    <section className="py-24 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
            Imate pitanja o našim uslugama?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Naš tim je tu da odgovori na sva vaša pitanja i pomogne vam da
            odaberete pravi tretman za vas.
          </p>
          <Button
            size="xl"
            className="bg-card text-primary hover:bg-card/90 font-semibold shadow-soft"
            asChild
          >
            <Link href="/kontakt">
              Zakaži konsultaciju
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
