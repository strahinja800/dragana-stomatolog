import Image from 'next/image';

import { GraduationCap } from '@/constants/icons';

const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Dr. Dragana Petrović',
    role: 'Osnivač i glavni stomatolog',
    specialty: 'Implantologija i estetska stomatologija',
    bio: 'Sa više od 15 godina iskustva, dr. Petrović je pokrenula DENTALHOLIST sa ciljem da pacijentima pruži stomatološku negu koja spaja visoku stručnost sa iskrenom brigom. Specijalizovala se u Beogradu i Beču.',
    imageUrl: null,
    imageAlt: 'Dr. Dragana Petrović',
  },
  {
    id: '2',
    name: 'Dr. Marko Nikolić',
    role: 'Ortodont',
    specialty: 'Ortodoncija i nevidljivi aparatići',
    bio: 'Specijalista ortodoncije sa fokusom na savremene tehnike ispravljanja zuba uz minimalan diskomfor.',
    imageUrl: null,
    imageAlt: 'Dr. Marko Nikolić',
  },
  {
    id: '3',
    name: 'Dr. Ana Jovanović',
    role: 'Dečji stomatolog',
    specialty: 'Pedijatrijska stomatologija',
    bio: 'Posvećena stvaranju pozitivnih iskustava za najmlađe pacijente, uz poseban pristup koji smanjuje strah od stomatologa.',
    imageUrl: null,
    imageAlt: 'Dr. Ana Jovanović',
  },
];

export default function AboutTeam() {
  const [lead, ...rest] = TEAM_MEMBERS;

  return (
    <section className="relative gradient-hero py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">Naš tim</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Ljudi iza DENTALHOLIST pristupa
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Posvećen tim stručnjaka koji vas vodi kroz svaki korak terapije.
          </p>
        </div>

        {lead && (
          <article className="mx-auto mb-10 max-w-4xl section-shell p-6 transition-smooth hover:shadow-hover-blue sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="relative shrink-0">
                <div className="overflow-hidden rounded-3xl border-2 border-primary/20">
                  <Image
                    src={lead.imageUrl ?? '/default-image.png'}
                    alt={lead.imageAlt ?? lead.name}
                    className="h-52 w-52 object-cover sm:h-60 sm:w-60"
                    width={240}
                    height={240}
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full gradient-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-glow">
                  Glavni stomatolog
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
        )}

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((member) => (
            <article
              key={member.id}
              className="group section-shell p-6 text-center transition-smooth hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="mx-auto mb-5 overflow-hidden rounded-2xl border border-border/60">
                <Image
                  src={member.imageUrl ?? '/default-image.png'}
                  alt={member.imageAlt ?? member.name}
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
