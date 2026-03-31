import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/constants/icons';

export default async function CtaSection() {
  const t = await getTranslations('home.cta');

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="section-shell gradient-primary px-6 py-12 text-center md:px-10">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/88">
            {t('description')}
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="xl"
              className="btn-shimmer rounded-full border-white/40 bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/kontakt">
                {t('button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
