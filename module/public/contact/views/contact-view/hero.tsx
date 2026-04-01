'use server';

import { getTranslations } from 'next-intl/server';

export default async function ContactHero() {
  const t = await getTranslations('contact.hero');

  return (
    <section className="gradient-hero pt-34 pb-20 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h1 className="mt-5 text-4xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}
