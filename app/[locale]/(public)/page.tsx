import { getTranslations } from 'next-intl/server';

import { absoluteUrl, buildAlternates, OG_LOCALE, SITE_URL } from '@/lib/seo';
import BeforeAfterSection from '@/module/public/home/components/before-after/before-after-section';
import BlogSection from '@/module/public/home/components/blog/blog-section';
import BookingSection from '@/module/public/home/components/booking-section/booking-section-server';
import CtaSection from '@/module/public/home/components/cta/cta-section';
import HeroSection from '@/module/public/home/components/hero/home-hero-server';
import HomeFaqSection from '@/module/public/home/components/home-faq/home-faq-section';
import LeadDoctorSection from '@/module/public/home/components/lead-doctor/lead-doctor-section';
import LocationSection from '@/module/public/home/components/location/location-section';
import PortfolioSection from '@/module/public/home/components/portfolio-section/portflio';
import TeamSection from '@/module/public/home/components/team-section/team-section';
import TestimonialsSection from '@/module/public/home/components/testimonials/testimonials-section';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/'),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website' as const,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  void prefetch(trpc.blog.getPublishedPosts.queryOptions({ limit: 3 }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dentist',
        '@id': `${SITE_URL}/#business`,
        name: 'DENTALHOLIST KONCEPT',
        description: t('structuredData.businessDescription'),
        url: absoluteUrl(locale as 'sr' | 'en', '/'),
        telephone: '+381113000000',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Adresa ordinacije',
          addressLocality: 'Beograd',
          postalCode: '11000',
          addressCountry: 'RS',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+381113000000',
          contactType: 'customer service',
          availableLanguage: ['sr', 'en'],
        },
        knowsLanguage: ['sr', 'en'],
      },
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(locale as 'sr' | 'en', '/')}#webpage`,
        url: absoluteUrl(locale as 'sr' | 'en', '/'),
        name: t('home.title'),
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
      <HeroSection />
      <BookingSection />
      <PortfolioSection />
      <BeforeAfterSection />
      <LeadDoctorSection />
      <TeamSection />
      <TestimonialsSection />
      <HydrateClient>
        <BlogSection />
      </HydrateClient>
      <HomeFaqSection />
      <CtaSection />
      <LocationSection />
    </>
  );
}
