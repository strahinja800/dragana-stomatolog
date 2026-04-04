import { getTranslations } from 'next-intl/server';

import { buildAlternates } from '@/lib/seo';
import { BlogView } from '@/module/public/blog/views/blog-view/blog-view';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

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
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
    },
  };
}

export default function BlogPage() {
  void prefetch(trpc.blog.getPublishedPosts.queryOptions());

  return (
    <HydrateClient>
      <BlogView />
    </HydrateClient>
  );
}
