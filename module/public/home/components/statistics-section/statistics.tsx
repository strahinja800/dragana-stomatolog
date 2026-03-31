'use client';

import { useTranslations } from 'next-intl';

import { ShieldCheck } from '@/constants/icons';
import { STATISTICS } from '@/constants/stats';

export default function StatisticsSection() {
  const t = useTranslations();

  return (
    <section className="-mt-8 py-8 md:-mt-10 md:py-10">
      <div className="container mx-auto px-4">
        <div className="section-shell gradient-card p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-4">
            {STATISTICS.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/80 p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(item.labelKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Zaštićeni od strane sigurnosti</span>
          </div>
        </div>
      </div>
    </section>
  );
}
