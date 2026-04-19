import { getTranslations } from 'next-intl/server';

import {
  absoluteUrl,
  buildAlternates,
  buildOgImages,
  OG_LOCALE,
  SITE_URL,
} from '@/lib/seo';
import { BlogView } from '@/module/public/blog/views/blog-view/blog-view';
import { HydrateClient } from '@/trpc/hydrate-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.blog' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/blog'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: absoluteUrl(locale as 'sr' | 'en', '/blog'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
      images: buildOgImages(),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.blog' });
  const pageUrl = absoluteUrl(locale as 'sr' | 'en', '/blog');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('title'),
        inLanguage: locale,
        about: { '@id': `${SITE_URL}/#business` },
      },
    ],
  };

  return (
    <HydrateClient>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogView />
    </HydrateClient>
  );
}
