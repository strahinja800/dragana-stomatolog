import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { GraduationCap } from '@/constants/icons';
import { teamDoctor1, teamDoctor2, teamDoctor3 } from '@/data/data';

export default async function AboutTeam() {
  const t = await getTranslations('about.team');

  const lead = {
    id: '1',
    name: t('lead.name'),
    role: t('lead.role'),
    specialty: t('lead.specialty'),
    bio: t('lead.bio'),
    imageUrl: null as string | null,
    image: teamDoctor1,
    imageAlt: t('lead.name'),
  };

  const rest = [
    {
      id: '2',
      name: t('member2.name'),
      role: t('member2.role'),
      specialty: t('member2.specialty'),
      bio: t('member2.bio'),
      imageUrl: null as string | null,
      image: teamDoctor2,
      imageAlt: t('member2.name'),
    },
    {
      id: '3',
      name: t('member3.name'),
      role: t('member3.role'),
      specialty: t('member3.specialty'),
      bio: t('member3.bio'),
      imageUrl: null as string | null,
      image: teamDoctor3,
      imageAlt: t('member3.name'),
    },
  ];

  return (
    <section className="relative gradient-hero py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <article className="mx-auto mb-10 max-w-4xl section-shell p-6 transition-smooth hover:shadow-hover-blue sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative shrink-0">
              <div className="overflow-hidden rounded-3xl border-2 border-primary/20">
                <Image
                  src={lead.imageUrl ?? lead.image}
                  alt={lead.imageAlt}
                  className="h-52 w-52 object-cover sm:h-60 sm:w-60"
                  width={240}
                  height={240}
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full gradient-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-glow">
                {t('leadBadge')}
              </div>
            </div>
            <div className="text-center sm:pt-2 sm:text-left">
              <h3 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {lead.name}
              </h3>
              <p className="mt-2 text-sm font-semibold tracking-[0.12em] text-primary uppercase">
                {lead.role}
              </p>
              {lead.specialty && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {lead.specialty}
                </p>
              )}
              {lead.bio && (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {lead.bio}
                </p>
              )}
            </div>
          </div>
        </article>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((member) => (
            <article
              key={member.id}
              className="group section-shell p-6 text-center transition-smooth hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="mx-auto mb-5 overflow-hidden rounded-2xl border border-border/60">
                <Image
                  src={member.imageUrl ?? member.image}
                  alt={member.imageAlt}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={320}
                  height={192}
                />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="mt-1.5 text-sm font-semibold tracking-wide text-primary uppercase">
                {member.role}
              </p>
              {member.specialty && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {member.specialty}
                </p>
              )}
              {member.bio && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
