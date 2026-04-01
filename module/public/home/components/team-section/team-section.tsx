import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/constants/icons';
import { team } from '@/data/data';

import TeamMembers from './team-members';

export default async function TeamSection() {
  const t = await getTranslations('home.team');

  const members = team.map((member, i) => ({
    ...member,
    name: t(`member${i + 1}Name`),
    role: t(`member${i + 1}Role`),
    specialty: t(`member${i + 1}Specialty`),
  }));

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>
        </div>

        <TeamMembers team={members} />

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full px-7">
            <Link href="/o-nama">
              {t('moreButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
