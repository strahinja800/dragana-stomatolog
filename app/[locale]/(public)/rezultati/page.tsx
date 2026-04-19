import { getTranslations } from 'next-intl/server';

import { beforeAfterCases } from '@/data/data';
import {
  absoluteUrl,
  buildAlternates,
  buildOgImages,
  OG_LOCALE,
  SITE_URL,
} from '@/lib/seo';
import BeforeAfterCompareCard from '@/module/public/home/components/before-after/before-after-compare-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.results' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/rezultati'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: absoluteUrl(locale as 'sr' | 'en', '/rezultati'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
      images: buildOgImages(),
    },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.results' });
  const pageUrl = absoluteUrl(locale as 'sr' | 'en', '/rezultati');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('title'),
        inLanguage: locale,
        about: { '@id': `${SITE_URL}/#business` },
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="gradient-hero min-h-screen pb-20 pt-32 md:pt-36">
        <section className="container mx-auto px-4 xl:px-6">
          <div className="mb-12 max-w-3xl">
            <span className="section-kicker">Svi Primeri</span>
            <h1 className="mt-4 text-4xl font-semibold text-foreground md:text-5xl lg:text-6xl">
              Pre i posle rezultati tretmana
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Anonimizovani primeri planiranih terapija sa interaktivnim
              prikazom.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {beforeAfterCases.map((item, index) => (
              <BeforeAfterCompareCard
                key={item.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
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
        </section>
      </main>
    </>
  );
}
