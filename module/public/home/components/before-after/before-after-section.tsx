import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { beforeAfterCases } from '@/data/data';

import BeforeAfterCompareCard from './before-after-compare-card';

export default function BeforeAfterSection() {
  const featuredCases = beforeAfterCases.slice(0, 2);
  const hasMoreCases = beforeAfterCases.length > 2;

  return (
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4 xl:px-6">
        <div className="mb-12 max-w-2xl text-center md:mx-auto">
          <span className="section-kicker">Rezultati Tretmana</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Pre i posle terapije uz interaktivni prikaz
          </h2>
          <p className="mt-4 text-muted-foreground">
            Prevucite klizač levo-desno da uporedite rezultate anonimizovanih
            slučajeva tretmana.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredCases.map((item, index) => (
            <BeforeAfterCompareCard
              key={item.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
              title={item.title}
              summary={item.summary}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              beforeLabel={item.beforeLabel ?? 'PRE'}
              afterLabel={item.afterLabel ?? 'POSLE'}
              initialPosition={50}
            />
          ))}
        </div>

        {hasMoreCases && (
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/rezultati">Pogledaj sve primere</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
