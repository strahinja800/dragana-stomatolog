import { getTranslations } from 'next-intl/server';

import { buildAlternates } from '@/lib/seo';
import { AboutView } from '@/module/public/about/views/about-view/about-view';

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

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
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
    },
  };
}

export default function AboutPage() {
  return <AboutView />;
}
