import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Pill,
  Shield,
  Smile,
  Syringe,
} from '@/constants/icons';

export default async function ServicesGrid() {
  const t = await getTranslations('services');

  const remaining = [
    {
      key: 'preventiva',
      icon: Shield,
      title: t('items.preventiva.title'),
      description: t('items.preventiva.description'),
      features: [
        t('items.preventiva.feature1'),
        t('items.preventiva.feature2'),
        t('items.preventiva.feature3'),
        t('items.preventiva.feature4'),
      ],
    },
    {
      key: 'endodoncija',
      icon: Syringe,
      title: t('items.endodoncija.title'),
      description: t('items.endodoncija.description'),
      features: [
        t('items.endodoncija.feature1'),
        t('items.endodoncija.feature2'),
        t('items.endodoncija.feature3'),
        t('items.endodoncija.feature4'),
      ],
    },
    {
      key: 'parodontologija',
      icon: Pill,
      title: t('items.parodontologija.title'),
      description: t('items.parodontologija.description'),
      features: [
        t('items.parodontologija.feature1'),
        t('items.parodontologija.feature2'),
        t('items.parodontologija.feature3'),
        t('items.parodontologija.feature4'),
      ],
    },
    {
      key: 'decja',
      icon: Smile,
      title: t('items.decja.title'),
      description: t('items.decja.description'),
      features: [
        t('items.decja.feature1'),
        t('items.decja.feature2'),
        t('items.decja.feature3'),
        t('items.decja.feature4'),
      ],
    },
    {
      key: 'hitna',
      icon: Clock,
      title: t('items.hitna.title'),
      description: t('items.hitna.description'),
      features: [
        t('items.hitna.feature1'),
        t('items.hitna.feature2'),
        t('items.hitna.feature3'),
        t('items.hitna.feature4'),
      ],
    },
  ];

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">{t('grid.kicker')}</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            {t('grid.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {t('grid.description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((service, index) => (
            <article
              key={service.key}
              className={`group section-shell overflow-hidden p-6 transition-smooth hover:-translate-y-1 hover:shadow-hover ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-accent">
                  <service.icon className="h-6 w-6 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>

              <ul
                className={`mt-5 gap-2 ${
                  index === 0 ? 'grid grid-cols-2' : 'space-y-2'
                }`}
              >
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="link"
                className="mt-4 h-auto p-0 text-sm font-semibold text-primary"
              >
                <Link href="#zakazivanje-usluge">
                  {t('grid.bookButton')}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
