import { getTranslations } from 'next-intl/server';

import { buildAlternates } from '@/lib/seo';
import ServicesHero from '@/module/public/services/views/services-view/hero';

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.services' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/usluge'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
    },
  };
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
    </>
  );
}
