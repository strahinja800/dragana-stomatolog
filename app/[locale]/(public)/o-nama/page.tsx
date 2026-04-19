import { getTranslations } from 'next-intl/server';

import {
  absoluteUrl,
  buildAlternates,
  buildOgImages,
  OG_LOCALE,
  SITE_URL,
} from '@/lib/seo';
import { AboutView } from '@/module/public/about/views/about-view/about-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/o-nama'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: absoluteUrl(locale as 'sr' | 'en', '/o-nama'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
      images: buildOgImages(),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.about' });
  const pageUrl = absoluteUrl(locale as 'sr' | 'en', '/o-nama');

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
      <AboutView />
    </>
  );
}
