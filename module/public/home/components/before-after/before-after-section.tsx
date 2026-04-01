import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { beforeAfterCases } from '@/data/data';

import BeforeAfterCompareCard from './before-after-compare-card';

export default async function BeforeAfterSection() {
  const t = await getTranslations('home.beforeAfter');

  const cases = beforeAfterCases.slice(0, 2).map((item, i) => ({
    ...item,
    title: t(`case${i + 1}Title`),
    summary: t(`case${i + 1}Summary`),
    beforeLabel: t('beforeLabel'),
    afterLabel: t('afterLabel'),
  }));

  const hasMoreCases = beforeAfterCases.length > 2;

  return (
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4 xl:px-6">
        <div className="mb-12 max-w-2xl text-center md:mx-auto">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((item, index) => (
            <BeforeAfterCompareCard
              key={item.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
              title={item.title}
              summary={item.summary}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              beforeLabel={item.beforeLabel}
              afterLabel={item.afterLabel}
              initialPosition={50}
            />
          ))}
        </div>

        {hasMoreCases && (
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/rezultati">{t('allCasesButton')}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
