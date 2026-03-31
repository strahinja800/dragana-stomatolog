import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/constants/icons';
import { portfolioItems } from '@/data/data';

import Services from './services';

export default async function PortfolioSection() {
  const t = await getTranslations('home.portfolio');

  const items = portfolioItems.map((item, i) => ({
    ...item,
    title: t(`item${i + 1}Title`),
    description: t(`item${i + 1}Description`),
  }));

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-kicker">{t('kicker')}</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
              {t('title')}
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground lg:text-right">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Services props={items} />
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="btn-shimmer rounded-full px-7">
            <Link href="/usluge">
              {t('allServicesButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
