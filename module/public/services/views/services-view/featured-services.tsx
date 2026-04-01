import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Sparkles,
  Stethoscope,
} from '@/constants/icons';

export default async function FeaturedServices() {
  const t = await getTranslations('services');

  const featured = [
    {
      key: 'estetska',
      icon: Sparkles,
      title: t('items.estetska.title'),
      description: t('items.estetska.description'),
      features: [
        t('items.estetska.feature1'),
        t('items.estetska.feature2'),
        t('items.estetska.feature3'),
        t('items.estetska.feature4'),
      ],
    },
    {
      key: 'implantologija',
      icon: Heart,
      title: t('items.implantologija.title'),
      description: t('items.implantologija.description'),
      features: [
        t('items.implantologija.feature1'),
        t('items.implantologija.feature2'),
        t('items.implantologija.feature3'),
        t('items.implantologija.feature4'),
      ],
    },
    {
      key: 'ortodoncija',
      icon: Stethoscope,
      title: t('items.ortodoncija.title'),
      description: t('items.ortodoncija.description'),
      features: [
        t('items.ortodoncija.feature1'),
        t('items.ortodoncija.feature2'),
        t('items.ortodoncija.feature3'),
        t('items.ortodoncija.feature4'),
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">{t('featured.kicker')}</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            {t('featured.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {t('featured.description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {featured.map((service, index) => (
            <article
              key={service.key}
              className="group section-shell relative overflow-hidden p-7 transition-smooth hover:-translate-y-1 hover:shadow-hover-blue sm:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 h-1 w-full gradient-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-soft">
                  <service.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-accent-strong uppercase">
                  {t('featured.premiumBadge')}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {service.description}
              </p>

              <ul className="mt-5 space-y-2.5">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="link"
                className="mt-5 h-auto p-0 text-sm font-semibold text-primary"
              >
                <Link href="#zakazivanje-usluge">
                  {t('featured.bookButton')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
